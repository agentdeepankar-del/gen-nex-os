import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = params.id;

    // Get player
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    // Get outstanding fees (status = DUE or PAYMENT_DECLARED)
    const { data: fees } = await supabase
      .from("fee_obligations")
      .select("*")
      .eq("player_id", playerId)
      .in("status", ["DUE", "PAYMENT_DECLARED"])
      .order("created_at", { ascending: false });

    return NextResponse.json({
      player,
      fees: fees || [],
    });
  } catch (err) {
    console.error("Error fetching player:", err);
    return NextResponse.json(
      { error: "Failed to fetch player" },
      { status: 500 }
    );
  }
}
