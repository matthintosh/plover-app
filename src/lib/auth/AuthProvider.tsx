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
  fullName: string | null;
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
  const [userType, setUserType] = useState<'periodontist' | 'patient' | null>(null);

  useEffect(() => {
    const periodontistRepository = new PeriodontistRepository();
    const patientRepository = new PatientRepository();
    let active = true;

    const clearProfiles = () => {
      if (!active) {
        return;
      }
      setPeriodontist(null);
      setPatient(null);
      setUserType(null);
    };

    const resolveSession = async (nextSession: Session | null) => {
      if (!active) {
        return;
      }

      setIsLoading(true);

      const nextUser = nextSession?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        clearProfiles();
        setIsLoading(false);
        return;
      }

      let resolvedUserType: 'periodontist' | 'patient' | null = null;

      try {
        const email = nextUser.email?.toLowerCase() ?? null;

        if (!email) {
          clearProfiles();
          return;
        }

        const periodontistProfile = await periodontistRepository.findByEmail(email);

        if (!active) {
          return;
        }

        if (periodontistProfile) {
          setPeriodontist({
            id: periodontistProfile.id,
            email: periodontistProfile.email,
            fullName: periodontistProfile.fullName,
            professionalCredentials: periodontistProfile.professionalCredentials,
            accountStatus: periodontistProfile.accountStatus,
          });
          setPatient(null);
          resolvedUserType = 'periodontist';
        } else {
          setPeriodontist(null);

          const patientProfile = await patientRepository.findByEmail(email);

          if (!active) {
            return;
          }

          if (patientProfile) {
            setPatient({
              id: patientProfile.id,
              email: patientProfile.email,
              fullName: patientProfile.fullName,
              periodontistId: patientProfile.periodontistId,
              onboardingCompleted: patientProfile.onboardingCompleted,
              accountStatus: patientProfile.accountStatus,
            });
            resolvedUserType = 'patient';
          } else {
            setPatient(null);
          }
        }
      } catch (error) {
        console.warn('[AuthProvider] Failed to resolve user profile', error);
        clearProfiles();
      } finally {
        if (active) {
          setUserType(resolvedUserType);
          setIsLoading(false);
        }
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      void resolveSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void resolveSession(session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = Boolean(user && userType);

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('[AuthProvider] Sign out error', error);
    }
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

