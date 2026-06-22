import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Check, LogOut, FileText } from 'lucide-react';
import { blogApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import type { BlogPost, BlogPostCreate, BlogPostUpdate } from '../types';

type ModalState =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'edit'; post: BlogPost }
  | { type: 'delete'; post: BlogPost };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/, '');
}

interface ImageCropperProps {
  src: string;
  onCrop: (blob: Blob) => void;
  onCancel: () => void;
  loading: boolean;
}

function ImageCropper({ src, onCrop, onCancel, loading }: ImageCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setStartPos({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({ x: touch.clientX - startPos.x, y: touch.clientY - startPos.y });
  };

  const handleCropClick = () => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const cropW = 1200;
      const cropH = 675; // 16:9 aspect ratio
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, cropW, cropH);

      const previewWidth = containerRef.current?.offsetWidth || 500;
      const ratio = cropW / previewWidth;

      ctx.translate(cropW / 2, cropH / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(pan.x * ratio, pan.y * ratio);

      const imgAspect = img.width / img.height;
      const containerAspect = 16 / 9;
      let drawW = cropW;
      let drawH = cropH;
      if (imgAspect > containerAspect) {
        drawH = cropW / imgAspect;
      } else {
        drawW = cropH * imgAspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCrop(blob);
          }
        },
        'image/jpeg',
        0.9
      );
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-navy/10 pb-3">
          <h3 className="font-heading font-bold text-navy text-sm">Crop Cover Image (16:9)</h3>
          <button type="button" onClick={onCancel} className="text-charcoal/40 hover:text-charcoal transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-charcoal/60">
            Drag image inside the preview window to position it. Use the slider to zoom.
          </p>

          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-black border border-navy/20 cursor-grab active:cursor-grabbing select-none"
          >
            <img
              src={src}
              alt="Crop preview"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center',
              }}
              className="w-full h-full object-contain pointer-events-none"
            />
            <div className="absolute inset-0 border-2 border-dashed border-teal pointer-events-none" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-charcoal/60 font-semibold">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-navy/10 rounded-lg appearance-none cursor-pointer accent-teal"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy/10">
          <button type="button" onClick={onCancel} className="btn-secondary text-xs py-2 px-4">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropClick}
            disabled={loading}
            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            {loading ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Check size={14} />
            )}
            Crop & Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function PostForm({
  initial,
  onSave,
  onCancel,
  loading,
}: {
  initial?: Partial<BlogPost>;
  onSave: (data: BlogPostCreate) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [body, setBody] = useState(initial?.body || '');
  const [coverImage, setCoverImage] = useState(initial?.cover_image || '');
  const [published, setPublished] = useState(initial?.published ?? false);
  const [preview, setPreview] = useState(false);

  // Image upload and crop states
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!initial?.slug) setSlug(slugify(v));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result as string);
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropped = async (croppedBlob: Blob) => {
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', croppedBlob, 'cover-image.jpg');
      const res = await blogApi.upload(formData);
      setCoverImage(res.data.url);
      setCropperOpen(false);
    } catch {
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, slug, excerpt, body, cover_image: coverImage || undefined, published });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="form-input"
              placeholder="Post title..."
            />
          </div>
          <div>
            <label className="form-label">Slug *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="form-input font-mono text-sm"
              placeholder="post-url-slug"
            />
          </div>
        </div>

        <div>
          <label className="form-label">Excerpt</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="form-input"
            placeholder="Short summary (shown in blog listing)"
            maxLength={300}
          />
        </div>

        {/* Cover Image Input Options */}
        <div className="space-y-3">
          <label className="form-label">Cover Image</label>

          {/* Upload Box */}
          <div className="border border-dashed border-navy/20 hover:border-teal rounded-xl p-6 flex flex-col items-center justify-center bg-offwhite hover:bg-teal/5 transition-all relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              onChange={handleFileChange}
            />
            <div className="text-center space-y-1 text-charcoal/50">
              <Plus size={24} className="mx-auto text-teal mb-1" />
              <p className="text-sm font-bold text-navy">Upload & Crop Image</p>
              <p className="text-xs text-charcoal/65">Select an image from your computer or mobile device</p>
            </div>
          </div>

          {/* Current Cover Image Preview */}
          {coverImage && (
            <div className="relative w-full max-w-[200px] aspect-[16/9] rounded-lg overflow-hidden border border-navy/10 bg-navy/5 group">
              <img
                src={coverImage.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || window.location.origin}${coverImage}` : coverImage}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=150&q=80';
                }}
              />
              <button
                type="button"
                onClick={() => setCoverImage('')}
                className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {uploadError && (
            <p className="text-xs text-red-500 font-semibold">{uploadError}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="form-label mb-0">Body (Markdown) *</label>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="text-xs text-teal font-medium flex items-center gap-1"
            >
              {preview ? <EyeOff size={12} /> : <Eye size={12} />}
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {preview ? (
            <div className="min-h-[200px] p-4 bg-offwhite rounded-lg border border-navy/20 prose prose-sm max-w-none text-charcoal/80">
              <pre className="whitespace-pre-wrap font-sans text-sm">{body || 'Nothing to preview...'}</pre>
            </div>
          ) : (
            <textarea
              required
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="form-textarea font-mono text-sm"
              placeholder="Write your post content in Markdown..."
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={published}
            onClick={() => setPublished(!published)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
              ${published ? 'bg-teal' : 'bg-navy/20'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                ${published ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          <span className="text-sm font-medium text-charcoal">
            {published ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-navy/10">
          <button type="button" onClick={onCancel} className="btn-secondary text-sm py-2">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary text-sm py-2">
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Save Post
          </button>
        </div>
      </form>

      {cropperOpen && cropSrc && (
        <ImageCropper
          src={cropSrc}
          onCrop={handleCropped}
          onCancel={() => setCropperOpen(false)}
          loading={uploading}
        />
      )}
    </>
  );
}

export default function AdminDashboardPage() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadPosts = async () => {
    try {
      const res = await blogApi.listAll();
      setPosts(res.data);
    } catch {
      /* silently fail — interceptor handles 401 */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreate = async (data: BlogPostCreate) => {
    setSaving(true);
    try {
      await blogApi.create(data);
      await loadPosts();
      setModal({ type: 'none' });
      showToast('Post created successfully!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      showToast(msg || 'Failed to create post.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id: number, data: BlogPostUpdate) => {
    setSaving(true);
    try {
      await blogApi.update(id, data);
      await loadPosts();
      setModal({ type: 'none' });
      showToast('Post updated successfully!');
    } catch {
      showToast('Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setSaving(true);
    try {
      await blogApi.delete(id);
      await loadPosts();
      setModal({ type: 'none' });
      showToast('Post deleted.');
    } catch {
      showToast('Failed to delete post.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <main className="min-h-screen bg-offwhite">
      {/* Topbar */}
      <header className="bg-navy text-white sticky top-0 z-40 shadow-lg">
        <div className="container-custom flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo-horizontal.svg"
              alt="Dual Craft"
              className="h-8 w-auto brightness-0 invert"
            />
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="text-sm text-white/60 hidden sm:inline">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/50 hidden sm:block">{admin?.email}</span>
            <Link to="/" className="text-white/50 hover:text-white text-sm transition-colors">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/50 hover:text-red-400 text-sm transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-navy text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      <div className="container-custom py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-navy">Blog Posts</h1>
            <p className="text-charcoal/50 text-sm mt-1">
              {posts.length} post{posts.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="btn-primary text-sm"
            id="admin-create-post"
          >
            <Plus size={16} />
            New Post
          </button>
        </div>

        {/* Posts table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-teal border-t-transparent animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-4">
              <FileText size={24} />
            </div>
            <h2 className="text-xl font-heading font-bold text-navy mb-2">No posts yet</h2>
            <p className="text-charcoal/50 text-sm mb-6">Create your first blog post to get started.</p>
            <button onClick={() => setModal({ type: 'create' })} className="btn-primary text-sm">
              <Plus size={16} /> Create First Post
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-navy/5 border-b border-navy/10">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-charcoal/50 uppercase tracking-wider hidden sm:table-cell">
                      Slug
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-charcoal/50 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/8">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-navy/2 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-navy text-sm line-clamp-1">{post.title}</p>
                        {post.excerpt && (
                          <p className="text-charcoal/45 text-xs mt-0.5 line-clamp-1">{post.excerpt}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <code className="text-xs bg-navy/8 px-2 py-0.5 rounded text-charcoal/60">
                          {post.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge text-xs ${post.published
                              ? 'bg-teal/10 text-teal-700'
                              : 'bg-navy/10 text-navy/60'
                            }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-charcoal/50 text-xs">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModal({ type: 'edit', post })}
                            className="p-1.5 text-charcoal/40 hover:text-teal hover:bg-teal/10 rounded-lg transition-colors"
                            aria-label="Edit post"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setModal({ type: 'delete', post })}
                            className="p-1.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Delete post"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ─── MODALS ──────────────────────────────────────────── */}
      {modal.type !== 'none' && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setModal({ type: 'none' })}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-navy/10">
              <h2 className="text-xl font-heading font-bold text-navy">
                {modal.type === 'create'
                  ? 'Create New Post'
                  : modal.type === 'edit'
                    ? 'Edit Post'
                    : 'Delete Post'}
              </h2>
              <button
                onClick={() => setModal({ type: 'none' })}
                className="p-2 text-charcoal/40 hover:text-charcoal rounded-lg hover:bg-navy/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              {modal.type === 'create' && (
                <PostForm
                  onSave={handleCreate}
                  onCancel={() => setModal({ type: 'none' })}
                  loading={saving}
                />
              )}

              {modal.type === 'edit' && (
                <PostForm
                  initial={modal.post}
                  onSave={(data) => handleUpdate(modal.post.id, data)}
                  onCancel={() => setModal({ type: 'none' })}
                  loading={saving}
                />
              )}

              {modal.type === 'delete' && (
                <div className="text-center py-4">
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} className="text-red-500" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-navy mb-2">
                    Delete this post?
                  </h3>
                  <p className="text-charcoal/60 text-sm mb-6">
                    "<strong>{modal.post.title}</strong>" will be permanently deleted.
                    This cannot be undone.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setModal({ type: 'none' })}
                      className="btn-secondary text-sm py-2 px-6"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(modal.post.id)}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white font-semibold 
                        rounded-lg hover:bg-red-600 transition-colors text-sm disabled:opacity-60"
                    >
                      {saving ? (
                        <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
