export async function POST(request: Request) {
  try {
    const { fee_obligation_id, amount, payment_method, reference_id, notes } = await request.json();

    return Response.json({
      success: true,
      payment_declaration_id: "pd-" + Date.now(),
      fee_obligation_id,
      amount,
      payment_method,
      reference_id,
      status: "payment_declared",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
