export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playerId = params.id;

    // Demo player 360 data
    const demoPlayer = {
      id: playerId,
      full_name: "Rahul Sharma",
      player_code: "GNX-CRK-000001",
      date_of_birth: "2010-05-15",
      gender: "M",
      phone: "9876543210",
      email: "rahul@demo.local",
      cricket_category: "U-15",
      batting_style: "Right-handed",
      bowling_style: "Right-arm fast",
      joining_date: "2026-01-12",
      status: "active",
      batch_id: "batch-1",
      batch_name: "U-15 Evening A",
      attendance_percentage: 91,
      total_sessions: 22,
      attended_sessions: 20,
      monthly_fee: 2000,
      current_fee_status: "reconciled",
      goals_count: 3,
      drills_assigned: 12,
      drills_completed: 8,
      videos_submitted: 4,
    };

    return Response.json({ player: demoPlayer });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
