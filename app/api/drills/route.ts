import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const playerId = req.nextUrl.searchParams.get("player_id");

    if (playerId) {
      // Get drills assigned to player
      const { data: assignments } = await supabase
        .from("player_drill_assignments")
        .select(
          `
          id,
          due_date,
          status,
          completion_date,
          drills (id, title, category, description, instructions)
        `
        )
        .eq("player_id", playerId)
        .order("due_date", { ascending: true });

      return NextResponse.json({ assignments: assignments || [] });
    } else {
      // Get all drills in academy
      const { data: drills } = await supabase
        .from("drills")
        .select("*")
        .eq("academy_id", process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID)
        .order("created_at", { ascending: false });

      return NextResponse.json({ drills: drills || [] });
    }
  } catch (err) {
    console.error("Drills error:", err);
    return NextResponse.json(
      { error: "Failed to fetch drills" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, coach_id, drill_id, player_id, due_date } = body;

    if (action === "CREATE") {
      const { title, category, description, instructions } = body;

      const { data: drill, error } = await supabase
        .from("drills")
        .insert([
          {
            academy_id: process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID,
            title,
            category: category || null,
            description: description || null,
            instructions: instructions || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ drill });
    }

    if (action === "ASSIGN") {
      const { data: assignment, error } = await supabase
        .from("player_drill_assignments")
        .insert([
          {
            player_id,
            drill_id,
            coach_id,
            due_date,
            status: "ASSIGNED",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ assignment });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Drill action error:", err);
    return NextResponse.json(
      { error: "Failed to process drill action" },
      { status: 500 }
    );
  }
}
