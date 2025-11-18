import { AzureFunction, Context } from '@azure/functions';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import matter from 'gray-matter';
import {
  ComponentStatus,
  UpdateSource,
  SyncStatus,
  WikiFrontmatter,
  FragmentType,
} from '@aem-portal/shared';

// Singleton pattern for Prisma in serverless
// Reuses connection across warm starts
let prisma: PrismaClient;

function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Configuration from environment
const config = {
  azureDevOps: {
    org: process.env.AZURE_DEVOPS_ORG || '',
    project: process.env.AZURE_DEVOPS_PROJECT || '',
    wikiId: process.env.AZURE_DEVOPS_WIKI_ID || '',
    pat: process.env.AZURE_DEVOPS_PAT || '',
  },
  azureStorage: {
    account: process.env.AZURE_STORAGE_ACCOUNT || '',
    key: process.env.AZURE_STORAGE_KEY || '',
    container: process.env.AZURE_STORAGE_CONTAINER || 'component-assets',
  },
};

/**
 * Validate required environment variables
 */
function validateConfig(context: Context): void {
  const required = [
    'DATABASE_URL',
    'AZURE_DEVOPS_ORG',
    'AZURE_DEVOPS_PROJECT',
    'AZURE_DEVOPS_WIKI_ID',
    'AZURE_DEVOPS_PAT',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(', ')}`;
    context.log.error(error);
    throw new Error(error);
  }
}

/**
 * Timer trigger function - runs every 6 hours
 */
const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  // Validate configuration first
  validateConfig(context);

  const syncStartedAt = new Date();
  context.log('Wiki sync started at:', syncStartedAt.toISOString());

  let pagesProcessed = 0;
  let pagesFailed = 0;
  const errors: any[] = [];

  const client = getPrismaClient();

  try {
    // 1. Fetch list of wiki pages
    const wikiPages = await fetchWikiPages(context);
    context.log(`Found ${wikiPages.length} wiki pages`);

    // 2. Process each page
    for (const page of wikiPages) {
      try {
        await processWikiPage(context, page);
        pagesProcessed++;
      } catch (error: any) {
        pagesFailed++;
        errors.push({
          page: page.path,
          error: error.message,
          timestamp: new Date(),
        });
        context.log.error(`Failed to process page ${page.path}:`, error);
      }
    }

    // 3. Log sync results
    const syncCompletedAt = new Date();
    const status =
      pagesFailed === 0
        ? SyncStatus.SUCCESS
        : pagesFailed < wikiPages.length
        ? SyncStatus.PARTIAL
        : SyncStatus.FAILED;

    await client.syncLog.create({
      data: {
        syncStartedAt,
        syncCompletedAt,
        status,
        pagesProcessed,
        pagesFailed,
        errorLog: errors.length > 0 ? errors : null,
      },
    });

    context.log(
      `Sync completed: ${pagesProcessed} processed, ${pagesFailed} failed`
    );
  } catch (error: any) {
    context.log.error('Sync failed:', error);

    // Log failed sync
    await client.syncLog.create({
      data: {
        syncStartedAt,
        syncCompletedAt: new Date(),
        status: SyncStatus.FAILED,
        pagesProcessed,
        pagesFailed,
        errorLog: [{ error: error.message, timestamp: new Date() }],
      },
    });
  }
  // Note: No finally block - we keep the connection warm for future invocations
};

/**
 * Fetch all wiki pages from Azure DevOps
 */
async function fetchWikiPages(context: Context): Promise<any[]> {
  const baseUrl = `https://dev.azure.com/${config.azureDevOps.org}/${config.azureDevOps.project}`;
  const url = `${baseUrl}/_apis/wiki/wikis/${config.azureDevOps.wikiId}/pages?recursionLevel=full&api-version=7.0`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(':' + config.azureDevOps.pat).toString('base64')}`,
    },
  });

  return flattenWikiPageTree(response.data);
}

/**
 * Flatten wiki page tree to flat array
 */
function flattenWikiPageTree(node: any, pages: any[] = []): any[] {
  if (node.path) {
    pages.push({
      id: node.id,
      path: node.path,
      gitItemPath: node.gitItemPath,
    });
  }

  if (node.subPages) {
    node.subPages.forEach((subPage: any) => {
      flattenWikiPageTree(subPage, pages);
    });
  }

  return pages;
}

/**
 * Process a single wiki page
 */
async function processWikiPage(context: Context, page: any): Promise<void> {
  // Fetch page content
  const content = await fetchWikiPageContent(page.path);

  if (!content) {
    context.log.warn(`No content for page: ${page.path}`);
    return;
  }

  // Parse frontmatter
  const { data: frontmatter, content: markdownContent } = matter(content);
  const fm = frontmatter as WikiFrontmatter;

  // Skip if no component_id or fragment_id
  if (!fm.component_id && !fm.fragment_id && !fm.pattern_id) {
    context.log.verbose(`Skipping page ${page.path} - no ID in frontmatter`);
    return;
  }

  const wikiUrl = getWikiPageUrl(page.path);

  // Process based on type
  if (fm.component_id) {
    await syncComponent(context, fm, page.path, wikiUrl);
  } else if (fm.fragment_id) {
    await syncFragment(context, fm, page.path, wikiUrl);
  } else if (fm.pattern_id) {
    await syncPattern(context, fm, page.path, wikiUrl);
  }
}

/**
 * Fetch wiki page content
 */
async function fetchWikiPageContent(path: string): Promise<string> {
  const baseUrl = `https://dev.azure.com/${config.azureDevOps.org}/${config.azureDevOps.project}`;
  const url = `${baseUrl}/_apis/wiki/wikis/${config.azureDevOps.wikiId}/pages?path=${encodeURIComponent(path)}&includeContent=true&api-version=7.0`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Basic ${Buffer.from(':' + config.azureDevOps.pat).toString('base64')}`,
    },
  });

  return response.data.content || '';
}

/**
 * Get wiki page URL
 */
function getWikiPageUrl(path: string): string {
  return `https://dev.azure.com/${config.azureDevOps.org}/${config.azureDevOps.project}/_wiki/wikis/${config.azureDevOps.wikiId}?pagePath=${encodeURIComponent(path)}`;
}

