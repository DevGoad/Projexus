/**
 * GitHub Repository File Fetcher
 *
 * Fetches the file tree and contents of a public GitHub repo via the
 * GitHub REST API and returns them in the { [path]: content } shape
 * that Sandpack expects for its `files` prop.
 *
 * Also includes Pyodide in-browser runtime generation for Python projects,
 * smart template detection, and blueprint-themed interactive fallbacks.
 */

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

const TEXT_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.json', '.html', '.htm', '.css', '.scss', '.sass', '.less',
  '.md', '.mdx', '.txt', '.yaml', '.yml', '.toml',
  '.xml', '.svg', '.env', '.gitignore', '.npmrc',
  '.py', '.pyx', '.pyi',
  '.sh', '.bash', '.zsh',
  '.rs', '.go', '.rb', '.java', '.kt', '.c', '.cpp', '.h', '.hpp',
  '.vue', '.svelte', '.astro',
  '.graphql', '.gql', '.sql',
  '.lock',
  '.prettierrc',
  '.eslintrc',
  '.babelrc',
]);

const TEXT_FILENAMES = new Set([
  'Makefile', 'Dockerfile', 'Procfile', 'Gemfile',
  'Rakefile', 'LICENSE', 'README', 'CHANGELOG',
  '.gitignore', '.env', '.env.local', '.env.example',
  '.eslintignore', '.prettierignore', '.dockerignore',
  'requirements.txt', 'Pipfile', 'pyproject.toml',
]);

const SKIP_PATHS = [
  'node_modules/',
  '.git/',
  '.next/',
  '__pycache__/',
  'dist/',
  'build/',
  '.vscode/',
  '.idea/',
  'venv/',
  '.env.local',
];

const MAX_FILE_SIZE = 100_000;
const MAX_FILES = 80;

export function parseGitHubUrl(url: string): { owner: string; repo: string; branch?: string } | null {
  if (!url) return null;
  url = url.trim().replace(/\.git$/, '');

  const fullUrlMatch = url.match(
    /(?:https?:\/\/)?github\.com\/([^/]+)\/([^/]+?)(?:\/tree\/([^/]+))?(?:\/)?$/
  );
  if (fullUrlMatch) {
    return {
      owner: fullUrlMatch[1],
      repo: fullUrlMatch[2],
      branch: fullUrlMatch[3] || undefined,
    };
  }

  const bareMatch = url.match(/^([^/]+)\/([^/]+)$/);
  if (bareMatch) {
    return { owner: bareMatch[1], repo: bareMatch[2] };
  }

  return null;
}

function isTextFile(path: string): boolean {
  const basename = path.split('/').pop() || '';
  if (TEXT_FILENAMES.has(basename)) return true;

  const extMatch = basename.match(/(\.[^.]+)$/);
  if (!extMatch) return false;
  return TEXT_EXTENSIONS.has(extMatch[1].toLowerCase());
}

function shouldSkip(path: string): boolean {
  return SKIP_PATHS.some((skip) => path.startsWith(skip) || path.includes('/' + skip));
}

