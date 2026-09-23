import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Phone and password required" },
        { status: 400 }
      );
    }

    // Find player by phone
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("id, full_name, phone, status")
      .eq("phone", phone)
      .eq("academy_id", process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID)
      .single();

    if (playerError || !player) {
      return NextResponse.json(
        { error: "Player not found" },
        { status: 404 }
      );
    }

    // Get user auth record
    const { data: authUser, error: authError } = await supabase
      .from("users")
      .select("id, password_hash, force_password_change")
      .eq("id", player.id)
      .single();

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    // Simple password check (in production, use bcrypt)
    if (authUser.password_hash !== password) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Log login
    await supabase.from("audit_logs").insert([
      {
        academy_id: process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID,
        entity_type: "PLAYER_LOGIN",
        entity_id: player.id,
        action: "LOGIN",
        user_id: player.id,
        timestamp: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({
      player_id: player.id,
      full_name: player.full_name,
      phone: player.phone,
      status: player.status,
      force_password_change: authUser.force_password_change || false,
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
