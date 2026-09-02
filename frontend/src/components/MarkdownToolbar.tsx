import React, { useState, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  SquareCode,
  Minus,
  X,
  Upload,
  ExternalLink,
  Check,
} from 'lucide-react';

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
}

type ActiveDialog = 'none' | 'link' | 'image';

export default function MarkdownToolbar({
  textareaRef,
  value,
  onChange,
  onUploadImage,
}: MarkdownToolbarProps) {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>('none');

  // Link dialog state
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkSelection, setLinkSelection] = useState({ start: 0, end: 0 });

  // Image dialog state
  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imageSelection, setImageSelection] = useState({ start: 0, end: 0 });

  // Dialog container ref for outside click detection
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close dialogs on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setActiveDialog('none');
      }
    };
    if (activeDialog !== 'none') {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDialog]);

  // Apply changes to textarea with proper selection/cursor positioning
  const applyFormatting = (newText: string, selectStart: number, selectEnd: number) => {
    onChange(newText);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(selectStart, selectEnd);
      }
    });
  };

  // Inline wrapper for Bold, Italic, Inline Code
  const wrapInline = (prefix: string, suffix: string, placeholder = 'text') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);

    if (selected.length > 0) {
      const newText = value.substring(0, start) + prefix + selected + suffix + value.substring(end);
      applyFormatting(newText, start + prefix.length, start + prefix.length + selected.length);
    } else {
      const newText = value.substring(0, start) + prefix + placeholder + suffix + value.substring(end);
      applyFormatting(newText, start + prefix.length, start + prefix.length + placeholder.length);
    }
  };

  // Heading formatter
  const applyHeading = (level: 2 | 3) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const currentLine = value.substring(lineStart, lineEnd);
    const prefix = level === 2 ? '## ' : '### ';
    const cleanLine = currentLine.replace(/^#{1,6}\s*/, '');
    const newLine = `${prefix}${cleanLine || (level === 2 ? 'Heading 2' : 'Heading 3')}`;

    const newText = value.substring(0, lineStart) + newLine + value.substring(lineEnd);
    const newCursor = lineStart + newLine.length;
    applyFormatting(newText, lineStart, newCursor);
    setActiveDialog('none');
  };

  // Line-based list/quote formatter
  const formatLines = (
    transform: (line: string, index: number) => string,
    defaultPlaceholder = 'List item'
  ) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;

    const selectedBlock = value.substring(lineStart, lineEnd);

    if (start === end && selectedBlock.trim() === '') {
      const transformed = transform(defaultPlaceholder, 0);
      const newText = value.substring(0, lineStart) + transformed + value.substring(lineEnd);
      applyFormatting(
        newText,
        lineStart + transformed.indexOf(defaultPlaceholder),
        lineStart + transformed.indexOf(defaultPlaceholder) + defaultPlaceholder.length
      );
      return;
    }

    const lines = selectedBlock.split('\n');
    const transformedLines = lines.map((line, idx) => transform(line, idx)).join('\n');
    const newText = value.substring(0, lineStart) + transformedLines + value.substring(lineEnd);
    applyFormatting(newText, lineStart, lineStart + transformedLines.length);
  };

  // Bullet list
  const applyBulletList = () => {
    formatLines((line) => {
      const trimmed = line.replace(/^([*-]|\d+\.)\s*/, '');
      return `- ${trimmed || 'Item'}`;
    }, 'List item');
  };

  // Numbered list
  const applyNumberedList = () => {
    formatLines((line, idx) => {
      const trimmed = line.replace(/^([*-]|\d+\.)\s*/, '');
      return `${idx + 1}. ${trimmed || 'Item'}`;
    }, 'List item');
  };

  // Blockquote
  const applyBlockquote = () => {
    formatLines((line) => {
      const trimmed = line.replace(/^>\s*/, '');
      return `> ${trimmed || 'Quote'}`;
    }, 'Quote');
  };

  // Code Block
  const applyCodeBlock = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);
    const code = selected || 'console.log("Hello, world!");';

    const prevChar = start > 0 ? value[start - 1] : '\n';
    const nextChar = end < value.length ? value[end] : '\n';
    const prefix = prevChar === '\n' ? '```\n' : '\n```\n';
    const suffix = nextChar === '\n' ? '\n```' : '\n```\n';

    const newText = value.substring(0, start) + prefix + code + suffix + value.substring(end);
    const codeStart = start + prefix.length;
    const codeEnd = codeStart + code.length;
    applyFormatting(newText, codeStart, codeEnd);
  };

  // Horizontal Rule
  const applyHorizontalRule = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const prevChar = start > 0 ? value[start - 1] : '\n';
    const nextChar = end < value.length ? value[end] : '\n';
    const insert = `${prevChar === '\n' ? '' : '\n'}---\n${nextChar === '\n' ? '' : '\n'}`;

    const newText = value.substring(0, start) + insert + value.substring(end);
    const nextCursor = start + insert.length;
    applyFormatting(newText, nextCursor, nextCursor);
  };

  // Open Link Dialog
  const openLinkDialog = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);

    setLinkSelection({ start, end });
    setLinkText(selected);
    setLinkUrl('');
    setActiveDialog((prev) => (prev === 'link' ? 'none' : 'link'));
  };

  // Insert Link
  const handleInsertLink = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!linkUrl.trim()) return;

    const textToUse = linkText.trim() || 'link text';
    const linkMarkdown = `[${textToUse}](${linkUrl.trim()})`;

    const newText =
      value.substring(0, linkSelection.start) +
      linkMarkdown +
      value.substring(linkSelection.end);
    const cursor = linkSelection.start + linkMarkdown.length;

    applyFormatting(newText, cursor, cursor);
    setActiveDialog('none');
    setLinkText('');
    setLinkUrl('');
  };

  // Open Image Dialog
  const openImageDialog = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);

    setImageSelection({ start, end });
    setImageAlt(selected || '');
    setImageUrl('');
    setUploadError('');
    setActiveDialog((prev) => (prev === 'image' ? 'none' : 'image'));
  };

  // Insert Image URL
  const handleInsertImageUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!imageUrl.trim()) return;

    const alt = imageAlt.trim() || 'image';
    const imageMarkdown = `![${alt}](${imageUrl.trim()})`;

    const newText =
      value.substring(0, imageSelection.start) +
      imageMarkdown +
      value.substring(imageSelection.end);
    const cursor = imageSelection.start + imageMarkdown.length;

    applyFormatting(newText, cursor, cursor);
    setActiveDialog('none');
    setImageUrl('');
    setImageAlt('');
  };

  // Upload File & Insert Image
  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadImage) return;

    setUploading(true);
    setUploadError('');

    try {
      const uploadedUrl = await onUploadImage(file);
      const alt = imageAlt.trim() || file.name.replace(/\.[^/.]+$/, '');
      const imageMarkdown = `![${alt}](${uploadedUrl})`;

      const newText =
        value.substring(0, imageSelection.start) +
        imageMarkdown +
        value.substring(imageSelection.end);
      const cursor = imageSelection.start + imageMarkdown.length;

      applyFormatting(newText, cursor, cursor);
      setActiveDialog('none');
      setImageAlt('');
    } catch {
      setUploadError('Failed to upload image. Please check format and size (max 5MB).');
    } finally {
      setUploading(false);
    }
  };

  // Keyboard Shortcuts: Ctrl+B, Ctrl+I, Ctrl+K
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl) {
        if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          wrapInline('**', '**', 'bold text');
        } else if (e.key.toLowerCase() === 'i') {
          e.preventDefault();
          wrapInline('*', '*', 'italic text');
        } else if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          openLinkDialog();
        }
      }
    };

    el.addEventListener('keydown', handleKeyDown);
    return () => {
      el.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div className="relative border-b border-navy/10 bg-offwhite/90 backdrop-blur-sm px-2.5 py-1.5 rounded-t-xl select-none">
      {/* Toolbar Button Row */}
      <div className="flex items-center gap-0.5 flex-wrap">
        {/* Bold */}
        <button
          type="button"
          onClick={() => wrapInline('**', '**', 'bold text')}
          className="p-1.5 text-charcoal/70 hover:text-navy hover:bg-navy/5 rounded transition-colors"
          title="Bold (Ctrl+B)"
          aria-label="Bold"
        >
          <Bold size={16} />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => wrapInline('*', '*', 'italic text')}
          className="p-1.5 text-charcoal/70 hover:text-navy hover:bg-navy/5 rounded transition-colors"
          title="Italic (Ctrl+I)"
          aria-label="Italic"
        >
          <Italic size={16} />
        </button>

        <div className="w-[1px] h-4 bg-navy/15 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => applyHeading(2)}
          className="px-1.5 py-1 text-xs font-bold text-charcoal/70 hover:text-navy hover:bg-navy/5 rounded transition-colors flex items-center gap-0.5"
          title="Heading 2 (##)"
          aria-label="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyHeading(3)}
          className="px-1.5 py-1 text-xs font-bold text-charcoal/70 hover:text-navy hover:bg-navy/5 rounded transition-colors flex items-center gap-0.5"
          title="Heading 3 (###)"
          aria-label="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <div className="w-[1px] h-4 bg-navy/15 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={openLinkDialog}
          className={`p-1.5 rounded transition-colors ${
            activeDialog === 'link'
              ? 'bg-teal/20 text-teal-800'
              : 'text-charcoal/70 hover:text-navy hover:bg-navy/5'
          }`}
          title="Insert Link (Ctrl+K)"
          aria-label="Insert Link"
        >
          <LinkIcon size={16} />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={openImageDialog}
          className={`p-1.5 rounded transition-colors ${
            activeDialog === 'image'
              ? 'bg-teal/20 text-teal-800'
              : 'text-charcoal/70 hover:text-navy hover:bg-navy/5'
          }`}
          title="Insert Image"
          aria-label="Insert Image"
        >
          <ImageIcon size={16} />
        </button>

        <div className="w-[1px] h-4 bg-navy/15 mx-1" />

        {/* Bulleted List */}
        <button
          type="button"
          onClick={applyBulletList}
          className="p-1.5 text-charcoal/70 hover:text-navy hover:bg-navy/5 rounded transition-colors"
          title="Bulleted List"
          aria-label="Bulleted List"
        >
          <List size={16} />
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={applyNumberedList}
          className="p-1.5 text-charcoal/70 hover:text-navy hover:bg-navy/5 rounded transition-colors"
          title="Numbered List"
          aria-label="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={applyBlockquote}
          className="p-1.5 text-charcoal/70 hover:text-navy hover:bg-navy/5 rounded transition-colors"
          title="Blockquote (>)"
          aria-label="Blockquote"
        >
          <Quote size={16} />
        </button>

        <div className="w-[1px] h-4 bg-navy/15 mx-1" />

        {/* Inline Code */}
        <button
          type="button"
          onClick={() => wrapInline('`', '`', 'code')}
          className="p-1.5 text-charcoal/70 hover:text-navy hover:bg-navy/5 rounded transition-colors"
          title="Inline Code (`code`)"
          aria-label="Inline Code"
        >
          <Code size={16} />
        </button>

        {/* Code Block */}
        <button
          type="button"
          onClick={applyCodeBlock}
          className="p-1.5 text-charcoal/70 hover:text-navy hover:bg-navy/5 rounded transition-colors"
          title="Code Block (```code```)"
          aria-label="Code Block"
        >
          <SquareCode size={16} />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={applyHorizontalRule}
          className="p-1.5 text-charcoal/70 hover:text-navy hover:bg-navy/5 rounded transition-colors"
          title="Horizontal Rule (---)"
          aria-label="Horizontal Rule"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Inline Link Popover Dialog */}
      {activeDialog === 'link' && (
        <div
          ref={dialogRef}
          className="absolute left-2 top-full mt-1.5 z-30 w-80 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-xl border border-navy/15 p-3.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-navy/10">
            <span className="text-xs font-bold text-navy flex items-center gap-1.5">
              <LinkIcon size={13} className="text-teal" />
              Insert Link
            </span>
            <button
              type="button"
              onClick={() => setActiveDialog('none')}
              className="text-charcoal/40 hover:text-charcoal p-0.5 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-charcoal/70 mb-1">
                Link Text
              </label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleInsertLink();
                  }
                }}
                placeholder="Text to display..."
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-navy/20 focus:border-teal focus:ring-1 focus:ring-teal outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-charcoal/70 mb-1">
                Destination URL *
              </label>
              <input
                type="url"
                required
                autoFocus
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleInsertLink();
                  }
                }}
                placeholder="https://example.com"
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-navy/20 focus:border-teal focus:ring-1 focus:ring-teal outline-none transition-all font-mono"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setActiveDialog('none')}
                className="text-xs px-3 py-1 rounded-md text-charcoal/60 hover:text-charcoal hover:bg-navy/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleInsertLink()}
                className="text-xs px-3.5 py-1.5 rounded-lg bg-teal text-white font-semibold hover:bg-teal-600 transition-colors shadow-sm flex items-center gap-1"
              >
                <Check size={13} />
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Image Popover Dialog */}
      {activeDialog === 'image' && (
        <div
          ref={dialogRef}
          className="absolute left-2 top-full mt-1.5 z-30 w-88 max-w-[calc(100vw-3rem)] bg-white rounded-xl shadow-xl border border-navy/15 p-3.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-navy/10">
            <span className="text-xs font-bold text-navy flex items-center gap-1.5">
              <ImageIcon size={13} className="text-teal" />
              Insert Image
            </span>
            <button
              type="button"
              onClick={() => setActiveDialog('none')}
              className="text-charcoal/40 hover:text-charcoal p-0.5 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Dialog Tabs */}
          <div className="flex rounded-lg bg-navy/5 p-0.5 mb-3">
            <button
              type="button"
              onClick={() => setImageTab('upload')}
              className={`flex-1 text-xs py-1 font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
                imageTab === 'upload'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-charcoal/60 hover:text-navy'
              }`}
            >
              <Upload size={12} />
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setImageTab('url')}
              className={`flex-1 text-xs py-1 font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
                imageTab === 'url'
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-charcoal/60 hover:text-navy'
              }`}
            >
              <ExternalLink size={12} />
              Image URL
            </button>
          </div>

          {/* Alt Text Input (used by both tabs) */}
          <div className="mb-2.5">
            <label className="block text-[11px] font-semibold text-charcoal/70 mb-1">
              Alt Text (Image description)
            </label>
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="e.g., Team working at laptops"
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-navy/20 focus:border-teal focus:ring-1 focus:ring-teal outline-none transition-all"
            />
          </div>

          {imageTab === 'upload' ? (
            <div className="space-y-2">
              <label className="block">
                <span className="sr-only">Choose file</span>
                <div className="border border-dashed border-navy/25 hover:border-teal rounded-lg p-4 text-center cursor-pointer bg-offwhite hover:bg-teal/5 transition-all">
                  <Upload size={20} className="mx-auto text-teal mb-1" />
                  <p className="text-xs font-semibold text-navy">
                    {uploading ? 'Uploading...' : 'Click to select image file'}
                  </p>
                  <p className="text-[10px] text-charcoal/50 mt-0.5">JPG, PNG, WebP up to 5MB</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploading}
                    onChange={handleUploadImageFile}
                    className="hidden"
                  />
                </div>
              </label>

              {uploading && (
                <div className="flex items-center justify-center gap-2 py-1 text-xs text-teal font-medium">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-teal border-t-transparent animate-spin" />
                  Uploading to storage...
                </div>
              )}

              {uploadError && (
                <p className="text-xs text-red-500 font-medium text-center">{uploadError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-charcoal/70 mb-1">
                  Image Web URL *
                </label>
                <input
                  type="url"
                  required
                  autoFocus
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleInsertImageUrl();
                    }
                  }}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-navy/20 focus:border-teal focus:ring-1 focus:ring-teal outline-none transition-all font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveDialog('none')}
                  className="text-xs px-3 py-1 rounded-md text-charcoal/60 hover:text-charcoal hover:bg-navy/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertImageUrl()}
                  className="text-xs px-3.5 py-1.5 rounded-lg bg-teal text-white font-semibold hover:bg-teal-600 transition-colors shadow-sm flex items-center gap-1"
                >
                  <Check size={13} />
                  Insert Image
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
