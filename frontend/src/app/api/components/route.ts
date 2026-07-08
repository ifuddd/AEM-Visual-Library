import { NextRequest, NextResponse } from 'next/server';
import { mockComponents } from '@/data/mockComponents';
import type { Component, ComponentStatus } from '@aem-portal/shared';

const VALID_STATUS = new Set(['ready', 'in_review']);

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

    variants: component.variants || [],
    authoringNotes: component.authoringNotes || null,
    designSpecsNotes: component.designSpecsNotes || null,
    azureDevOpsWorkItem: component.azureDevOpsWorkItem || null,
    figmaLink: component.figmaLink || null,

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
  const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20') || 20));

  let filtered = [...mockComponents];

  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  if (status && status.length > 0) {
    filtered = filtered.filter((c) => status.includes(c.status as any));
  }

  if (tags && tags.length > 0) {
    filtered = filtered.filter((c) =>
      c.tags.some((tag) => tags.includes(tag))
    );
  }

  if (ownerTeam) {
    filtered = filtered.filter((c) => c.ownerTeam === ownerTeam);
  }

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

    if (!data.title?.trim() || !data.description?.trim() || !data.ownerTeam?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Missing required fields: title, description, ownerTeam', code: 'VALIDATION_ERROR' },
        },
        { status: 400 }
      );
    }

    if (data.status && !VALID_STATUS.has(data.status)) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid status value', code: 'INVALID_STATUS' } },
        { status: 400 }
      );
    }

    const slug = data.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (mockComponents.find((c) => c.slug === slug)) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Component with this title already exists', code: 'DUPLICATE_SLUG' },
        },
        { status: 409 }
      );
    }

    const newComponent = {
      id: crypto.randomUUID(),
      slug,
      title: data.title.trim(),
      description: data.description.trim(),
      tags: data.tags || [],
      status: data.status || 'in_review',
      ownerEmail: data.ownerEmail || '',
      ownerTeam: data.ownerTeam.trim(),

      variants: data.variants || [],
      authoringNotes: data.authoringNotes || '',
      designSpecsNotes: data.designSpecsNotes || '',
      azureDevOpsWorkItem: data.azureDevOpsWorkItem || '',
      figmaLink: data.figmaLink || '',

      figmaLinks: [],

      lastSyncedAt: new Date(),
      lastUpdatedBy: 'system',
      lastUpdatedSource: 'manual' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockComponents.push(newComponent);

    return NextResponse.json({ success: true, data: mapToComponent(newComponent) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to create component', code: 'CREATE_FAILED' } },
      { status: 500 }
    );
  }
}
