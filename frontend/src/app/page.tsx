import DiscoverClient from '@/components/DiscoverClient';
import { fetchProjects, fetchStats, fetchDomains } from '@/lib/api';
import { Project, Stats, Domain } from '@/types';

export const dynamic = 'force-dynamic';

export default async function DiscoverPage() {
  let initialProjects: Project[] = [];
  let initialStats: Stats = {
    projects_listed: 5,
    production_ready: 4,
    threshold: 75,
    domains_count: 6,
    by_domain: {},
    by_branch: {},
    branches: [],
    years: [2026, 2025],
    tags: [],
  };
  let initialDomains: Domain[] = [];

  try {
    const [projectsData, statsData, domainsData] = await Promise.all([
      fetchProjects(),
      fetchStats(),
      fetchDomains(),
    ]);
    initialProjects = projectsData;
    initialStats = statsData;
    initialDomains = domainsData;
  } catch (error) {
    console.error('Server fetch error:', error);
  }

  return (
    <DiscoverClient
      initialProjects={initialProjects}
      initialStats={initialStats}
      initialDomains={initialDomains}
    />
  );
}
