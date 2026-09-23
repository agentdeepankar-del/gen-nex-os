import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Get all coaches and support staff who are active
    const { data: collectors, error } = await supabase
      .from("users")
      .select("id, name, phone, role")
      .in("role", ["COACH", "SUPPORT_STAFF"])
      .eq("status", "ACTIVE")
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      collectors: collectors || [],
    });
  } catch (err) {
    console.error("Error fetching collectors:", err);
    return NextResponse.json(
      { error: "Failed to fetch collectors" },
      { status: 500 }
    );
  }
}
