import axios from 'axios';
import type {
  Component,
  PaginatedResponse,
  ComponentFilters,
  ApiResponse,
  ContributionRequest,
  ContributionRequestInput,
} from '@aem-portal/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

  getById: async (id: string): Promise<Component> => {
    const response = await api.get<ApiResponse<Component>>(`/api/components/${id}`);
    return response.data.data!;
  },

  getBySlug: async (slug: string): Promise<Component> => {
    const response = await api.get<ApiResponse<Component>>(`/api/components/slug/${slug}`);
    return response.data.data!;
  },

  getTags: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/api/components/tags');
    return response.data.data!;
  },

  getTeams: async (): Promise<string[]> => {
    const response = await api.get<ApiResponse<string[]>>('/api/components/teams');
    return response.data.data!;
  },
};

// Wiki API
export const wikiApi = {
  getContent: async (path: string): Promise<string> => {
    const response = await api.get<ApiResponse<{ content: string }>>(
      `/api/wiki/content?path=${encodeURIComponent(path)}`
    );
    return response.data.data!.content;
  },
};

// Contribution API
export const contributionApi = {
  create: async (input: ContributionRequestInput): Promise<ContributionRequest> => {
    const response = await api.post<ApiResponse<ContributionRequest>>(
      '/api/contributions',
      input
    );
    return response.data.data!;
  },

  getAll: async (
    page?: number,
    pageSize?: number
  ): Promise<PaginatedResponse<ContributionRequest>> => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());

    const response = await api.get<ApiResponse<PaginatedResponse<ContributionRequest>>>(
      `/api/contributions?${params.toString()}`
    );
    return response.data.data!;
  },

  getMy: async (): Promise<PaginatedResponse<ContributionRequest>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<ContributionRequest>>>(
      '/api/contributions/my'
    );
    return response.data.data!;
  },
};

export default api;