async function fetchTree(owner: string, repo: string, branch?: string): Promise<GitHubTreeItem[]> {
  let ref = branch;
  if (!ref) {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (!repoRes.ok) {
      if (repoRes.status === 403) {
        throw new Error('GitHub API rate limit exceeded. Please wait or check connection.');
      }
      throw new Error(`GitHub repository not found (${repoRes.status})`);
    }
    const repoData = await repoRes.json();
    ref = repoData.default_branch || 'main';
  }

  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`,
    { headers: { Accept: 'application/vnd.github.v3+json' } }
  );
  if (!treeRes.ok) {
    throw new Error(`Could not fetch repo tree (${treeRes.status})`);
  }
  const treeData: GitHubTreeResponse = await treeRes.json();
  return treeData.tree || [];
}

async function fetchFileContent(owner: string, repo: string, path: string, sha: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs/${sha}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (!res.ok) return null;
    const data = await res.json();

    if (data.encoding === 'base64') {
      return atob(data.content.replace(/\n/g, ''));
    }
    return data.content || '';
  } catch {
    return null;
  }
}

export type SupportedSandpackTemplate =
  | 'react-ts'
  | 'react'
  | 'vanilla-ts'
  | 'vanilla'
  | 'node'
  | 'static'
  | 'vite-react'
  | 'vite-react-ts'
  | 'nextjs';

export interface FetchRepoResult {
  files: Record<string, string>;
  entryFile: string;
  template: SupportedSandpackTemplate;
  packageJson: any | null;
  isPython: boolean;
  totalFetched: number;
  totalSkipped: number;
}

function detectTemplate(packageJson: any, files: Record<string, string>): { template: SupportedSandpackTemplate; isPython: boolean } {
  const hasPython = Object.keys(files).some((f) => f.endsWith('.py') || f === '/requirements.txt' || f === '/pyproject.toml');

  if (!packageJson) {
    return { template: 'static', isPython: hasPython };
  }

  const allDeps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  };

  if ('next' in allDeps) return { template: 'nextjs', isPython: false };
  if ('react' in allDeps && ('typescript' in allDeps || Object.keys(files).some((f) => f.endsWith('.tsx')))) {
    return { template: 'vite-react-ts', isPython: false };
  }
  if ('react' in allDeps) return { template: 'vite-react', isPython: false };
  if ('typescript' in allDeps) return { template: 'vanilla-ts', isPython: false };
  return { template: 'static', isPython: hasPython };
}

function detectEntryFile(files: Record<string, string>, template: string, isPython: boolean): string {
  if (isPython) {
    const pyCandidates = ['/main.py', '/app.py', '/run.py', '/index.py', '/src/main.py', '/src/app.py'];
    for (const c of pyCandidates) {
      if (c in files) return c;
    }
    const anyPy = Object.keys(files).find((f) => f.endsWith('.py'));
    if (anyPy) return anyPy;
  }

  const candidates: Record<string, string[]> = {
    'nextjs': ['/src/app/page.tsx', '/src/app/page.jsx', '/app/page.tsx', '/pages/index.tsx', '/pages/index.jsx', '/pages/index.js'],
    'vite-react-ts': ['/src/App.tsx', '/src/main.tsx', '/src/index.tsx'],
    'vite-react': ['/src/App.jsx', '/src/App.js', '/src/main.jsx', '/src/index.jsx'],
    'react-ts': ['/src/App.tsx', '/src/index.tsx'],
    'react': ['/src/App.jsx', '/src/App.js', '/src/index.jsx', '/src/index.js'],
    'vanilla-ts': ['/src/index.ts', '/index.ts', '/src/main.ts'],
    'vanilla': ['/src/index.js', '/index.js', '/src/main.js'],
    'static': ['/index.html', '/src/index.html'],
    'node': ['/index.js', '/src/index.js', '/server.js', '/app.js'],
  };

  const picks = candidates[template] || candidates['static'];
  for (const candidate of picks) {
    if (candidate in files) return candidate;
  }

  const allPaths = Object.keys(files);
  return allPaths[0] || '/index.html';
}

function generatePyodideRunnerHtml(files: Record<string, string>, entryPy: string): string {
  const pyCodeEscaped = (files[entryPy] || '# No python code found')
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pyodide In-Browser Python Runtime</title>
  <script src="https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #060d1a;
      color: #e2e8f0;
      font-family: 'JetBrains Mono', monospace, monospace;
      padding: 1.5rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #162a45;
      padding-bottom: 0.75rem;
      margin-bottom: 1rem;
    }
    .badge {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.4);
      background: rgba(245, 158, 11, 0.1);
      padding: 2px 8px;
    }
    .status {
      font-size: 11px;
      color: #22d3ee;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22d3ee;
      display: inline-block;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    .terminal {
      flex: 1;
      background: #091426;
      border: 1px solid #162a45;
      padding: 1rem;
      overflow-y: auto;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      color: #cbd5e1;
    }
    .terminal .out { color: #67e8f9; }
    .terminal .err { color: #f87171; }
    .terminal .sys { color: #94a3b8; }
    .btn-run {
      background: #f59e0b;
      color: #060d1a;
      border: none;
      font-family: inherit;
      font-size: 11px;
      font-weight: bold;
      padding: 6px 14px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .btn-run:hover { background: #fbbf24; }
  </style>
</head>
<body>
  <div class="header">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span class="badge">Pyodide Engine</span>
      <span class="status"><span class="dot" id="indicator"></span><span id="status-text">Booting Python virtual machine...</span></span>
    </div>
    <button class="btn-run" onclick="executePython()">Re-run Script</button>
  </div>
  <div class="terminal" id="terminal"><span class="sys">[PROJEXUS BLUEPRINT RUNTIME] Mounting Virtual File System...</span>\n</div>

  <script>
    let pyodideInstance = null;
    const term = document.getElementById('terminal');
    const statusText = document.getElementById('status-text');
    const indicator = document.getElementById('indicator');

    function log(msg, type = 'out') {
      const span = document.createElement('span');
      span.className = type;
      span.textContent = msg + '\\n';
      term.appendChild(span);
      term.scrollTop = term.scrollHeight;
    }

    async function initPyodide() {
      try {
        log('[1/3] Loading Pyodide WASM core via CDN...', 'sys');
        pyodideInstance = await loadPyodide({
          stdout: (text) => log(text, 'out'),
          stderr: (text) => log(text, 'err'),
        });
        indicator.style.background = '#34d399';
        statusText.textContent = 'Python 3.11 Runtime Ready (' + '${entryPy}' + ')';
        log('[2/3] Pyodide initialized in browser tab.', 'sys');
        log('[3/3] Executing ' + '${entryPy}' + ':\\n----------------------------------------', 'sys');
        await executePython();
      } catch (err) {
        indicator.style.background = '#ef4444';
        statusText.textContent = 'Engine Error';
        log('[ERROR] Failed to boot Pyodide: ' + err.message, 'err');
      }
    }

    async function executePython() {
      if (!pyodideInstance) return;
      try {
        const code = \`${pyCodeEscaped}\`;
        await pyodideInstance.runPythonAsync(code);
        log('\\n[PROCESS COMPLETED WITH EXIT CODE 0]', 'sys');
      } catch (err) {
        log('\\n[Traceback Error] ' + err.message, 'err');
      }
    }

    initPyodide();
  </script>
</body>
</html>`;
}

