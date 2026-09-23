import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    // Get all payment declarations grouped by collector
    const { data: declarations, error } = await supabase
      .from("payment_declarations")
      .select(
        `
        id,
        collector_id,
        declared_amount,
        accounts_confirmation,
        created_at,
        users (id, name, role, phone)
      `
      )
      .eq("payer_confirmation", "CONFIRMED")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Aggregate by collector
    const collectorStats: any = {};

    declarations?.forEach((decl) => {
      const collectorId = decl.collector_id;
      if (!collectorStats[collectorId]) {
        collectorStats[collectorId] = {
          id: collectorId,
          name: decl.users?.name || "Unknown",
          role: decl.users?.role || "UNKNOWN",
          phone: decl.users?.phone || "",
          total_collected: 0,
          pending_approval: 0,
          approved: 0,
          rejected: 0,
        };
      }

      collectorStats[collectorId].total_collected += decl.declared_amount || 0;

      if (decl.accounts_confirmation === null) {
        collectorStats[collectorId].pending_approval += decl.declared_amount || 0;
      } else if (decl.accounts_confirmation === "CONFIRMED") {
        collectorStats[collectorId].approved += decl.declared_amount || 0;
      } else if (decl.accounts_confirmation === "REJECTED") {
        collectorStats[collectorId].rejected += decl.declared_amount || 0;
      }
    });

    const stats = Object.values(collectorStats);

    return NextResponse.json({
      collectors: stats,
      total_declarations: declarations?.length || 0,
      total_amount: stats.reduce((sum: number, c: any) => sum + c.total_collected, 0),
    });
  } catch (err) {
    console.error("Error fetching collections:", err);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
