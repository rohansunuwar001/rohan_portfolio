'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  demoLink: string | null;
  githubLink: string | null;
  tags: string;
  featured: boolean;
  order: number;
}

// Fetch helper for Projects query
const fetchProjectsFn = async (): Promise<Project[]> => {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

// Hook for fetching Projects
export function useGetProjects() {
  const query = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: fetchProjectsFn,
  });

  return {
    projects: query.data || [],
    fetchProjects: query.refetch,
    isLoading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
  };
}

// Hook for creating Project
export function useCreateProject() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      projectData,
      token,
    }: {
      projectData: Omit<Project, 'id' | 'imageUrl'> & { imageUrl: string | null };
      token: string;
    }) => {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed saving project');
      return data.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const uploadProjectImage = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/projects/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed uploading image');
    return data.imageUrl;
  };

  return {
    createProject: (
      projectData: Omit<Project, 'id' | 'imageUrl'> & { imageUrl: string | null },
      token: string
    ) => mutation.mutateAsync({ projectData, token }),
    uploadProjectImage,
    isLoading: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}

// Hook for deleting Project
export function useDeleteProject() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ id, token }: { id: number; token: string }) => {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete project');
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    deleteProject: (id: number, token: string) => mutation.mutateAsync({ id, token }),
    isLoading: mutation.isPending,
    error: mutation.error ? (mutation.error as Error).message : null,
  };
}
