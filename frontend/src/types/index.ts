export type DemoType =
  | 'live_container'
  | 'static_web'
  | 'video'
  | 'simulation_media'
  | 'model_3d';

export interface ReadinessCheckItem {
  key: string;
  label: string;
  weight: number;
  completed: boolean;
}

export interface Project {
  id: number;
  title: string;
  domain: string;
  description: string;
  problem_statement: string;
  team: string;
  team_size: number;
  team_roles: string;
  year: number;
  branch: string;
  tags: string[];
  tech_stack: string[];
  github_url: string;
  demo_url: string;
  docs_url: string;
  media_urls: string[];
  demo_type: DemoType;

  check_description: boolean;
  check_team: boolean;
  check_demo: boolean;
  check_docs: boolean;
  check_tech_stack: boolean;
  check_media: boolean;
  check_faculty_verified: boolean;

  readiness_score: number;
  is_production_ready: boolean;
  readiness_breakdown: ReadinessCheckItem[];

  owner_id?: number;
  owner_name?: string;
  is_saved: boolean;
  is_owner: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Domain {
  id: number;
  name: string;
  slug: string;
  description: string;
  project_count: number;
}

export interface Stats {
  projects_listed: number;
  production_ready: number;
  threshold: number;
  domains_count: number;
  by_domain: Record<string, number>;
  by_branch: Record<string, number>;
  branches: string[];
  years: number[];
  tags: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'recruiter' | 'admin';
  organization?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
