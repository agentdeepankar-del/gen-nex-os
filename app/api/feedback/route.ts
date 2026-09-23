import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { player_id, drill_assignment_id, media_id, coach_id, feedback } =
      await req.json();

    if (!player_id || !drill_assignment_id || !coach_id || !feedback) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("coach_feedback")
      .insert([
        {
          player_id,
          drill_assignment_id,
          media_id: media_id || null,
          coach_id,
          feedback,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ feedback: data[0] }, { status: 201 });
  } catch (error: any) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add feedback" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const player_id = searchParams.get("player_id");
    const drill_assignment_id = searchParams.get("drill_assignment_id");

    let query = supabase.from("coach_feedback").select("*");

    if (player_id) {
      query = query.eq("player_id", player_id);
    }

    if (drill_assignment_id) {
      query = query.eq("drill_assignment_id", drill_assignment_id);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json({ feedback: data });
  } catch (error: any) {
    console.error("Fetch feedback error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
