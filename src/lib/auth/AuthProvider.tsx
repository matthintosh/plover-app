import type { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { PatientRepository } from '@/features/authentication/repository/patient.repository';
import { PeriodontistRepository } from '@/features/authentication/repository/periodontist.repository';
import { supabase } from '@/lib/supabase/client';

export interface AuthContextType {
  user: User | null;
  periodontist: Periodontist | null;
  patient: Patient | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userType: 'periodontist' | 'patient' | null;
  setUser: (user: User | null) => void;
  setPeriodontist: (periodontist: Periodontist | null) => void;
  setPatient: (patient: Patient | null) => void;
  logout: () => Promise<void>;
}

export interface Periodontist {
  id: string;
  email: string;
  fullName: string;
  professionalCredentials?: string | null;
  accountStatus: 'active' | 'inactive' | 'suspended';
}

export interface Patient {
  id: string;
  email: string;
  periodontistId: string;
  onboardingCompleted: boolean;
  accountStatus: 'pending' | 'active' | 'inactive';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [periodontist, setPeriodontist] = useState<Periodontist | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'periodontist' | 'patient' | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        setIsAuthenticated(true);
      }
      if(event === 'SIGNED_OUT'){
        setIsAuthenticated(false);
        setUser(null);
        setPeriodontist(null);
        setPatient(null);
        setUserType(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const periodontistRepository = new PeriodontistRepository();
    const patientRepository = new PatientRepository();
    if(!session){
      setIsAuthenticated(false);
      return;
    }
    async function getUserType(){
      try {
        const periodontist = await periodontistRepository.findByEmail(session!.user!.email!);
        setPeriodontist(periodontist ?? null);
        if(periodontist){
          return;
        }
        const patient = await patientRepository.findByEmail(session!.user!.email!);
        setPatient(patient ?? null);
      } catch (error) {
        console.error('[AuthProvider] Error getting user type', error);
        setIsLoading(false);
        setUserType(null);
      }
      finally {
        setIsLoading(false);
      }
    }
    getUserType();
  }, [session]);

  useEffect(() => {
    if(patient){
     setIsAuthenticated(true);
     setUserType("patient")
     setIsLoading(false);
    }
    if(periodontist){
      setIsAuthenticated(true);
      setUserType("periodontist")
      setIsLoading(false);
    }
  }, [patient, periodontist]);

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('[AuthProvider] Sign out error', error);
    }
    setIsAuthenticated(false);
    setUser(null);
    setPeriodontist(null);
    setPatient(null);
    setUserType(null);
  };

  const value: AuthContextType = {
    user,
    periodontist,
    patient,
    isLoading,
    isAuthenticated,
    userType,
    setUser,
    setPeriodontist,
    setPatient,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

