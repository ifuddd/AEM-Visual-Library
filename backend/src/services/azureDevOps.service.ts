import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import logger from '../utils/logger';
import { ApiError } from '@aem-portal/shared';

interface WikiPage {
  id: number;
  path: string;
  content?: string;
  gitItemPath?: string;
}

interface WorkItem {
  id: number;
  url: string;
}

class AzureDevOpsService {
  private client: AxiosInstance;
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = `https://dev.azure.com/${config.azureDevOps.org}/${config.azureDevOps.project}`;

    this.client = axios.create({
      headers: {
        'Authorization': `Basic ${Buffer.from(':' + config.azureDevOps.pat).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get list of all pages in the Wiki
   */
  async getWikiPages(): Promise<WikiPage[]> {
    try {
      const url = `${this.baseUrl}/_apis/wiki/wikis/${config.azureDevOps.wikiId}/pages?recursionLevel=full&api-version=7.0`;

      logger.debug(`Fetching wiki pages from: ${url}`);
      const response = await this.client.get(url);

      return this.flattenWikiPageTree(response.data);
    } catch (error: any) {
      logger.error('Failed to fetch wiki pages', {
        error: error.message,
        status: error.response?.status,
      });
      throw new ApiError('Failed to fetch wiki pages from Azure DevOps', 500, 'WIKI_FETCH_ERROR');
    }
  }

  /**
   * Get a specific wiki page content
   */
  async getWikiPageContent(path: string): Promise<string> {
    try {
      const url = `${this.baseUrl}/_apis/wiki/wikis/${config.azureDevOps.wikiId}/pages?path=${encodeURIComponent(path)}&includeContent=true&api-version=7.0`;

      logger.debug(`Fetching wiki page: ${path}`);
      const response = await this.client.get(url);

      return response.data.content || '';
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new ApiError(`Wiki page not found: ${path}`, 404, 'WIKI_PAGE_NOT_FOUND');
      }

      logger.error('Failed to fetch wiki page content', {
        path,
        error: error.message,
        status: error.response?.status,
      });
      throw new ApiError('Failed to fetch wiki page content', 500, 'WIKI_FETCH_ERROR');
    }
  }

  /**
   * Create a work item in Azure DevOps
   */
  async createWorkItem(
    type: string,
    title: string,
    description: string,
    additionalFields?: Record<string, any>
  ): Promise<WorkItem> {
    try {
      const url = `${this.baseUrl}/_apis/wit/workitems/$${type}?api-version=7.0`;

      const operations = [
        {
          op: 'add',
          path: '/fields/System.Title',
          value: title,
        },
        {
          op: 'add',
          path: '/fields/System.Description',
          value: description,
        },
      ];

      // Add additional fields
      if (additionalFields) {
        Object.entries(additionalFields).forEach(([key, value]) => {
          operations.push({
            op: 'add',
            path: `/fields/${key}`,
            value,
          });
        });
      }

      logger.debug(`Creating work item: ${title}`);
      const response = await this.client.post(url, operations, {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      });

      return {
        id: response.data.id,
        url: response.data._links.html.href,
      };
    } catch (error: any) {
      logger.error('Failed to create work item', {
        error: error.message,
        status: error.response?.status,
      });
      throw new ApiError('Failed to create work item in Azure DevOps', 500, 'WORK_ITEM_CREATE_ERROR');
    }
  }

  /**
   * Check if user has access to a wiki page (using their token)
   */
  async checkWikiAccess(path: string, userToken: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/_apis/wiki/wikis/${config.azureDevOps.wikiId}/pages?path=${encodeURIComponent(path)}&api-version=7.0`;

      await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });

      return true;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Flatten the hierarchical wiki page tree into a flat array
   */
  private flattenWikiPageTree(node: any, pages: WikiPage[] = []): WikiPage[] {
    if (node.path) {
      pages.push({
        id: node.id,
        path: node.path,
        gitItemPath: node.gitItemPath,
      });
    }

    if (node.subPages) {
      node.subPages.forEach((subPage: any) => {
        this.flattenWikiPageTree(subPage, pages);
      });
    }

    return pages;
  }
}

export default new AzureDevOpsService();
