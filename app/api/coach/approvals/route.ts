import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const coachId = req.nextUrl.searchParams.get("coach_id");

    if (!coachId) {
      return NextResponse.json(
        { error: "coach_id required" },
        { status: 400 }
      );
    }

    // Get all pending payment declarations for this coach
    const { data: pending, error } = await supabase
      .from("payment_declarations")
      .select(
        `
        id,
        declared_amount,
        payment_method,
        payment_date,
        reference,
        payer_confirmation,
        accounts_confirmation,
        created_at,
        players (id, full_name, phone),
        fee_obligations (id, billing_period, amount)
      `
      )
      .eq("collector_id", coachId)
      .eq("payer_confirmation", "CONFIRMED")
      .is("accounts_confirmation", null)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      pending_approvals: pending || [],
    });
  } catch (err) {
    console.error("Error fetching coach approvals:", err);
    return NextResponse.json(
      { error: "Failed to fetch approvals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payment_declaration_id, action, coach_id, rejection_reason } = body;

    if (!payment_declaration_id || !action || !coach_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the payment declaration
    const { data: declaration, error: declError } = await supabase
      .from("payment_declarations")
      .select("*")
      .eq("id", payment_declaration_id)
      .single();

    if (declError || !declaration) {
      return NextResponse.json(
        { error: "Payment declaration not found" },
        { status: 404 }
      );
    }

    if (action === "APPROVE") {
      // Update payment declaration
      await supabase
        .from("payment_declarations")
        .update({
          accounts_confirmation: "CONFIRMED",
          accounts_confirmation_timestamp: new Date().toISOString(),
        })
        .eq("id", payment_declaration_id);

      // Auto-reconcile if amounts match
      const { data: obligation } = await supabase
        .from("fee_obligations")
        .select("amount")
        .eq("id", declaration.fee_obligation_id)
        .single();

      if (
        obligation &&
        declaration.declared_amount === obligation.amount
      ) {
        // Create reconciliation
        await supabase.from("reconciliations").insert([
          {
            fee_obligation_id: declaration.fee_obligation_id,
            payment_declaration_id,
            reconciled_amount: declaration.declared_amount,
            reconciled_at: new Date().toISOString(),
            reconciled_by: coach_id,
          },
        ]);

        // Update fee obligation to RECONCILED
        await supabase
          .from("fee_obligations")
          .update({ status: "RECONCILED" })
          .eq("id", declaration.fee_obligation_id);
      } else {
        // Mark as mismatch
        await supabase
          .from("fee_obligations")
          .update({ status: "MISMATCH" })
          .eq("id", declaration.fee_obligation_id);
      }

      // Create audit log
      await supabase.from("audit_logs").insert([
        {
          academy_id: process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID,
          entity_type: "PAYMENT_DECLARATION",
          entity_id: payment_declaration_id,
          action: "APPROVED_BY_COACH",
          new_value: JSON.stringify({
            accounts_confirmation: "CONFIRMED",
          }),
          user_id: coach_id,
          timestamp: new Date().toISOString(),
        },
      ]);

      return NextResponse.json({
        message: "Payment approved and reconciled",
      });
    } else if (action === "REJECT") {
      // Update payment declaration
      await supabase
        .from("payment_declarations")
        .update({
          accounts_confirmation: "REJECTED",
          rejection_reason: rejection_reason || null,
          accounts_confirmation_timestamp: new Date().toISOString(),
        })
        .eq("id", payment_declaration_id);

      // Reset fee obligation to DUE
      await supabase
        .from("fee_obligations")
        .update({ status: "DUE" })
        .eq("id", declaration.fee_obligation_id);

      // Create audit log
      await supabase.from("audit_logs").insert([
        {
          academy_id: process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID,
          entity_type: "PAYMENT_DECLARATION",
          entity_id: payment_declaration_id,
          action: "REJECTED_BY_COACH",
          new_value: JSON.stringify({
            accounts_confirmation: "REJECTED",
            reason: rejection_reason,
          }),
          user_id: coach_id,
          timestamp: new Date().toISOString(),
        },
      ]);

      return NextResponse.json({
        message: "Payment rejected",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Coach approval error:", err);
    return NextResponse.json(
      { error: "Action failed" },
      { status: 500 }
    );
  }
}
