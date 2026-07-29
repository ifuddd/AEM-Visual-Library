import { NextRequest, NextResponse } from 'next/server';
import { mockComponents } from '@/data/mockComponents';
import type { Component } from '@aem-portal/shared';

const SLUG_RE = /^[a-z0-9-]+$/;

const VALID_STATUS = new Set(['ready', 'in_review']);

const ALLOWED_PATCH_FIELDS = new Set([
  'title', 'description', 'tags', 'status', 'ownerEmail', 'ownerTeam',
  'variants', 'authoringNotes', 'designSpecsNotes', 'azureDevOpsWorkItem', 'figmaLink',
]);

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

    aemMetadata: {
      componentPath: component.aemComponentPath || null,
      dialogSchema: component.aemDialogSchema || null,
      allowedChildren: component.aemAllowedChildren || [],
      templateConstraints: component.aemTemplateConstraints || null,
      limitations: component.aemLimitations || [],
    },
    visualAssets: {
      thumbnailUrl: component.thumbnailUrl || null,
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

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!SLUG_RE.test(params.slug)) {
    return NextResponse.json(
      { success: false, error: { message: 'Invalid slug', code: 'INVALID_SLUG' } },
      { status: 400 }
    );
  }

  const component = mockComponents.find((c) => c.slug === params.slug);

  if (!component) {
    return NextResponse.json(
      { success: false, error: { message: 'Component not found', code: 'NOT_FOUND' } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: mapToComponent(component) });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!SLUG_RE.test(params.slug)) {
    return NextResponse.json(
      { success: false, error: { message: 'Invalid slug', code: 'INVALID_SLUG' } },
      { status: 400 }
    );
  }

  const componentIndex = mockComponents.findIndex((c) => c.slug === params.slug);

  if (componentIndex === -1) {
    return NextResponse.json(
      { success: false, error: { message: 'Component not found', code: 'NOT_FOUND' } },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();

    const visualAssets = body.visualAssets || {};
    const aemMetadata = body.aemMetadata || {};

    // Only allow explicitly permitted fields to be updated
    const safeUpdate = Object.fromEntries(
      Object.entries(body).filter(([k]) => ALLOWED_PATCH_FIELDS.has(k))
    );

    if (safeUpdate.status && !VALID_STATUS.has(safeUpdate.status as string)) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid status value', code: 'INVALID_STATUS' } },
        { status: 400 }
      );
    }

    mockComponents[componentIndex] = {
      ...mockComponents[componentIndex],
      ...safeUpdate,
      thumbnailUrl: visualAssets.thumbnailUrl ?? mockComponents[componentIndex].thumbnailUrl,
      ...(aemMetadata.componentPath !== undefined && { aemComponentPath: aemMetadata.componentPath }),
      ...(aemMetadata.dialogSchema !== undefined && { aemDialogSchema: aemMetadata.dialogSchema }),
      ...(aemMetadata.allowedChildren !== undefined && { aemAllowedChildren: aemMetadata.allowedChildren }),
      ...(aemMetadata.templateConstraints !== undefined && { aemTemplateConstraints: aemMetadata.templateConstraints }),
      ...(aemMetadata.limitations !== undefined && { aemLimitations: aemMetadata.limitations }),
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: mapToComponent(mockComponents[componentIndex]),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to update component', code: 'UPDATE_FAILED' } },
      { status: 500 }
    );
  }
}