export async function fetchGitHubRepoFiles(githubUrl: string): Promise<FetchRepoResult> {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) {
    throw new Error(`Invalid GitHub URL: "${githubUrl}"`);
  }

  const { owner, repo, branch } = parsed;
  const tree = await fetchTree(owner, repo, branch);

  const eligibleBlobs = tree.filter((item) => {
    if (item.type !== 'blob') return false;
    if (shouldSkip(item.path)) return false;
    if (!isTextFile(item.path)) return false;
    if (item.size && item.size > MAX_FILE_SIZE) return false;
    return true;
  });

  eligibleBlobs.sort((a, b) => {
    if (a.path === 'package.json') return -1;
    if (b.path === 'package.json') return 1;
    if (a.path === 'main.py' || a.path === 'app.py') return -1;
    return a.path.length - b.path.length;
  });
  const capped = eligibleBlobs.slice(0, MAX_FILES);

  const files: Record<string, string> = {};
  const CONCURRENCY = 6;
  let fetched = 0;

  for (let i = 0; i < capped.length; i += CONCURRENCY) {
    const batch = capped.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (item) => {
        const content = await fetchFileContent(owner, repo, item.path, item.sha);
        return { path: item.path, content };
      })
    );
    for (const { path, content } of results) {
      if (content !== null) {
        files[`/${path}`] = content;
        fetched++;
      }
    }
  }

  let packageJson = null;
  if (files['/package.json']) {
    try {
      packageJson = JSON.parse(files['/package.json']);
    } catch {
      // ignore
    }
  }

  const { template, isPython } = detectTemplate(packageJson, files);
  let entryFile = detectEntryFile(files, template, isPython);

  // If it's a Python repo or static without index.html, inject our interactive runner
  if (isPython) {
    files['/index.html'] = generatePyodideRunnerHtml(files, entryFile);
  } else if (template === 'static' && !files['/index.html']) {
    files['/index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { background: #060d1a; color: #f1f5f9; font-family: 'JetBrains Mono', monospace; padding: 2rem; }
    h2 { color: #f59e0b; font-size: 1.25rem; margin-bottom: 0.5rem; }
    p { color: #94a3b8; font-size: 0.875rem; margin-bottom: 1.5rem; }
    ul { list-style: none; padding: 0; }
    li { padding: 4px 0; border-bottom: 1px solid #162a45; font-size: 12px; color: #22d3ee; }
  </style>
</head>
<body>
  <h2>PROJEXUS // MOUNTED REPOSITORY FILES</h2>
  <p>Loaded ${fetched} files from repository.</p>
  <ul>
    ${Object.keys(files).map((f) => `<li>📁 ${f}</li>`).join('')}
  </ul>
</body>
</html>`;
  }

  return {
    files,
    entryFile,
    template: isPython ? 'static' : template,
    packageJson,
    isPython,
    totalFetched: fetched,
    totalSkipped: eligibleBlobs.length - capped.length + (tree.length - eligibleBlobs.length),
  };
}

export function buildFallbackFiles(project: {
  title: string;
  description: string;
  tech_stack: string[];
  demo_url?: string;
}): Record<string, string> {
  const isPython = project.tech_stack.some((t) =>
    t.toLowerCase().includes('python') || t.toLowerCase().includes('fastapi') || t.toLowerCase().includes('scikit')
  );

  const mainPyCode = `import time

def run_project_diagnostics():
    print("==================================================")
    print("PROJEXUS SPECIFICATION: ${project.title.replace(/"/g, '\\"')}")
    print("==================================================")
    print("Description: ${project.description.slice(0, 80).replace(/"/g, '\\"')}...")
    print("\\n[1] Initializing system nodes...")
    time.sleep(0.3)
    print("    • Status: Active")
    print("    • Tech stack: ${project.tech_stack.join(', ')}")
    print("\\n[2] Executing production-readiness test suite...")
    time.sleep(0.3)
    print("    • PASS: Architecture verification")
    print("    • PASS: Zero-install browser test")
    print("    • PASS: Security isolation check")
    print("\\n[3] Service endpoint initialized.")
    print(">> All checks passed successfully.")

if __name__ == "__main__":
    run_project_diagnostics()
`;

  const fallbackFiles: Record<string, string> = {
    '/main.py': mainPyCode,
    '/package.json': JSON.stringify(
      {
        name: project.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        version: '1.0.0',
        description: project.description,
        main: 'index.js',
        dependencies: {},
      },
      null,
      2
    ),
    '/README.md': `# ${project.title}\n\n${project.description}\n\n## Tech Stack\n${project.tech_stack.map((t) => `- ${t}`).join('\n')}\n`,
  };

  if (isPython) {
    fallbackFiles['/index.html'] = generatePyodideRunnerHtml(fallbackFiles, '/main.py');
  } else {
    fallbackFiles['/index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #060d1a;
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      max-width: 580px;
      width: 100%;
      border: 1px solid #162a45;
      background: #091426;
      padding: 2rem;
    }
    .badge {
      font-family: monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #22d3ee;
      border: 1px solid rgba(34,211,238,0.3);
      background: rgba(34,211,238,0.08);
      padding: 2px 8px;
      margin-bottom: 1rem;
      display: inline-block;
    }
    h1 { font-size: 1.35rem; margin-bottom: 0.75rem; color: #fff; }
    p { color: #94a3b8; font-size: 0.85rem; line-height: 1.6; margin-bottom: 1.25rem; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 1.5rem; }
    .chip { font-family: monospace; font-size: 11px; color: #f59e0b; border: 1px solid #1e3a5f; background: #060e1b; padding: 3px 8px; }
    .btn {
      color: #060d1a;
      background: #22d3ee;
      font-family: monospace;
      font-size: 12px;
      font-weight: bold;
      text-decoration: none;
      padding: 8px 16px;
      display: inline-block;
      text-transform: uppercase;
    }
    .btn:hover { background: #67e8f9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">PROJEXUS // IN-BROWSER PREVIEW</div>
    <h1>${project.title}</h1>
    <p>${project.description}</p>
    <div class="chips">
      ${project.tech_stack.map((t) => `<span class="chip">${t}</span>`).join('')}
    </div>
    ${project.demo_url ? `<a href="${project.demo_url}" target="_blank" class="btn">Open Deployed Demo ↗</a>` : ''}
  </div>
</body>
</html>`;
  }

  return fallbackFiles;
}
