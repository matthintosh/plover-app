// Supabase Edge Function: Invite Patient
// This function handles patient invitations using the admin API
// It requires the service role key to be set in the Supabase dashboard

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with the user's access token
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Service role key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create admin client with service role key
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Create user client to verify the request
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify the user is authenticated
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { email, periodontistId } = await req.json();

    if (!email || !periodontistId) {
      return new Response(
        JSON.stringify({ error: 'Missing email or periodontistId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the periodontistId matches the authenticated user
    if (user.id !== periodontistId) {
      return new Response(
        JSON.stringify({ error: 'Periodontist ID does not match authenticated user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Invite the user via admin API
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
      email,
      {
        data: { invited_by: periodontistId },
      }
    );

    if (inviteError || !inviteData?.user) {
      return new Response(
        JSON.stringify({ error: inviteError?.message ?? 'Failed to invite user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create patient profile using RPC function
    const { data: patientData, error: patientError } = await adminClient.rpc('create_patient_profile', {
      p_id: inviteData.user.id,
      p_email: email,
      p_periodontist_id: periodontistId,
    });

    if (patientError || !patientData) {
      // If patient creation fails, we should ideally rollback the user creation
      // For now, we'll just return an error
      return new Response(
        JSON.stringify({ error: patientError?.message ?? 'Failed to create patient profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        id: patientData.id,
        email: patientData.email,
        periodontistId: patientData.periodontist_id,
        accountStatus: patientData.account_status,
        onboardingCompleted: patientData.onboarding_completed,
        createdAt: patientData.created_at,
        updatedAt: patientData.updated_at,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

