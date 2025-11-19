import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { config } from '../config';
import logger from '../utils/logger';
import { ApiError } from '@aem-portal/shared';
import crypto from 'crypto';
import path from 'path';

class StorageService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      config.azureStorage.account,
      config.azureStorage.key
    );

    this.blobServiceClient = new BlobServiceClient(
      `https://${config.azureStorage.account}.blob.core.windows.net`,
      sharedKeyCredential
    );

    this.containerName = config.azureStorage.container;
  }

  /**
   * Upload a file to blob storage
   */
  async uploadFile(
    buffer: Buffer,
    originalFilename: string,
    contentType?: string
  ): Promise<string> {
    try {
      // Generate unique filename
      const ext = path.extname(originalFilename);
      const hash = crypto.randomBytes(16).toString('hex');
      const filename = `${hash}${ext}`;

      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);

      // Create container if it doesn't exist
      await containerClient.createIfNotExists({ access: 'blob' });

      const blockBlobClient = containerClient.getBlockBlobClient(filename);

      logger.debug(`Uploading file: ${filename}`);

      await blockBlobClient.upload(buffer, buffer.length, {
        blobHTTPHeaders: {
          blobContentType: contentType || this.getContentType(ext),
        },
      });

      const url = blockBlobClient.url;
      logger.info(`File uploaded successfully: ${url}`);

      return url;
    } catch (error: any) {
      logger.error('Failed to upload file to blob storage', {
        error: error.message,
      });
      throw new ApiError('Failed to upload file', 500, 'STORAGE_UPLOAD_ERROR');
    }
  }

  /**
   * Upload from URL (download and re-upload to blob storage)
   */
  async uploadFromUrl(url: string): Promise<string> {
    try {
      const axios = await import('axios');
      const response = await axios.default.get(url, {
        responseType: 'arraybuffer',
      });

      const buffer = Buffer.from(response.data);
      const filename = path.basename(new URL(url).pathname);
      const contentType = response.headers['content-type'];

      return await this.uploadFile(buffer, filename, contentType);
    } catch (error: any) {
      logger.error('Failed to upload from URL', {
        url,
        error: error.message,
      });
      throw new ApiError('Failed to download and upload file', 500, 'STORAGE_URL_UPLOAD_ERROR');
    }
  }

  /**
   * Delete a file from blob storage
   */
  async deleteFile(blobUrl: string): Promise<void> {
    try {
      const blobName = this.getBlobNameFromUrl(blobUrl);
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      logger.debug(`Deleting file: ${blobName}`);
      await blockBlobClient.delete();

      logger.info(`File deleted successfully: ${blobName}`);
    } catch (error: any) {
      logger.error('Failed to delete file from blob storage', {
        blobUrl,
        error: error.message,
      });
      throw new ApiError('Failed to delete file', 500, 'STORAGE_DELETE_ERROR');
    }
  }

  /**
   * List all blobs in the container
   */
  async listFiles(prefix?: string): Promise<string[]> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blobs: string[] = [];

      for await (const blob of containerClient.listBlobsFlat({ prefix })) {
        blobs.push(blob.name);
      }

      return blobs;
    } catch (error: any) {
      logger.error('Failed to list files from blob storage', {
        error: error.message,
      });
      throw new ApiError('Failed to list files', 500, 'STORAGE_LIST_ERROR');
    }
  }

  /**
   * Get blob name from full URL
   */
  private getBlobNameFromUrl(blobUrl: string): string {
    const url = new URL(blobUrl);
    // Remove container name from path
    const pathParts = url.pathname.split('/');
    return pathParts.slice(2).join('/'); // Skip first two parts (empty and container name)
  }

  /**
   * Get content type from file extension
   */
  private getContentType(ext: string): string {
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
      '.json': 'application/json',
    };

    return contentTypes[ext.toLowerCase()] || 'application/octet-stream';
  }
}

export default new StorageService();
