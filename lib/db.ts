import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "devault.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        category TEXT DEFAULT 'general',
        tags TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return db;
}

export interface Bookmark {
  id: number;
  url: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BookmarkInput {
  url: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export function getAllBookmarks(): Bookmark[] {
  const rows = getDb()
    .prepare("SELECT * FROM bookmarks ORDER BY created_at DESC")
    .all() as (Omit<Bookmark, "tags"> & { tags: string })[];
  return rows.map((row) => ({
    ...row,
    tags: JSON.parse(row.tags),
  }));
}

export function getBookmarkById(id: number): Bookmark | null {
  const row = getDb()
    .prepare("SELECT * FROM bookmarks WHERE id = ?")
    .get(id) as (Omit<Bookmark, "tags"> & { tags: string }) | undefined;
  if (!row) return null;
  return { ...row, tags: JSON.parse(row.tags) };
}

export function createBookmark(input: BookmarkInput): Bookmark {
  const stmt = getDb().prepare(`
    INSERT INTO bookmarks (url, title, description, category, tags)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.url,
    input.title,
    input.description ?? "",
    input.category ?? "general",
    JSON.stringify(input.tags ?? [])
  );
  return getBookmarkById(result.lastInsertRowid as number)!;
}

export function updateBookmark(
  id: number,
  input: Partial<BookmarkInput>
): Bookmark | null {
  const existing = getBookmarkById(id);
  if (!existing) return null;

  const stmt = getDb().prepare(`
    UPDATE bookmarks SET
      url = ?, title = ?, description = ?, category = ?, tags = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(
    input.url ?? existing.url,
    input.title ?? existing.title,
    input.description ?? existing.description,
    input.category ?? existing.category,
    JSON.stringify(input.tags ?? existing.tags),
    id
  );
  return getBookmarkById(id);
}

export function deleteBookmark(id: number): boolean {
  const result = getDb()
    .prepare("DELETE FROM bookmarks WHERE id = ?")
    .run(id);
  return result.changes > 0;
}
