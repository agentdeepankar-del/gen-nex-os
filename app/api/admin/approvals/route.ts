export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const academyId = searchParams.get("academy_id");

    const pendingApprovals = [
      {
        id: "player-2",
        full_name: "Amit Kumar",
        email: "amit@demo.local",
        phone: "9876543211",
        status: "pending_approval",
      },
      {
        id: "player-4",
        full_name: "Neha Gupta",
        email: "neha@demo.local",
        phone: "9876543213",
        status: "pending_payment",
      },
    ];

    const pendingPayments = [
      {
        id: "fee-1",
        player_name: "Vijay Singh",
        amount: 2000,
        status: "payment_declared",
      },
    ];

    return Response.json({
      pending_approvals: pendingApprovals,
      pending_payments: pendingPayments,
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { player_id, status } = await request.json();

    return Response.json({
      success: true,
      player_id,
      status,
      message: `Player ${status} successfully`,
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
