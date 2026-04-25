"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Bookmark {
  id: number;
  url: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  created_at: string;
}

const CATEGORIES = ["all", "ai", "infra", "devtools", "design", "business", "other"];

const CAT_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  ai: { bg: "#eef0ff", color: "#3b3db8", border: "#c5c6f5" },
  infra: { bg: "#eef5fb", color: "#1567a0", border: "#b3d4ee" },
  devtools: { bg: "#eef6ef", color: "#1e6e3e", border: "#b3d9c2" },
  design: { bg: "#fbeeef", color: "#9c3462", border: "#f0b3c5" },
  business: { bg: "#fef5e6", color: "#8c5a12", border: "#f5d79e" },
  other: { bg: "#f2f0ed", color: "#4a4642", border: "#ccc7bf" },
};

function BookmarkCard({ b, onEdit, onDelete }: {
  b: Bookmark;
  onEdit: (b: Bookmark) => void;
  onDelete: (id: number) => void;
}) {
  const cat = CAT_STYLES[b.category] ?? CAT_STYLES.other;
  const host = (() => {
    try { return new URL(b.url).hostname; } catch { return b.url; }
  })();

  return (
    <article className="bookmark-card animate-fade-in" style={{ animationFillMode: "both", background: cat.bg, borderLeftColor: cat.color, borderLeftWidth: "3px" }}>
      <div className="bookmark-inner">
        <div className="bookmark-left">
          <div className="bookmark-eyebrow">
            <span
              className="category-badge"
              style={{
                background: cat.bg,
                color: cat.color,
                border: `1px solid ${cat.border}`,
              }}
            >
              {b.category}
            </span>
            <span className="bookmark-host mono text-xs text-tertiary">{host}</span>
          </div>
          <a
            href={b.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bookmark-title serif"
          >
            {b.title}
          </a>
          {b.description && (
            <p className="bookmark-desc text-sm text-secondary">{b.description}</p>
          )}
          {b.tags.length > 0 && (
            <div className="bookmark-tags">
              {b.tags.map((tag) => (
                <span key={tag} className="tag mono">#{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="bookmark-actions">
          <button
            onClick={() => onEdit(b)}
            className="action-btn edit-btn"
            title="Edit"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={() => onDelete(b.id)}
            className="action-btn delete-btn"
            title="Delete"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .bookmark-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          transition: border-color 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        .bookmark-card:hover {
          border-color: var(--color-border-hover);
          box-shadow: var(--shadow-md);
        }
        .bookmark-inner {
          display: flex;
          align-items: flex-start;
          gap: var(--space-4);
          padding: var(--space-5) var(--space-6);
        }
        .bookmark-left {
          flex: 1;
          min-width: 0;
        }
        .bookmark-eyebrow {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-2);
        }
        .category-badge {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 99px;
          white-space: nowrap;
        }
        .bookmark-host {
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 200px;
        }
        .bookmark-title {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text);
          line-height: 1.35;
          margin-bottom: var(--space-2);
          transition: color 0.15s;
          text-decoration: none;
        }
        .bookmark-title:hover {
          color: var(--color-accent);
        }
        .bookmark-desc {
          line-height: 1.55;
          margin-bottom: var(--space-3);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .bookmark-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-1);
        }
        .tag {
          font-size: 11px;
          font-weight: 500;
          color: var(--color-text-tertiary);
          background: var(--color-bg-alt);
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid var(--color-border);
        }
        .bookmark-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          opacity: 0;
          transition: opacity 0.2s;
          flex-shrink: 0;
          padding-top: 2px;
        }
        .bookmark-card:hover .bookmark-actions {
          opacity: 1;
        }
        .action-btn {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
          color: var(--color-text-tertiary);
        }
        .edit-btn:hover {
          background: var(--color-bg-alt);
          color: var(--color-text-secondary);
        }
        .delete-btn:hover {
          background: #fef2f2;
          color: #dc2626;
        }
        @media (max-width: 600px) {
          .bookmark-actions { opacity: 1; }
          .bookmark-inner { padding: var(--space-4); }
        }
      `}</style>
    </article>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text-tertiary)" }}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </div>
      <p className="empty-title serif">
        {hasFilters ? "No matches found" : "Your vault is empty"}
      </p>
      <p className="empty-sub text-sm text-secondary">
        {hasFilters
          ? "Try a different search or category."
          : "Save your first bookmark to start building your collection."}
      </p>
      <style jsx>{`
        .empty-state {
          text-align: center;
          padding: var(--space-16) 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
        }
        .empty-icon {
          width: 80px;
          height: 80px;
          background: var(--color-bg-alt);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-2);
        }
        .empty-title {
          font-size: 22px;
          font-weight: 600;
          color: var(--color-text);
        }
        .empty-sub {
          max-width: 280px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}

function BookmarkForm({
  initial,
  editing,
  onSubmit,
  onCancel,
}: {
  initial?: Bookmark;
  editing: boolean;
  onSubmit: (data: { url: string; title: string; description: string; category: string; tags: string }) => void;
  onCancel: () => void;
}) {
  const [url, setUrl] = useState(initial?.url ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "other");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => { urlRef.current?.focus(); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ url, title, description, category, tags });
  }

  return (
    <div className="form-overlay animate-fade-in" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="form-panel animate-scale-in">
        <div className="form-header">
          <h2 className="form-title serif">{editing ? "Edit bookmark" : "New bookmark"}</h2>
          <button onClick={onCancel} className="close-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="field">
            <label className="field-label text-xs font-semibold text-secondary">URL *</label>
            <input
              ref={urlRef}
              required
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="field-input"
            />
          </div>

          <div className="field">
            <label className="field-label text-xs font-semibold text-secondary">Title *</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name of the tool or project"
              className="field-input"
            />
          </div>

          <div className="field">
            <label className="field-label text-xs font-semibold text-secondary">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this? Why is it interesting?"
              rows={3}
              className="field-input field-textarea"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label text-xs font-semibold text-secondary">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="field-input">
                {CATEGORIES.filter(c => c !== "all").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field-label text-xs font-semibold text-secondary">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ai, rust, video (comma separated)"
                className="field-input"
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" onClick={onCancel} className="cancel-btn text-sm">
              Cancel
            </button>
            <button type="submit" className="submit-btn text-sm font-semibold">
              {editing ? "Save changes" : "Add bookmark"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .form-overlay {
          position: fixed;
          inset: 0;
          background: rgba(28, 26, 23, 0.4);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
        }
        .form-panel {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 520px;
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }
        .form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-5) var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }
        .form-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text);
        }
        .close-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-tertiary);
          transition: background 0.15s, color 0.15s;
        }
        .close-btn:hover {
          background: var(--color-bg-alt);
          color: var(--color-text);
        }
        .form-body {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          flex: 1;
        }
        .field-label {
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .field-input {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 10px var(--space-3);
          font-size: 14px;
          color: var(--color-text);
          transition: border-color 0.15s, box-shadow 0.15s;
          width: 100%;
          resize: none;
        }
        .field-input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(196, 125, 30, 0.12);
        }
        .field-input::placeholder {
          color: var(--color-text-tertiary);
        }
        .field-textarea {
          line-height: 1.55;
          resize: vertical;
        }
        .field-row {
          display: flex;
          gap: var(--space-4);
        }
        @media (max-width: 480px) {
          .field-row { flex-direction: column; }
        }
        .form-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
          padding-top: var(--space-2);
          border-top: 1px solid var(--color-border);
          margin-top: var(--space-2);
        }
        .cancel-btn {
          padding: 10px var(--space-5);
          border-radius: var(--radius-sm);
          color: var(--color-text-secondary);
          transition: background 0.15s;
          font-weight: 500;
        }
        .cancel-btn:hover {
          background: var(--color-bg-alt);
        }
        .submit-btn {
          background: var(--color-text);
          color: var(--color-bg);
          padding: 10px var(--space-6);
          border-radius: var(--radius-sm);
          font-weight: 600;
          transition: background 0.15s, transform 0.1s;
        }
        .submit-btn:hover {
          background: #2d2b27;
        }
        .submit-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    fetchBookmarks();
  }, []);

  async function fetchBookmarks() {
    try {
      const res = await fetch("/api/bookmarks");
      const data = await res.json();
      setBookmarks(data);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(data: { url: string; title: string; description: string; category: string; tags: string }) {
    const tags = data.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = { ...data, tags };

    if (editingBookmark) {
      fetch(`/api/bookmarks/${editingBookmark.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(() => {
        setShowForm(false);
        setEditingBookmark(null);
        fetchBookmarks();
      });
    } else {
      fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(() => {
        setShowForm(false);
        fetchBookmarks();
      });
    }
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this bookmark?")) return;
    fetch(`/api/bookmarks/${id}`, { method: "DELETE" }).then(() => fetchBookmarks());
  }

  const filtered = bookmarks.filter((b) => {
    const matchSearch =
      search === "" ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "all" || b.category === activeCategory;
    return matchSearch && matchCat;
  });

  const hasFilters = search !== "" || activeCategory !== "all";

  return (
    <div className="page">
      {/* Header */}
      <header className="site-header">
        <div className="container header-inner">
          <div className="logo">
            <div className="logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 5V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 5V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 5V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <span className="logo-text serif">devault</span>
          </div>
          <div className="header-right">
            <span className="bookmark-count text-xs text-tertiary mono">
              {bookmarks.length} saved
            </span>
            <button
              onClick={() => { setEditingBookmark(null); setShowForm(true); }}
              className="add-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add
            </button>
            <button onClick={handleLogout} className="logout-btn" title="Log out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title serif">
            Your link<br />
            <em>vault.</em>
          </h1>
          <p className="hero-sub text-secondary">
            Curated tools, repos, and discoveries — all in one place.
          </p>

          {/* Search */}
          <div className="search-wrap">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, description, or tag..."
              className="search-input"
            />
          </div>

          {/* Category filters */}
          <div className="filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`filter-btn text-xs font-semibold ${activeCategory === cat ? "active" : ""}`}
              >
                {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="container main-content">
        {/* Results meta */}
        {!loading && (
          <div className="results-meta text-xs text-tertiary">
            {filtered.length === 0
              ? "Nothing here yet"
              : `${filtered.length} ${filtered.length === 1 ? "result" : "results"}${hasFilters ? " found" : ""}`}
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="skeleton-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="skeleton-line short" />
                <div className="skeleton-line medium" />
                <div className="skeleton-line long" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasFilters={hasFilters} />
        ) : (
          <div className="bookmark-list">
            {filtered.map((b, i) => (
              <div key={b.id} style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                <BookmarkCard
                  b={b}
                  onEdit={(bb) => { setEditingBookmark(bb); setShowForm(true); }}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <p className="text-xs text-tertiary">
            Built with taste · {new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {/* Form modal */}
      {showForm && (
        <BookmarkForm
          initial={editingBookmark ?? undefined}
          editing={!!editingBookmark}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingBookmark(null); }}
        />
      )}

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .site-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(249, 246, 240, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .logo-mark {
          width: 36px;
          height: 36px;
          background: var(--color-text);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-bg);
        }
        .logo-text {
          font-size: 20px;
          font-weight: 600;
          font-style: italic;
          color: var(--color-text);
          letter-spacing: -0.02em;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .bookmark-count {
          display: none;
        }
        @media (min-width: 480px) {
          .bookmark-count { display: block; }
        }
        .add-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--color-text);
          color: var(--color-bg);
          font-size: 13px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          transition: background 0.15s, transform 0.1s;
        }
        .add-btn:hover { background: #2d2b27; }
        .add-btn:active { transform: scale(0.97); }
        .logout-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-tertiary);
          border: 1px solid var(--color-border);
          transition: background 0.15s, color 0.15s;
        }
        .logout-btn:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }

        /* Hero */
        .hero {
          padding: var(--space-16) 0 var(--space-10);
          border-bottom: 1px solid var(--color-border);
        }
        .hero-title {
          font-size: clamp(40px, 8vw, 64px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--color-text);
          margin-bottom: var(--space-4);
        }
        .hero-title em {
          font-style: italic;
          color: var(--color-accent);
        }
        .hero-sub {
          font-size: 16px;
          margin-bottom: var(--space-8);
          max-width: 380px;
          line-height: 1.6;
        }

        /* Search */
        .search-wrap {
          position: relative;
          margin-bottom: var(--space-5);
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-tertiary);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 13px 16px 13px 40px;
          font-size: 14px;
          color: var(--color-text);
          transition: border-color 0.15s, box-shadow 0.15s;
          box-shadow: var(--shadow-sm);
        }
        .search-input:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(196, 125, 30, 0.1), var(--shadow-sm);
        }
        .search-input::placeholder {
          color: var(--color-text-tertiary);
        }

        /* Filters */
        .filters {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 6px 14px;
          border-radius: 99px;
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          background: var(--color-surface);
          transition: all 0.15s;
          letter-spacing: 0.01em;
        }
        .filter-btn:hover {
          border-color: var(--color-border-hover);
          color: var(--color-text);
        }
        .filter-btn.active {
          background: var(--color-text);
          border-color: var(--color-text);
          color: var(--color-bg);
        }

        /* Main */
        .main-content {
          flex: 1;
          padding-top: var(--space-8);
          padding-bottom: var(--space-16);
        }
        .results-meta {
          margin-bottom: var(--space-5);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--color-border);
        }
        .bookmark-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        /* Loading skeleton */
        .skeleton-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .skeleton-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-5) var(--space-6);
          animation: fadeIn 0.4s ease-out both;
        }
        .skeleton-line {
          height: 12px;
          background: var(--color-bg-alt);
          border-radius: 4px;
          margin-bottom: var(--space-3);
          animation: pulse 1.5s ease-in-out infinite;
        }
        .skeleton-line.short { width: 30%; }
        .skeleton-line.medium { width: 55%; }
        .skeleton-line.long { width: 80%; margin-bottom: 0; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Footer */
        .site-footer {
          padding: var(--space-8) 0;
          border-top: 1px solid var(--color-border);
          text-align: center;
        }
      `}</style>
    </div>
  );
}
