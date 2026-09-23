import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const batchId = req.nextUrl.searchParams.get("batch_id");
    const sessionDate = req.nextUrl.searchParams.get("date");

    if (!batchId || !sessionDate) {
      return NextResponse.json(
        { error: "batch_id and date required" },
        { status: 400 }
      );
    }

    // Get or create session for today
    const { data: session, error: sessionError } = await supabase
      .from("attendance_sessions")
      .select("*")
      .eq("batch_id", batchId)
      .eq("session_date", sessionDate)
      .single();

    if (sessionError && sessionError.code === "PGRST116") {
      // No session exists, create one
      const { data: newSession } = await supabase
        .from("attendance_sessions")
        .insert([
          {
            batch_id: batchId,
            coach_id: "coach-1",
            session_date: sessionDate,
            start_time: "09:00",
            end_time: "10:30",
            status: "SCHEDULED",
          },
        ])
        .select()
        .single();

      return NextResponse.json({ session: newSession });
    }

    return NextResponse.json({ session });
  } catch (err) {
    console.error("Attendance error:", err);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, player_id, status, coach_id, notes } = body;

    if (!session_id || !player_id || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if record exists
    const { data: existing } = await supabase
      .from("attendance_records")
      .select("id")
      .eq("session_id", session_id)
      .eq("player_id", player_id)
      .single();

    if (existing) {
      // Update existing
      await supabase
        .from("attendance_records")
        .update({ status, notes })
        .eq("id", existing.id);
    } else {
      // Create new
      await supabase.from("attendance_records").insert([
        {
          session_id,
          player_id,
          status,
          recorded_by: coach_id,
          notes: notes || null,
        },
      ]);
    }

    return NextResponse.json({ message: "Attendance recorded" });
  } catch (err) {
    console.error("Attendance error:", err);
    return NextResponse.json(
      { error: "Failed to record attendance" },
      { status: 500 }
    );
  }
}
