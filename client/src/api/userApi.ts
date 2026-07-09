'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export interface Profile {
  name: string;
  title: string;
  bio: string;
  heroTitle: string;
  heroSubtitle: string;
  cvUrl: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
}

const emptyProfile: Profile = {
  name: '',
  title: '',
  bio: '',
  heroTitle: 'CREATIVE\nDEVELOPER',
  heroSubtitle: 'Full Stack Web Developer',
  cvUrl: null,
  email: '',
  github: '',
  linkedin: '',
};

// Hook for User Login
export function useUserLogin() {
  const mutation = useMutation({
    mutationFn: async ({ emailInput, passwordInput }: { emailInput: string; passwordInput: string }) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data.token;
    },
  });

  return {
    login: (emailInput: string, passwordInput: string) =>
      mutation.mutateAsync({ emailInput, passwordInput }),
    isLoading: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}

// Fetch helper for Profile query
const fetchProfileFn = async (): Promise<Profile> => {
  const res = await fetch(`${API_BASE}/profile`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

// Hook for fetching Profile
export function useGetProfile() {
  const query = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: fetchProfileFn,
  });

  return {
    profile: query.data || emptyProfile,
    fetchProfile: query.refetch,
    isLoading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
  };
}

// Hook for updating Profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ profileData, token }: { profileData: Profile; token: string }) => {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    updateProfile: (profileData: Profile, token: string) =>
      mutation.mutateAsync({ profileData, token }),
    isLoading: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}

// Hook for uploading CV File
export function useUploadCv() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ file, token }: { file: File; token: string }) => {
      const formData = new FormData();
      formData.append('cv', file);

      const res = await fetch(`${API_BASE}/profile/upload-cv`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload CV');
      return data.cvUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return {
    uploadCv: (file: File, token: string) => mutation.mutateAsync({ file, token }),
    isLoading: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}
