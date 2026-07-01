# Tab Restructure Implementation Progress

## Project Goal

Restructure the component detail page from 3 tabs (Preview, Designer, Authoring) to a new workflow-aligned structure:
- **Overview** - Component thumbnail, description, and variants (developer focus)
- **Design specs** - Figma preview + designer notes (designer focus)  
- **Usage guide** - Content authoring instructions (content author focus)

## Current Status: Phase 3 Complete ✅

**Overall Progress: ~60% complete** (3 of 6 phases done)

---

## ✅ Completed Phases

### Phase 1: Data Model Updates (Complete)

**What We Did:**
- Added `designSpecsNotes` field to Component interface in `shared/src/types/component.ts`
- Updated frontend and backend MockComponent interfaces
- Rebuilt shared package successfully
- Added sample design specs content to Hero Banner mock data

**Files Modified:**
- `shared/src/types/component.ts`
- `frontend/src/data/mockComponents.ts`
- `backend/src/data/mockComponents.ts`

**Commits:**
- `5ebe7d8` - Add designSpecsNotes field to data model

---

### Phase 2: Reusable Components (Complete)

**What We Built:**

1. **RichTextEditor.tsx** ✅
   - Extracted TipTap editor into reusable component
   - Full toolbar: bold, italic, headings, lists, links, tables, code blocks
   - Props: `content`, `onChange`, `placeholder`, `label`
   - Used by both Design specs and Usage guide tabs

2. **CollapsibleSection.tsx** ✅
   - Expandable/collapsible container with smooth animations
   - Chevron indicator, keyboard accessible
   - Props: `title`, `defaultOpen`, `children`, `icon`

3. **ThumbnailUpload.tsx** ✅
   - File upload with validation (JPG, PNG, WebP, max 5MB)
   - Base64 preview for immediate feedback
   - Remove/replace functionality
   - Props: `thumbnailUrl`, `onThumbnailChange`

4. **EmptyState.tsx** ✅
   - Helpful placeholders with CTAs
   - AEM-themed messaging
   - Props: `icon`, `title`, `message`, `action`

**Files Created:**
- `frontend/src/components/detail/RichTextEditor.tsx`
- `frontend/src/components/detail/CollapsibleSection.tsx`
- `frontend/src/components/detail/ThumbnailUpload.tsx`
- `frontend/src/components/detail/EmptyState.tsx`

**Commits:**
- `69434e6` - Create reusable components for tab restructure

---

### Phase 3: New Tab Components (Complete)

**What We Built:**

1. **OverviewTab.tsx** ✅
   - Component Info Section: Thumbnail (left) + Description (right)
   - Uses ThumbnailUpload component
   - Variants Section: Collapsible, reuses VariantsSection
   - Empty state with "Add First Variant" CTA
   - Props: `description`, `thumbnailUrl`, `onThumbnailChange`, `variants`, `setVariants`

2. **DesignSpecsTab.tsx** ✅
   - Figma Preview Section: Collapsible
     - URL input with validation (reused from DesignerTab)
     - Embedded iframe preview
     - "Open in Figma" external link
   - Design Notes Section: Collapsible
     - RichTextEditor for designer specifications
     - Empty states for both sections
   - Props: `figmaLink`, `setFigmaLink`, `designSpecsNotes`, `setDesignSpecsNotes`

3. **UsageGuideTab.tsx** ✅
   - Authoring Guide Section: Collapsible
     - RichTextEditor for content author instructions
     - Empty state with "Start Writing" CTA
     - Helpful tips section with AEM Touch UI guidance
   - Props: `authoringNotes`, `setAuthoringNotes`

**Files Created:**
- `frontend/src/components/detail/OverviewTab.tsx`
- `frontend/src/components/detail/DesignSpecsTab.tsx`
- `frontend/src/components/detail/UsageGuideTab.tsx`

**Commits:**
- `08d5676` - Create new tab components for restructured detail page