/**
 * Sync component from frontmatter
 */
async function syncComponent(
  context: Context,
  fm: WikiFrontmatter,
  wikiPath: string,
  wikiUrl: string
): Promise<void> {
  const slug = fm.component_id!;

  const data = {
    slug,
    title: fm.title || slug,
    description: fm.description || '',
    tags: fm.tags || [],
    status: parseStatus(fm.status),
    ownerTeam: fm.owner_team,
    ownerEmail: fm.owner_email,
    azureWikiPath: wikiPath,
    azureWikiUrl: wikiUrl,
    figmaLinks: fm.figma_links || [],
    aemComponentPath: fm.aem_component_path,
    aemDialogSchema: fm.aem_dialog_schema,
    aemAllowedChildren: fm.aem_allowed_children || [],
    aemTemplateConstraints: fm.aem_template_constraints,
    aemLimitations: fm.aem_limitations || [],
    lastSyncedAt: new Date(),
    lastUpdatedSource: UpdateSource.AZURE,
  };

  const client = getPrismaClient();
  await client.component.upsert({
    where: { slug },
    update: data,
    create: data,
  });

  context.log(`Synced component: ${slug}`);
}

/**
 * Sync fragment from frontmatter
 */
async function syncFragment(
  context: Context,
  fm: WikiFrontmatter,
  wikiPath: string,
  wikiUrl: string
): Promise<void> {
  const slug = fm.fragment_id!;

  const data = {
    slug,
    type: parseFragmentType(fm.type),
    title: fm.title || slug,
    description: fm.description || '',
    schema: fm.schema,
    variations: fm.variations || [],
    tags: fm.tags || [],
    azureWikiPath: wikiPath,
    azureWikiUrl: wikiUrl,
  };

  const client = getPrismaClient();
  await client.fragment.upsert({
    where: { slug },
    update: data,
    create: data,
  });

  context.log(`Synced fragment: ${slug}`);
}

/**
 * Sync pattern from frontmatter
 */
async function syncPattern(
  context: Context,
  fm: WikiFrontmatter,
  wikiPath: string,
  wikiUrl: string
): Promise<void> {
  // Pattern sync would need component_ids to be resolved
  // Simplified for MVP
  context.log.verbose(`Pattern sync not fully implemented yet: ${fm.pattern_id}`);
}

/**
 * Parse status string to enum
 */
function parseStatus(status?: string): ComponentStatus {
  const statusUpper = status?.toUpperCase();
  if (statusUpper === 'EXPERIMENTAL') return ComponentStatus.EXPERIMENTAL;
  if (statusUpper === 'DEPRECATED') return ComponentStatus.DEPRECATED;
  return ComponentStatus.STABLE;
}

/**
 * Parse fragment type string to enum
 */
function parseFragmentType(type?: string): FragmentType {
  const typeUpper = type?.toUpperCase();
  if (typeUpper === 'EXPERIENCE_FRAGMENT') return FragmentType.EXPERIENCE_FRAGMENT;
  return FragmentType.CONTENT_FRAGMENT;
}

export default timerTrigger;
