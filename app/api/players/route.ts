export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const academyId = searchParams.get("academy_id");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const batchId = searchParams.get("batch_id") || "";

    // Demo data
    const demoPlayers = [
      {
        id: "player-1",
        full_name: "Rahul Sharma",
        player_code: "GNX-CRK-000001",
        phone: "9876543210",
        status: "active",
        cricket_category: "U-15",
        batch_name: "U-15 Evening A",
      },
      {
        id: "player-2",
        full_name: "Amit Kumar",
        player_code: "GNX-CRK-000002",
        phone: "9876543211",
        status: "pending_approval",
        cricket_category: "U-17",
        batch_name: "U-17 Morning",
      },
      {
        id: "player-3",
        full_name: "Vijay Singh",
        player_code: "GNX-CRK-000003",
        phone: "9876543212",
        status: "active",
        cricket_category: "U-19",
        batch_name: "U-19 Evening",
      },
      {
        id: "player-4",
        full_name: "Neha Gupta",
        player_code: "GNX-CRK-000004",
        phone: "9876543213",
        status: "pending_payment",
        cricket_category: "U-15",
        batch_name: "U-15 Morning",
      },
      {
        id: "player-5",
        full_name: "Arjun Patel",
        player_code: "GNX-CRK-000005",
        phone: "9876543214",
        status: "active",
        cricket_category: "Adult",
        batch_name: "Adult Evening",
      },
    ];

    let filtered = demoPlayers;

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.full_name.toLowerCase().includes(search.toLowerCase()) ||
          p.player_code.includes(search) ||
          p.phone.includes(search)
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((p) => p.status === status);
    }

    return Response.json({ players: filtered });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