---

## 🚧 Current State

### What's Working Now:
- ✅ Data model supports all new fields (`designSpecsNotes`, existing fields)
- ✅ All reusable components built and tested
- ✅ All 3 new tab components created with proper structure
- ✅ Components use AEM terminology (Touch UI, Dialog, etc.)
- ✅ Collapsible sections throughout
- ✅ Empty states with helpful CTAs
- ✅ File validation and base64 preview for thumbnails

### What's NOT Connected Yet:
- ❌ New tabs not wired to main detail page (still shows old tabs)
- ❌ ComponentTabs.tsx still has old tab structure
- ❌ Detail page state management not updated for new fields
- ❌ No thumbnail upload to Azure (just local preview)
- ❌ No beforeunload warning for unsaved changes
- ❌ No validation on save
- ❌ Old tab components still exist (Preview, Designer, Authoring)

---

## 📋 Next Steps: Phase 4 - Update Main Components

This is the **critical integration phase** that wires everything together.

### Step 9: Update ComponentTabs ⏳

**File:** `frontend/src/components/detail/ComponentTabs.tsx`

**Changes Needed:**

1. **Replace tabs array:**
```typescript
// OLD (current):
const tabs = [
  { id: 'preview', label: 'Preview', icon: '👁️' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'authoring', label: 'Authoring', icon: '✏️' },
];

// NEW (to implement):
const tabs = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'design-specs', label: 'Design specs', icon: '🎨' },
  { id: 'usage-guide', label: 'Usage guide', icon: '📖' },
];
```

2. **Update ComponentTabsProps interface:**
```typescript
interface ComponentTabsProps {
  component: Component;
  
  // Overview tab
  thumbnailUrl: string | null;
  setThumbnailUrl: (value: string | null) => void;
  variants: ComponentVariant[];
  setVariants: (value: ComponentVariant[]) => void;
  
  // Design specs tab
  figmaLink: string;
  setFigmaLink: (value: string) => void;
  designSpecsNotes: string;
  setDesignSpecsNotes: (value: string) => void;
  
  // Usage guide tab
  authoringNotes: string;
  setAuthoringNotes: (value: string) => void;
  
  // Metadata
  azureDevOpsWorkItem: string;
  setAzureDevOpsWorkItem: (value: string) => void;
}
```

3. **Replace tab content rendering:**
```typescript
{activeTab === 'overview' && (
  <OverviewTab
    description={component.description}
    thumbnailUrl={thumbnailUrl}
    onThumbnailChange={setThumbnailUrl}
    variants={variants}
    setVariants={setVariants}
  />
)}
{activeTab === 'design-specs' && (
  <DesignSpecsTab
    figmaLink={figmaLink}
    setFigmaLink={setFigmaLink}
    designSpecsNotes={designSpecsNotes}
    setDesignSpecsNotes={setDesignSpecsNotes}
  />
)}
{activeTab === 'usage-guide' && (
  <UsageGuideTab
    authoringNotes={authoringNotes}
    setAuthoringNotes={setAuthoringNotes}
  />
)}
```

**Status:** Not started

---

### Step 10: Update Detail Page ⏳

**File:** `frontend/src/app/component/[slug]/page.tsx`

**Major Changes Needed:**

#### 1. Add New State Variables
```typescript
const [designSpecsNotes, setDesignSpecsNotes] = useState('');
const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
const [thumbnailBase64, setThumbnailBase64] = useState<string | null>(null);
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
```

#### 2. Initialize State from Component Data
```typescript
useEffect(() => {
  if (component) {
    // ... existing initializations ...
    setDesignSpecsNotes(component.designSpecsNotes || '');
    setThumbnailUrl(component.visualAssets?.thumbnailUrl || null);
  }
}, [component]);
```

