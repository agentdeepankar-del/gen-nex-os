import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      full_name,
      date_of_birth,
      gender,
      phone,
      email,
      parent_name,
      parent_phone,
      address,
      cricket_category,
      batting_style,
      bowling_style,
      batch_id,
    } = body;

    if (!full_name || !phone || !batch_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("player")
      .select("id")
      .eq("phone", phone)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Phone number already registered" },
        { status: 409 }
      );
    }

    const playerCode = `GNX-CRK-` + String(Date.now()).slice(-6);

    const { data: player, error } = await supabase
      .from("player")
      .insert([
        {
          academy_id: process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID,
          branch_id: process.env.NEXT_PUBLIC_DEMO_BRANCH_ID,
          player_code: playerCode,
          full_name,
          date_of_birth,
          gender,
          phone,
          email: email || null,
          parent_name: parent_name || null,
          parent_phone: parent_phone || null,
          address: address || null,
          cricket_category,
          batting_style,
          bowling_style,
          batch_id,
          status: "PENDING_PAYMENT",
          joining_date: new Date().toISOString().split("T")[0],
        },
      ])
      .select("id")
      .single();

    if (error) throw error;

    await supabase.from("fee_obligation").insert([
      {
        id: crypto.randomUUID(),
        player_id: player.id,
        batch_id,
        billing_period: "JOINING",
        amount: 5000,
        due_date: new Date().toISOString().split("T")[0],
        status: "DUE",
        created_at: new Date().toISOString(),
      },
    ]);

    const now = new Date();
    const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    await supabase.from("fee_obligation").insert([
      {
        id: crypto.randomUUID(),
        player_id: player.id,
        batch_id,
        billing_period: now.toISOString().split("T")[0],
        amount: 2000,
        due_date: dueDate.toISOString().split("T")[0],
        status: "DUE",
        created_at: new Date().toISOString(),
      },
    ]);

    await supabase.from("audit_log").insert([
      {
        academy_id: process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID,
        entity_type: "PLAYER",
        entity_id: player.id,
        action: "CREATED",
        new_value: JSON.stringify({ player_code: playerCode, status: "PENDING_PAYMENT" }),
        user_id: null,
        timestamp: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({
      player_id: player.id,
      player_code: playerCode,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
