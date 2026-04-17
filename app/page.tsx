"use client";

import { useState, useEffect } from "react";

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
const CATEGORY_COLORS: Record<string, string> = {
  all: "bg-gray-100 text-gray-500",
  ai: "bg-purple-100 text-purple-700",
  infra: "bg-blue-100 text-blue-700",
  devtools: "bg-green-100 text-green-700",
  design: "bg-pink-100 text-pink-700",
  business: "bg-amber-100 text-amber-700",
  other: "bg-gray-100 text-gray-600",
};

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    url: "",
    title: "",
    description: "",
    category: "other",
    tags: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = { ...form, tags };

    if (editingId) {
      await fetch(`/api/bookmarks/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({ url: "", title: "", description: "", category: "other", tags: "" });
    setEditingId(null);
    setShowForm(false);
    fetchBookmarks();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this bookmark?")) return;
    await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
    fetchBookmarks();
  }

  function startEdit(b: Bookmark) {
    setForm({
      url: b.url,
      title: b.title,
      description: b.description,
      category: b.category,
      tags: b.tags.join(", "),
    });
    setEditingId(b.id);
    setShowForm(true);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">DV</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">devault</h1>
          </div>
          <button
            onClick={() => {
              setForm({ url: "", title: "", description: "", category: "other", tags: "" });
              setEditingId(null);
              setShowForm(true);
            }}
            className="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            + Add
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">
                {editingId ? "Edit bookmark" : "Add new bookmark"}
              </h2>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                type="url"
                placeholder="https://..."
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <input
                required
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <div className="flex gap-3">
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {CATEGORIES.filter(c => c !== "all").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Tags: ai, rust"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition"
            >
              {editingId ? "Save changes" : "Add bookmark"}
            </button>
          </form>
        )}

        {/* Bookmark count */}
        <p className="text-xs text-gray-400 mb-4">
          {filtered.length} bookmark{filtered.length !== 1 ? "s" : ""}
          {search && ` matching "${search}"`}
          {activeCategory !== "all" && ` in ${activeCategory}`}
        </p>

        {/* Bookmarks List */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔗</div>
            <p className="text-gray-400 text-sm">No bookmarks yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 hover:border-gray-300 transition group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-gray-900 hover:text-gray-600 text-sm truncate"
                    >
                      {b.title}
                    </a>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[b.category] ?? CATEGORY_COLORS.other}`}>
                      {b.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{b.description}</p>
                  {b.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {b.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => startEdit(b)}
                    className="text-xs text-gray-400 hover:text-gray-700 text-right"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-xs text-gray-400 hover:text-red-500 text-right"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
