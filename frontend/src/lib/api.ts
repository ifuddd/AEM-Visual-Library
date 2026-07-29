import axios from 'axios';
import type {
  Component,
  PaginatedResponse,
  ComponentFilters,
  ApiResponse,
} from '@aem-portal/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
// Note: Check for browser environment to avoid SSR issues
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Component API
export const componentApi = {
  getAll: async (
    filters?: ComponentFilters,
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResponse<Component>> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.tags) filters.tags.forEach((tag) => params.append('tags', tag));
    if (filters?.status) filters.status.forEach((status) => params.append('status', status));
    if (filters?.ownerTeam) params.append('ownerTeam', filters.ownerTeam);
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());

    const response = await api.get<ApiResponse<PaginatedResponse<Component>>>(
      `/api/components?${params.toString()}`
    );
    return response.data.data!;
  },

  getBySlug: async (slug: string): Promise<Component> => {
    const response = await api.get<ApiResponse<Component>>(`/api/components/slug/${slug}`);
    return response.data.data!;
  },

  getTeams: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/api/components/teams');
    return response.data.data!;
  },
};

export default api;
