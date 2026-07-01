/**
 * Converts a Figma design/file URL to a proper embed URL
 * Handles both old (/file/) and new (/design/) Figma URL formats
 */
export function getFigmaEmbedUrl(figmaUrl: string): string | undefined {
  if (!figmaUrl || !figmaUrl.includes('figma.com')) {
    return undefined;
  }

  try {
    const url = new URL(figmaUrl);

    // Check if it's already an embed URL
    if (url.pathname.includes('/embed')) {
      return figmaUrl;
    }

    // Extract file ID from both /file/ and /design/ formats
    // Old format: https://www.figma.com/file/FILE_ID/...
    // New format: https://www.figma.com/design/FILE_ID/...
    const pathMatch = url.pathname.match(/\/(file|design)\/([a-zA-Z0-9]+)/);

    if (!pathMatch) {
      console.warn('Invalid Figma URL format:', figmaUrl);
      return undefined;
    }

    const fileId = pathMatch[2];

    // Extract node-id if present
    const nodeId = url.searchParams.get('node-id');

    // Construct embed URL
    // Use the new Figma embed format
    const embedUrl = new URL(`https://www.figma.com/embed`);
    embedUrl.searchParams.set('embed_host', 'share');
    embedUrl.searchParams.set('url', figmaUrl);

    return embedUrl.toString();
  } catch (error) {
    console.error('Error parsing Figma URL:', error);
    return undefined;
  }
}

/**
 * Validates if a URL is a valid Figma URL
 */
export function isValidFigmaUrl(url: string): boolean {
  if (!url) return false;

  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes('figma.com') &&
           (parsedUrl.pathname.includes('/file/') ||
            parsedUrl.pathname.includes('/design/') ||
            parsedUrl.pathname.includes('/embed'));
  } catch {
    return false;
  }
}