#### 3. Track Unsaved Changes
```typescript
useEffect(() => {
  if (!component) return;
  
  const hasChanges = 
    title !== component.title ||
    description !== component.description ||
    status !== component.status ||
    figmaLink !== (component.figmaLink || '') ||
    authoringNotes !== (component.authoringNotes || '') ||
    designSpecsNotes !== (component.designSpecsNotes || '') ||
    thumbnailBase64 !== null ||
    JSON.stringify(variants) !== JSON.stringify(component.variants || []);
  
  setHasUnsavedChanges(hasChanges);
}, [title, description, status, figmaLink, authoringNotes, designSpecsNotes, thumbnailBase64, variants, component]);
```

#### 4. Add Beforeunload Warning
```typescript
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hasUnsavedChanges]);
```

#### 5. Update handleSave Function
```typescript
const handleSave = async () => {
  // 1. Validate all fields first
  if (!validateBeforeSave()) return;
  
  setSaveStatus('saving');
  
  let finalThumbnailUrl = thumbnailUrl;
  
  // 2. If there's a new thumbnail (base64), upload to Azure first
  if (thumbnailBase64) {
    try {
      const uploadResponse = await fetch('/api/upload/thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: thumbnailBase64 }),
      });
      
      if (uploadResponse.ok) {
        const { url } = await uploadResponse.json();
        finalThumbnailUrl = url;
      }
    } catch (error) {
      console.error('Thumbnail upload failed:', error);
    }
  }
  
  // 3. Collect all data from all tabs
  const updateData = {
    title,
    description,
    status,
    figmaLink,
    authoringNotes,
    designSpecsNotes,  // NEW FIELD
    variants,
    azureDevOpsWorkItem,
    visualAssets: {
      thumbnailUrl: finalThumbnailUrl,
    },
  };
  
  // 4. Save via mutation
  updateMutation.mutate(updateData);
  setThumbnailBase64(null);
  setHasUnsavedChanges(false);
};
```

#### 6. Add Validation Function
```typescript
const validateBeforeSave = () => {
  const errors: string[] = [];
  
  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  
  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }
  
  if (figmaLink && !isValidFigmaUrl(figmaLink)) {
    errors.push('Invalid Figma URL');
  }
  
  for (const variant of variants) {
    if (!variant.name || variant.name.trim().length === 0) {
      errors.push('All variants must have a name');
    }
  }
  
  if (errors.length > 0) {
    alert(errors.join('\n'));
    return false;
  }
  
  return true;
};
```

