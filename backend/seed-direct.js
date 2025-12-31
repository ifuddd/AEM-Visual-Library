#!/usr/bin/env node
/**
 * Direct database seeding without Prisma dependency
 * Run with: node seed-direct.js
 */

const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aem_portal',
});

async function seed() {
  try {
    await client.connect();
    console.log('🌱 Starting direct database seed...\n');

    // Create users
    console.log('👥 Creating users...');

    await client.query(`
      INSERT INTO "User" ("azureAdOid", "email", "displayName", "role", "lastLoginAt", "createdAt", "updatedAt")
      VALUES
        ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', 'ADMIN', NOW(), NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000002', 'designer@example.com', 'Sarah Designer', 'CONTRIBUTOR', NOW(), NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000003', 'developer@example.com', 'John Developer', 'DOC_OWNER', NOW(), NOW(), NOW())
      ON CONFLICT ("azureAdOid") DO NOTHING
    `);

    console.log('  ✅ Created 3 users\n');

    // Create components - using direct SQL to avoid Prisma dependency
    console.log('📦 Creating 18 components...');

    const components = [
      ['hero-banner', 'Hero Banner', 'STABLE', 'marketing-platform@example.com', 'Marketing Platform', '{layout,marketing,author-editable,responsive}'],
      ['cta-button', 'CTA Button', 'STABLE', 'design-system@example.com', 'Design System', '{action,interactive,author-editable,atomic}'],
      ['card', 'Card', 'STABLE', 'content-platform@example.com', 'Content Platform', '{layout,content,author-editable,responsive}'],
      ['navigation-header', 'Navigation Header', 'STABLE', 'platform-team@example.com', 'Platform', '{navigation,layout,global,responsive}'],
      ['accordion', 'Accordion', 'STABLE', 'content-platform@example.com', 'Content Platform', '{interactive,content,author-editable,accessible}'],
      ['tabs', 'Tabs', 'STABLE', 'content-platform@example.com', 'Content Platform', '{interactive,content,author-editable,accessible}'],
      ['form-field', 'Form Field', 'STABLE', 'forms-team@example.com', 'Forms', '{form,interactive,author-editable,accessible}'],
      ['image', 'Image', 'STABLE', 'design-system@example.com', 'Design System', '{media,author-editable,responsive,atomic}'],
      ['video-player', 'Video Player', 'STABLE', 'media-team@example.com', 'Media', '{media,interactive,author-editable,accessible}'],
      ['breadcrumb', 'Breadcrumb', 'STABLE', 'platform-team@example.com', 'Platform', '{navigation,seo,accessible,responsive}'],
      ['footer', 'Footer', 'STABLE', 'platform-team@example.com', 'Platform', '{layout,global,navigation,responsive}'],
      ['text-block', 'Text Block', 'STABLE', 'content-platform@example.com', 'Content Platform', '{content,text,author-editable,rich-text}'],
      ['carousel', 'Carousel', 'EXPERIMENTAL', 'ux-team@example.com', 'UX', '{interactive,media,author-editable,responsive}'],
      ['modal', 'Modal', 'STABLE', 'ux-team@example.com', 'UX', '{interactive,overlay,accessible,author-editable}'],
      ['alert', 'Alert', 'STABLE', 'design-system@example.com', 'Design System', '{notification,feedback,author-editable,accessible}'],
      ['teaser', 'Teaser', 'STABLE', 'creative-dev@example.com', 'Creative Development', '{content,marketing,promotion,core-component,responsive,author-editable}'],
      ['section-container', 'Section Container', 'STABLE', 'creative-dev@example.com', 'Creative Development', '{layout,container,structure,responsive,grid,author-editable}'],
      ['content-list', 'Content List', 'STABLE', 'creative-dev@example.com', 'Creative Development', '{content,dynamic,query,list,aggregation,author-editable}'],
    ];

    for (const [slug, title, status, email, team, tags] of components) {
      await client.query(`
        INSERT INTO "Component" (
          "id", "slug", "title", "description", "tags", "status",
          "ownerEmail", "ownerTeam", "createdAt", "updatedAt",
          "lastSyncedAt", "lastUpdatedBy", "lastUpdatedSource"
        ) VALUES (
          gen_random_uuid(),
          $1,
          $2,
          'AEM component: ' || $2,
          $3,
          $4::text::"ComponentStatus",
          $5,
          $6,
          NOW(),
          NOW(),
          NOW(),
          $5,
          'MANUAL'::"UpdateSource"
        )
        ON CONFLICT ("slug") DO UPDATE SET
          "title" = EXCLUDED."title",
          "status" = EXCLUDED."status",
          "ownerEmail" = EXCLUDED."ownerEmail",
          "ownerTeam" = EXCLUDED."ownerTeam",
          "updatedAt" = NOW()
      `, [slug, title, tags, status, email, team]);

      console.log(`  ✅ ${title} (${status})`);
    }

    console.log('\n✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('  - 3 users created');
    console.log('  - 18 components created');
    console.log('  - 15 basic components (Hero, Button, Card, etc.)');
    console.log('  - 3 advanced components (Teaser, Section Container, Content List)');
    console.log('\n🎉 Database is ready! Refresh your browser to see components.\n');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
