import { NextRequest, NextResponse } from 'next/server';
import { mockComponents } from '@/data/mockComponents';
import type { Component } from '@aem-portal/shared';

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

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const component = mockComponents.find((c) => c.slug === params.slug);

  if (!component) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Component not found',
          code: 'NOT_FOUND',
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: mapToComponent(component),
  });
}
