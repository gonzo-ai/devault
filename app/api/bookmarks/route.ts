import { NextRequest, NextResponse } from "next/server";
import { getAllBookmarks, createBookmark } from "@/lib/db";

export async function GET() {
  try {
    const bookmarks = getAllBookmarks();
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, title, description, category, tags } = body;

    if (!url || !title) {
      return NextResponse.json(
        { error: "url and title are required" },
        { status: 400 }
      );
    }

    const bookmark = createBookmark({ url, title, description, category, tags });
    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
  }
}
