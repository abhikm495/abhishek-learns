import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAdminToken } from "@/lib/auth";

export async function GET() {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE)?.value;
  const isAdmin = await verifyAdminToken(token);
  return NextResponse.json({ isAdmin });
}
