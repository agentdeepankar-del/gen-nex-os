export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const academyId = searchParams.get("academy_id");

    const metrics = {
      active_players: 327,
      expected_revenue: 654000,
      reconciled_revenue: 582000,
      outstanding: 42000,
      mismatches: 30000,
      today_attendance: 214,
      total_sessions_today: 237,
      pending_approvals: 7,
      pending_payments: 5,
    };

    return Response.json({ metrics });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
