import { NextRequest, NextResponse } from "next/server";
import { getBookmarkById, updateBookmark, deleteBookmark } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookmark = getBookmarkById(Number(id));
  if (!bookmark) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(bookmark);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const bookmark = updateBookmark(Number(id), body);
    if (!bookmark) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(bookmark);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = deleteBookmark(Number(id));
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
