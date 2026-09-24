export async function POST(request: Request) {
  try {
    const { email, phone, password } = await request.json();

    // Owner login (email-based)
    if (email === "owner@demo.local" && password === "demo123456") {
      return Response.json({
        token: "demo-owner-token",
        role: "owner",
        user_id: "demo-owner-1",
        academy_id: "demo-academy-1",
      });
    }

    // Coach login (phone-based)
    if (phone === "9001001001" && password === "temppin123") {
      return Response.json({
        token: "demo-coach-token",
        role: "coach",
        user_id: "demo-coach-1",
        academy_id: "demo-academy-1",
      });
    }

    // Player login (phone-based)
    if (phone === "9009000100" && password === "player123") {
      return Response.json({
        token: "demo-player-token",
        role: "player",
        user_id: "demo-player-1",
        academy_id: "demo-academy-1",
      });
    }

    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
