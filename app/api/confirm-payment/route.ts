export async function POST(request: Request) {
  try {
    const { fee_obligation_id, received_amount, reference_id } = await request.json();

    return Response.json({
      success: true,
      accounts_confirmation_id: "ac-" + Date.now(),
      fee_obligation_id,
      received_amount,
      reference_id,
      status: "reconciled",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
