'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useEffect } from 'react';
import { VariantsSection } from './VariantsSection';

interface AuthoringTabProps {
  authoringNotes: string;
  setAuthoringNotes: (value: string) => void;
  variants: any[];
  setVariants: (value: any[]) => void;
}

export function AuthoringTab({
  authoringNotes,
  setAuthoringNotes,
  variants,
  setVariants,
}: AuthoringTabProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        bulletList: {},
        orderedList: {},
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary-600 underline' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'max-w-full h-auto' },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: authoringNotes || '<p>Add authoring notes here...</p>',
    editorProps: {
      attributes: {
        class:
          'prose max-w-none p-4 min-h-[300px] border border-gray-300 rounded-md focus:outline-none focus:border-primary-500',
      },
    },
    onUpdate: ({ editor }) => {
      setAuthoringNotes(editor.getHTML());
    },
  });

  // Update editor content when authoringNotes prop changes externally
  useEffect(() => {
    if (editor && authoringNotes !== editor.getHTML()) {
      editor.commands.setContent(authoringNotes || '<p>Add authoring notes here...</p>');
    }
  }, [editor, authoringNotes]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Rich Text Editor */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Authoring Notes for Content Authors</h3>

        {/* Toolbar */}
        <div className="border border-gray-300 border-b-0 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-medium ${
              editor.isActive('bold')
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm italic ${
              editor.isActive('italic')
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Italic"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-1 rounded text-sm line-through ${
              editor.isActive('strike')
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Strikethrough"
          >
            S
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Headings */}
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level: level as any }).run()}
              className={`px-3 py-1 rounded text-sm ${
                editor.isActive('heading', { level })
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-100'
              }`}
              title={`Heading ${level}`}
            >
              H{level}
            </button>
          ))}

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('bulletList')
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Bullet List"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('orderedList')
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Numbered List"
          >
            1.
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Link */}
          <button
            onClick={() => {
              const url = window.prompt('Enter URL:');
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('link')
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Add Link"
          >
            🔗
          </button>

          {/* Blockquote */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('blockquote')
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Blockquote"
          >
            "
          </button>

          {/* Code Block */}
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('codeBlock')
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            title="Code Block"
          >
            {'</>'}
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Table */}
          <button
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            className="px-3 py-1 rounded text-sm bg-white border border-gray-300 hover:bg-gray-100"
            title="Insert Table"
          >
            ┃
          </button>

          {/* Clear Formatting */}
          <button
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            className="px-3 py-1 rounded text-sm bg-white border border-gray-300 hover:bg-gray-100"
            title="Clear Formatting"
          >
            ✕
          </button>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} />
      </div>

      {/* Variants Section */}
      <VariantsSection variants={variants} setVariants={setVariants} />
    </div>
  );
}