#### 7. Update Save Button UI
```typescript
<button
  onClick={handleSave}
  disabled={saveStatus === 'saving' || !hasUnsavedChanges}
  className={`px-4 py-2 rounded-md font-medium transition-colors ${
    hasUnsavedChanges 
      ? 'bg-primary-600 text-white hover:bg-primary-700'
      : saveStatus === 'saved'
      ? 'bg-green-600 text-white'
      : saveStatus === 'error'
      ? 'bg-red-600 text-white'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  {saveStatus === 'saving' && 'Saving...'}
  {saveStatus === 'saved' && '✓ Saved'}
  {saveStatus === 'error' && '✗ Error'}
  {saveStatus === 'idle' && (hasUnsavedChanges ? 'Save Changes' : 'No Changes')}
</button>
```

#### 8. Update ComponentTabs Props
```typescript
<ComponentTabs
  component={component}
  thumbnailUrl={thumbnailBase64 || thumbnailUrl}
  setThumbnailUrl={(url) => {
    if (url?.startsWith('data:')) {
      setThumbnailBase64(url);
    } else {
      setThumbnailUrl(url);
      setThumbnailBase64(null);
    }
  }}
  variants={variants}
  setVariants={setVariants}
  figmaLink={figmaLink}
  setFigmaLink={setFigmaLink}
  designSpecsNotes={designSpecsNotes}
  setDesignSpecsNotes={setDesignSpecsNotes}
  authoringNotes={authoringNotes}
  setAuthoringNotes={setAuthoringNotes}
  azureDevOpsWorkItem={azureDevOpsWorkItem}
  setAzureDevOpsWorkItem={setAzureDevOpsWorkItem}
/>
```

**Status:** Not started

---

## 📋 Remaining Phases (After Phase 4)

### Phase 5: API & Upload Endpoints

**Step 11:** Create Thumbnail Upload Frontend API
- File: `frontend/src/app/api/upload/thumbnail/route.ts` (NEW)
- Accept base64 image, validate, forward to backend

**Step 12:** Create Backend Upload Endpoint
- File: `backend/src/routes/upload.routes.ts` (NEW)
- Expose StorageService, upload to Azure Blob Storage

**Step 13:** Update Component API Validation
- Update validation schemas to accept `designSpecsNotes`
- Update PATCH handler to save `visualAssets.thumbnailUrl`

### Phase 6: Cleanup & Testing

**Step 14:** Add Thumbnail to ComponentCreateModal
- Add ThumbnailUpload to creation form
- Upload on submit if provided

**Step 15:** Remove Old Tab Components
- Delete PreviewTab.tsx
- Delete DesignerTab.tsx  
- Delete AuthoringTab.tsx
- Keep VariantsSection.tsx (reused)

**Step 16:** Add Validation
- Comprehensive validation before save
- User-friendly error messages

---

## 🎯 Success Criteria

### Phase 4 Success Metrics:
- [ ] ComponentTabs shows 3 new tabs (Overview, Design specs, Usage guide)
- [ ] All tabs switch correctly
- [ ] Detail page state includes all new fields
- [ ] Thumbnail preview works (base64)
- [ ] Unsaved changes warning appears when navigating away
- [ ] Save button shows correct states (unsaved/saving/saved)
- [ ] All props flow correctly to tab components
- [ ] No TypeScript errors

### Overall Project Success:
- [ ] Three new tabs working end-to-end
- [ ] Component thumbnail uploadable and displays in catalog
- [ ] Design specs notes separate from usage guide
- [ ] All sections collapsible
- [ ] Empty states with AEM terminology
- [ ] Beforeunload warning prevents data loss
- [ ] Validation catches errors
- [ ] Thumbnail uploads to Azure
- [ ] Old tabs removed
- [ ] No regressions in existing functionality

---

## 🔧 Technical Notes

### Dependencies Already Installed:
- ✅ TipTap packages (@tiptap/react, @tiptap/starter-kit, extensions)
- ✅ React Query for data fetching
- ✅ Figma utils for URL validation

### Known Constraints:
- Variant images use base64 (not Azure) - intentional per user request
- No role-based permissions - anyone can edit
- Mock data in-memory (no real database persistence yet)
- Azure Blob Storage service exists but needs API endpoint exposure

### Testing Strategy:
1. Compile TypeScript (no errors)
2. Manual testing of each tab
3. Test save flow end-to-end
4. Test thumbnail upload
5. Test validation
6. Test beforeunload warning
7. Test catalog thumbnail display

---

## 📝 Git History

**Branch:** `claude/plan-aem-library-01NwUfar18HqXNwKgK6wfgmD`

**Recent Commits:**
1. `5ebe7d8` - Add designSpecsNotes field to data model
2. `69434e6` - Create reusable components for tab restructure
3. `08d5676` - Create new tab components for restructured detail page

**Next Commit:**
- Update ComponentTabs and detail page (Phase 4)

---

## 🚀 How to Continue

### Immediate Next Action:
**Start Phase 4, Step 9** - Update ComponentTabs.tsx

1. Read current ComponentTabs.tsx
2. Replace tabs array with new 3 tabs
3. Update props interface
4. Replace tab rendering logic
5. Test compilation

Then proceed to Step 10 (update detail page).

---

*Last Updated: Phase 3 Complete - Ready for Phase 4*
*Total Files Created: 8 | Total Files Modified: 3 | Commits: 3*
