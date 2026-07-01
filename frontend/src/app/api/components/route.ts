import { NextRequest, NextResponse } from 'next/server';
import { mockComponents } from '@/data/mockComponents';
import type { Component, ComponentStatus } from '@aem-portal/shared';

function mapToComponent(component: any): Component {
  return {
    id: component.id,
    slug: component.slug,
    title: component.title,
    description: component.description,
    tags: component.tags,
    status: component.status as any,
    ownerEmail: component.ownerEmail,
    ownerTeam: component.ownerTeam,

    // New editing fields
    variants: component.variants || [],
    authoringNotes: component.authoringNotes || null,
    azureDevOpsWorkItem: component.azureDevOpsWorkItem || null,
    figmaLink: component.figmaLink || null,

    // Legacy fields
    repoLink: component.repoLink || null,
    azureWikiPath: component.azureWikiPath || null,
    azureWikiUrl: component.azureWikiUrl || null,
    figmaLinks: component.figmaLinks,

    aemMetadata: {
      componentPath: component.aemComponentPath || null,
      dialogSchema: component.aemDialogSchema || null,
      allowedChildren: component.aemAllowedChildren || [],
      templateConstraints: component.aemTemplateConstraints || null,
      limitations: component.aemLimitations || [],
    },
    visualAssets: {
      thumbnailUrl: component.thumbnailUrl || null,
      screenshotAuthorUrl: component.screenshotAuthorUrl || null,
      screenshotPublishedUrl: component.screenshotPublishedUrl || null,
    },
    lastUpdate: {
      source: component.lastUpdatedSource as any,
      date: component.lastSyncedAt || component.updatedAt,
      author: component.lastUpdatedBy || 'system',
    },
    createdAt: component.createdAt,
    updatedAt: component.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');
  const tags = searchParams.getAll('tags');
  const status = searchParams.getAll('status') as ComponentStatus[];
  const ownerTeam = searchParams.get('ownerTeam');
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');

  let filtered = [...mockComponents];

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  // Apply status filter
  if (status && status.length > 0) {
    filtered = filtered.filter((c) => status.includes(c.status as any));
  }

  // Apply tags filter
  if (tags && tags.length > 0) {
    filtered = filtered.filter((c) =>
      c.tags.some((tag) => tags.includes(tag))
    );
  }

  // Apply ownerTeam filter
  if (ownerTeam) {
    filtered = filtered.filter((c) => c.ownerTeam === ownerTeam);
  }

  // Calculate pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedData = filtered.slice(start, start + pageSize);

  return NextResponse.json({
    success: true,
    data: {
      data: paginatedData.map(mapToComponent),
      total,
      page,
      pageSize,
      totalPages,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    // Check if slug already exists
    if (mockComponents.find((c) => c.slug === slug)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Component with this title already exists',
            code: 'DUPLICATE_SLUG',
          },
        },
        { status: 409 }
      );
    }

    const newComponent = {
      id: String(mockComponents.length + 1),
      slug,
      title: data.title,
      description: data.description,
      tags: data.tags || [],
      status: data.status || 'in_review',
      ownerEmail: data.ownerEmail || '',
      ownerTeam: data.ownerTeam,

      // New editing fields
      variants: data.variants || [],
      authoringNotes: data.authoringNotes || '',
      azureDevOpsWorkItem: data.azureDevOpsWorkItem || '',
      figmaLink: data.figmaLink || '',

      // Legacy fields
      figmaLinks: [],

      lastSyncedAt: new Date(),
      lastUpdatedBy: 'system',
      lastUpdatedSource: 'MANUAL' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockComponents.push(newComponent);

    return NextResponse.json({
      success: true,
      data: mapToComponent(newComponent),
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to create component',
          code: 'CREATE_FAILED',
        },
      },
      { status: 500 }
    );
  }
}
