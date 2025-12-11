-- CreateEnum
CREATE TYPE "ComponentStatus" AS ENUM ('STABLE', 'EXPERIMENTAL', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "UpdateSource" AS ENUM ('AZURE', 'MANUAL');

-- CreateEnum
CREATE TYPE "FragmentType" AS ENUM ('CONTENT_FRAGMENT', 'EXPERIENCE_FRAGMENT');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('SUCCESS', 'PARTIAL', 'FAILED');

-- CreateEnum
CREATE TYPE "ContributionRequestType" AS ENUM ('NEW_COMPONENT', 'UPDATE_SCREENSHOT', 'FIX_METADATA', 'OTHER');

-- CreateEnum
CREATE TYPE "ContributionRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('VIEWER', 'CONTRIBUTOR', 'DOC_OWNER', 'ADMIN');

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ComponentStatus" NOT NULL DEFAULT 'STABLE',
    "ownerEmail" TEXT,
    "ownerTeam" TEXT,
    "repoLink" TEXT,
    "azureWikiPath" TEXT,
    "azureWikiUrl" TEXT,
    "figmaLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aemComponentPath" TEXT,
    "aemDialogSchema" JSONB,
    "aemAllowedChildren" TEXT[],
    "aemTemplateConstraints" JSONB,
    "aemLimitations" TEXT[],
    "thumbnailUrl" TEXT,
    "screenshotAuthorUrl" TEXT,
    "screenshotPublishedUrl" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "lastUpdatedBy" TEXT,
    "lastUpdatedSource" "UpdateSource" NOT NULL DEFAULT 'AZURE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fragment" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "FragmentType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "schema" JSONB,
    "variations" JSONB NOT NULL DEFAULT '[]',
    "sampleData" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "azureWikiPath" TEXT,
    "azureWikiUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fragment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "usageGuidance" TEXT,
    "thumbnailUrl" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatternComponent" (
    "id" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PatternComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "syncStartedAt" TIMESTAMP(3) NOT NULL,
    "syncCompletedAt" TIMESTAMP(3),
    "status" "SyncStatus" NOT NULL,
    "pagesProcessed" INTEGER NOT NULL DEFAULT 0,
    "pagesFailed" INTEGER NOT NULL DEFAULT 0,
    "errorLog" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionRequest" (
    "id" TEXT NOT NULL,
    "createdByEmail" TEXT NOT NULL,
    "createdByName" TEXT NOT NULL,
    "requestType" "ContributionRequestType" NOT NULL,
    "componentId" TEXT,
    "payload" JSONB NOT NULL,
    "status" "ContributionRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewerEmail" TEXT,
    "reviewerNotes" TEXT,
    "devopsWorkItemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "azureAdOid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("azureAdOid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Component_slug_key" ON "Component"("slug");

-- CreateIndex
CREATE INDEX "Component_slug_idx" ON "Component"("slug");

-- CreateIndex
CREATE INDEX "Component_status_idx" ON "Component"("status");

-- CreateIndex
CREATE INDEX "Component_ownerTeam_idx" ON "Component"("ownerTeam");

-- CreateIndex
CREATE UNIQUE INDEX "Fragment_slug_key" ON "Fragment"("slug");

-- CreateIndex
CREATE INDEX "Fragment_slug_idx" ON "Fragment"("slug");

-- CreateIndex
CREATE INDEX "Fragment_type_idx" ON "Fragment"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Pattern_slug_key" ON "Pattern"("slug");

-- CreateIndex
CREATE INDEX "Pattern_slug_idx" ON "Pattern"("slug");

-- CreateIndex
CREATE INDEX "PatternComponent_patternId_idx" ON "PatternComponent"("patternId");

-- CreateIndex
CREATE INDEX "PatternComponent_componentId_idx" ON "PatternComponent"("componentId");

-- CreateIndex
CREATE UNIQUE INDEX "PatternComponent_patternId_componentId_key" ON "PatternComponent"("patternId", "componentId");

-- CreateIndex
CREATE INDEX "SyncLog_syncStartedAt_idx" ON "SyncLog"("syncStartedAt");

-- CreateIndex
CREATE INDEX "SyncLog_status_idx" ON "SyncLog"("status");

-- CreateIndex
CREATE INDEX "ContributionRequest_status_idx" ON "ContributionRequest"("status");

-- CreateIndex
CREATE INDEX "ContributionRequest_createdByEmail_idx" ON "ContributionRequest"("createdByEmail");

-- CreateIndex
CREATE INDEX "ContributionRequest_componentId_idx" ON "ContributionRequest"("componentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "PatternComponent" ADD CONSTRAINT "PatternComponent_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "Pattern"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatternComponent" ADD CONSTRAINT "PatternComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionRequest" ADD CONSTRAINT "ContributionRequest_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;
