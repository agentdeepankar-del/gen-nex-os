import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const playerId = req.nextUrl.searchParams.get("player_id");

    if (!playerId) {
      return NextResponse.json(
        { error: "player_id required" },
        { status: 400 }
      );
    }

    const { data: goals } = await supabase
      .from("goals")
      .select("*")
      .eq("player_id", playerId)
      .order("created_at", { ascending: false });

    return NextResponse.json({ goals: goals || [] });
  } catch (err) {
    console.error("Goals error:", err);
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { player_id, coach_id, title, description, target, due_date } = body;

    if (!player_id || !coach_id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: goal, error } = await supabase
      .from("goals")
      .insert([
        {
          player_id,
          coach_id,
          title,
          description: description || null,
          target: target || null,
          due_date: due_date || null,
          status: "ACTIVE",
          progress: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    await supabase.from("audit_log").insert([
      {
        academy_id: process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID,
        entity_type: "GOAL",
        entity_id: goal.id,
        action: "CREATED",
        new_value: JSON.stringify({ title, status: "ACTIVE" }),
        user_id: coach_id,
        timestamp: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({ goal });
  } catch (err) {
    console.error("Goal creation error:", err);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
