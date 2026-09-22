import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("🌱 Seeding GEN NEX OS demo data...");

  try {
    // Create Academy
    const { data: academy } = await supabase
      .from("academy")
      .insert({
        name: "ABC Cricket Academy",
        contact_email: "owner@demo.local",
        contact_phone: "9876543210",
      })
      .select()
      .single();

    if (!academy) throw new Error("Failed to create academy");
    console.log("✓ Academy created");

    // Create Branch
    const { data: branch } = await supabase
      .from("branch")
      .insert({
        academy_id: academy.id,
        name: "Bangalore",
        address: "Electronic City, Bangalore",
        status: "active",
      })
      .select()
      .single();

    if (!branch) throw new Error("Failed to create branch");
    console.log("✓ Branch created");

    // Create Owner User
    const { data: ownerUser } = await supabase
      .from("user")
      .insert({
        academy_id: academy.id,
        branch_id: branch.id,
        email: "owner@demo.local",
        name: "Academy Owner",
        role: "owner",
      })
      .select()
      .single();

    console.log("✓ Owner user created");

    // Create Batches
    const batchNames = [
      { name: "U-15 Morning", ageGroup: "U-15", level: "Intermediate" },
      { name: "U-15 Evening", ageGroup: "U-15", level: "Intermediate" },
      { name: "U-17 Morning", ageGroup: "U-17", level: "Advanced" },
      { name: "U-19 Evening", ageGroup: "U-19", level: "Advanced" },
      { name: "Adult Evening", ageGroup: "Adult", level: "Pro" },
    ];

    const batches = [];
    for (const batchName of batchNames) {
      const { data: batch } = await supabase
        .from("batch")
        .insert({
          academy_id: academy.id,
          branch_id: branch.id,
          name: batchName.name,
          age_group: batchName.ageGroup,
          level: batchName.level,
          days: "Mon, Wed, Fri",
          time_start: "05:00 PM",
          time_end: "06:30 PM",
          capacity: 25,
          monthly_fee: 2000,
          start_date: "2026-01-01",
          status: "active",
        })
        .select()
        .single();

      if (batch) batches.push(batch);
    }
    console.log(`✓ ${batches.length} batches created`);

    // Create Coaches
    const coachNames = [
      "Ramesh",
      "Vikram",
      "Pradeep",
      "Anand",
      "Suresh",
      "Harish",
      "Deepak",
      "Ajay",
      "Rahul",
      "Sandeep",
    ];

    const coaches = [];
    for (let i = 0; i < coachNames.length; i++) {
      const code = `COACH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { data: coachUser } = await supabase
        .from("user")
        .insert({
          academy_id: academy.id,
          branch_id: branch.id,
          email: `coach${i + 1}@demo.local`,
          name: coachNames[i],
          role: "coach",
        })
        .select()
        .single();

      if (coachUser) {
        const { data: coach } = await supabase
          .from("coach")
          .insert({
            academy_id: academy.id,
            branch_id: branch.id,
            user_id: coachUser.id,
            name: coachNames[i],
            phone: `987654${String(3210 + i).padStart(4, "0")}`,
            code,
            status: "active",
          })
          .select()
          .single();

        if (coach) coaches.push(coach);
      }
    }
    console.log(`✓ ${coaches.length} coaches created`);

    // Create Players
    const statuses = ["active", "pending_approval", "pending_payment", "registered", "rejected"];
    const categories = ["U-15", "U-17", "U-19", "Adult"];

    const players = [];
    for (let i = 1; i <= 100; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const batch = batches[Math.floor(Math.random() * batches.length)];

      const { data: player } = await supabase
        .from("player")
        .insert({
          academy_id: academy.id,
          branch_id: branch.id,
          player_code: `GNX-CRK-${String(i).padStart(6, "0")}`,
          full_name: `Player ${i}`,
          date_of_birth: `2008-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
          gender: i % 2 === 0 ? "M" : "F",
          phone: `987654${String(3210 + i).padStart(4, "0")}`,
          email: `player${i}@demo.local`,
          cricket_category: category,
          batting_style: i % 2 === 0 ? "Right-handed" : "Left-handed",
          bowling_style: i % 3 === 0 ? "Right-arm fast" : "Right-arm spin",
          joining_date: "2026-01-12",
          batch_id: batch.id,
          status,
        })
        .select()
        .single();

      if (player) players.push(player);
    }
    console.log(`✓ ${players.length} players created`);

    // Create Fee Obligations
    const months = ["September 2026", "October 2026", "November 2026"];
    let feeCount = 0;

    for (const player of players) {
      if (player.status === "active" || player.status === "registered") {
        for (const month of months) {
          await supabase.from("fee_obligation").insert({
            player_id: player.id,
            batch_id: player.batch_id,
            amount: 2000,
            billing_period: month,
            due_date: new Date(month).toISOString().split("T")[0],
            status: ["reconciled", "payment_declared", "mismatch", "overdue"][
              Math.floor(Math.random() * 4)
            ],
          });
          feeCount++;
        }
      }
    }
    console.log(`✓ ${feeCount} fee obligations created`);

    console.log("\n✅ Seed completed successfully!");
    console.log("\nDemo Credentials:");
    console.log("- Owner: owner@demo.local / demo123456");
    console.log("- Coaches: Any coach name + generated code from database");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
