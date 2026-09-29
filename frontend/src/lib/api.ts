import { Project, Stats, Domain, User, AuthResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('projexus_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchDomains(): Promise<Domain[]> {
  const res = await fetch(`${API_BASE}/domains`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch domains');
  return res.json();
}

export interface ProjectQueryParams {
  domain?: string;
  q?: string;
  year?: number;
  branch?: string;
  tech_tag?: string;
  min_readiness?: number;
  max_readiness?: number;
  demo_type?: string;
  saved_only?: boolean;
}

export async function fetchProjects(params?: ProjectQueryParams): Promise<Project[]> {
  const url = new URL(`${API_BASE}/projects`);
  if (params) {
    if (params.domain && params.domain !== 'ALL') url.searchParams.set('domain', params.domain);
    if (params.q) url.searchParams.set('q', params.q);
    if (params.year) url.searchParams.set('year', params.year.toString());
    if (params.branch && params.branch !== 'ALL') url.searchParams.set('branch', params.branch);
    if (params.tech_tag) url.searchParams.set('tech_tag', params.tech_tag);
    if (params.min_readiness !== undefined) url.searchParams.set('min_readiness', params.min_readiness.toString());
    if (params.max_readiness !== undefined) url.searchParams.set('max_readiness', params.max_readiness.toString());
    if (params.demo_type && params.demo_type !== 'ALL') url.searchParams.set('demo_type', params.demo_type);
    if (params.saved_only) url.searchParams.set('saved_only', 'true');
  }

  const res = await fetch(url.toString(), {
    headers: { ...getAuthHeader() },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function fetchProject(id: string | number): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    headers: { ...getAuthHeader() },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Project not found');
  return res.json();
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Failed to create project' }));
    throw new Error(error.detail || 'Failed to create project');
  }
  return res.json();
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Failed to update project' }));
    throw new Error(error.detail || 'Failed to update project');
  }
  return res.json();
}

export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

export async function toggleBookmark(id: number): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}/bookmark`, {
    method: 'POST',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error('Please log in to save projects');
    throw new Error('Failed to toggle bookmark');
  }
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
  organization?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(err.detail || 'Registration failed');
  }
  return res.json();
}

export async function fetchCurrentUser(): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}
