export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Demo credentials
    if (email === "owner@demo.local" && password === "demo123456") {
      return Response.json({
        token: "demo-owner-token",
        role: "owner",
        user_id: "demo-owner-1",
        academy_id: "demo-academy-1",
      });
    }

    if (email === "coach@demo.local" && password === "demo123456") {
      return Response.json({
        token: "demo-coach-token",
        role: "coach",
        user_id: "demo-coach-1",
        academy_id: "demo-academy-1",
      });
    }

    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
