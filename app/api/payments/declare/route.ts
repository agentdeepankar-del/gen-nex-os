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
      player_id,
      collector_id,
      fee_obligation_id,
      amount,
      payment_method,
      payment_date,
      reference,
      notes,
    } = body;

    if (!player_id || !collector_id || !fee_obligation_id || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create payment declaration
    const { data: declaration, error: declError } = await supabase
      .from("payment_declarations")
      .insert([
        {
          fee_obligation_id,
          player_id,
          collector_id,
          declared_amount: amount,
          payment_method,
          payment_date,
          reference: reference || null,
          notes: notes || null,
          declared_by: player_id,
          payer_confirmation: "CONFIRMED",
          payer_confirmation_timestamp: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (declError) throw declError;

    // Update fee obligation status to PAYMENT_DECLARED
    await supabase
      .from("fee_obligations")
      .update({ status: "PAYMENT_DECLARED" })
      .eq("id", fee_obligation_id);

    // Create audit log
    await supabase.from("audit_logs").insert([
      {
        academy_id: process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID,
        entity_type: "PAYMENT_DECLARATION",
        entity_id: declaration.id,
        action: "CREATED",
        new_value: JSON.stringify({
          amount,
          collector_id,
          payment_method,
        }),
        user_id: player_id,
        timestamp: new Date().toISOString(),
      },
    ]);

    return NextResponse.json({
      declaration_id: declaration.id,
      message: "Payment declared successfully. Awaiting coach approval.",
    });
  } catch (err) {
    console.error("Payment declaration error:", err);
    return NextResponse.json(
      { error: "Payment declaration failed" },
      { status: 500 }
    );
  }
}
