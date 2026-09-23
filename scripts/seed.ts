import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log("🌱 Seeding GEN NEX OS database...");

  const academyId = process.env.NEXT_PUBLIC_DEMO_ACADEMY_ID || "demo-academy-1";
  const branchId = process.env.NEXT_PUBLIC_DEMO_BRANCH_ID || "demo-branch-1";

  try {
    // 1. Create coaches and support staff
    console.log("Creating coaches and support staff...");
    const coaches = [
      { name: "Ramesh Kumar", phone: "9001001001", role: "COACH" },
      { name: "Priya Singh", phone: "9001001002", role: "COACH" },
      { name: "Amit Verma", phone: "9001001003", role: "COACH" },
      { name: "Vikram Patel", phone: "9001001004", role: "SUPPORT_STAFF" },
      { name: "Neha Gupta", phone: "9001001005", role: "SUPPORT_STAFF" },
      { name: "Rajesh Rao", phone: "9001001006", role: "SUPPORT_STAFF" },
    ];

    const coachIds: string[] = [];
    for (const coach of coaches) {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            academy_id: academyId,
            branch_id: branchId,
            name: coach.name,
            phone: coach.phone,
            role: coach.role,
            status: "ACTIVE",
            password_hash: "temppin123",
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error(`Error creating coach ${coach.name}:`, error);
      } else if (data) {
        coachIds.push(data.id);
      }
    }

    console.log(`✓ Created ${coachIds.length} coaches/staff`);

    // 2. Create batches
    console.log("Creating batches...");
    const batches = [
      {
        name: "U-15 Morning",
        coach_id: coachIds[0],
        schedule: "Mon,Wed,Fri",
        fee: 2000,
      },
      {
        name: "U-15 Evening",
        coach_id: coachIds[1],
        schedule: "Tue,Thu,Sat",
        fee: 2000,
      },
      {
        name: "U-17 Morning",
        coach_id: coachIds[2],
        schedule: "Mon,Wed,Fri",
        fee: 2500,
      },
      {
        name: "U-19 Evening",
        coach_id: coachIds[0],
        schedule: "Tue,Thu,Sat",
        fee: 3000,
      },
      {
        name: "Adult Evening",
        coach_id: coachIds[1],
        schedule: "Mon,Tue,Thu",
        fee: 2000,
      },
    ];

    const batchIds: string[] = [];
    for (const batch of batches) {
      const { data, error } = await supabase
        .from("batches")
        .insert([
          {
            academy_id: academyId,
            branch_id: branchId,
            name: batch.name,
            coach_id: batch.coach_id,
            schedule: batch.schedule,
            monthly_fee: batch.fee,
            capacity: 20,
            status: "ACTIVE",
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error(`Error creating batch ${batch.name}:`, error);
      } else if (data) {
        batchIds.push(data.id);
      }
    }

    console.log(`✓ Created ${batchIds.length} batches`);

    // 3. Create sample players with auth
    console.log("Creating sample players...");
    const playerNames = [
      "Rahul Sharma",
      "Amit Kumar",
      "Vikram Singh",
      "Neha Gupta",
      "Ankit Verma",
      "Priya Patel",
      "Rohit Reddy",
      "Sneha Iyer",
      "Harsh Mishra",
      "Divya Nair",
    ];

    const playerIds: string[] = [];
    for (let i = 0; i < playerNames.length; i++) {
      const name = playerNames[i];
      const phone = `9009000${1000 + i}`;
      const batchId = batchIds[i % batchIds.length];
      const playerCode = `GNX-CRK-${String(i + 100)}`;

      const { data: player, error: playerError } = await supabase
        .from("players")
        .insert([
          {
            academy_id: academyId,
            branch_id: branchId,
            player_code: playerCode,
            full_name: name,
            phone,
            email: `${name.toLowerCase().replace(" ", ".")}@demo.local`,
            gender: i % 2 === 0 ? "M" : "F",
            date_of_birth: "2010-05-15",
            cricket_category: "U-15",
            batting_style: "Right-handed",
            bowling_style: "Right-arm fast",
            batch_id: batchId,
            status: "REGISTERED",
            joining_date: new Date().toISOString().split("T")[0],
          },
        ])
        .select("id")
        .single();

      if (playerError) {
        console.error(`Error creating player ${name}:`, playerError);
      } else if (player) {
        playerIds.push(player.id);

        // Create player auth user
        await supabase.from("users").insert([
          {
            id: player.id,
            academy_id: academyId,
            branch_id: branchId,
            name,
            phone,
            role: "PLAYER",
            status: "ACTIVE",
            password_hash: "player123",
            force_password_change: false,
          },
        ]);

        // Create joining fee
        await supabase.from("fee_obligations").insert([
          {
            player_id: player.id,
            batch_id: batchId,
            billing_period: "JOINING",
            amount: 5000,
            due_date: new Date().toISOString().split("T")[0],
            status: "RECONCILED",
            created_at: new Date().toISOString(),
          },
        ]);

        // Create current month fee
        const now = new Date();
        const dueDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate()
        );
        await supabase.from("fee_obligations").insert([
          {
            player_id: player.id,
            batch_id: batchId,
            billing_period: now.toISOString().split("T")[0],
            amount: 2000,
            due_date: dueDate.toISOString().split("T")[0],
            status: i % 3 === 0 ? "RECONCILED" : "DUE",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    }

    console.log(`✓ Created ${playerIds.length} players with auth`);

    // 4. Create sample payment declarations and approvals
    console.log("Creating sample payment declarations...");
    let declarationCount = 0;

    for (let i = 0; i < Math.min(5, playerIds.length); i++) {
      const { data: fees } = await supabase
        .from("fee_obligations")
        .select("id, amount")
        .eq("player_id", playerIds[i])
        .eq("status", "DUE")
        .limit(1);

      if (fees && fees.length > 0) {
        const { data: decl } = await supabase
          .from("payment_declarations")
          .insert([
            {
              fee_obligation_id: fees[0].id,
              player_id: playerIds[i],
              collector_id: coachIds[i % coachIds.length],
              declared_amount: fees[0].amount,
              payment_method: i % 2 === 0 ? "CASH" : "UPI",
              payment_date: new Date().toISOString().split("T")[0],
              reference: i % 2 === 0 ? null : `UPI${String(i).padStart(6, "0")}`,
              payer_confirmation: "CONFIRMED",
              payer_confirmation_timestamp: new Date().toISOString(),
              accounts_confirmation: i % 2 === 0 ? "CONFIRMED" : null,
              accounts_confirmation_timestamp:
                i % 2 === 0 ? new Date().toISOString() : null,
              created_at: new Date().toISOString(),
            },
          ])
          .select("id")
          .single();

        if (decl) {
          declarationCount++;

          // Auto-reconcile if approved
          if (i % 2 === 0) {
            await supabase
              .from("fee_obligations")
              .update({ status: "RECONCILED" })
              .eq("id", fees[0].id);

            await supabase.from("reconciliations").insert([
              {
                fee_obligation_id: fees[0].id,
                payment_declaration_id: decl.id,
                reconciled_amount: fees[0].amount,
                reconciled_at: new Date().toISOString(),
                reconciled_by: coachIds[i % coachIds.length],
              },
            ]);
          }
        }
      }
    }

    console.log(`✓ Created ${declarationCount} payment declarations`);

    // 5. Create audit logs for registration
    console.log("Creating audit logs...");
    for (const playerId of playerIds.slice(0, 3)) {
      await supabase.from("audit_logs").insert([
        {
          academy_id: academyId,
          entity_type: "PLAYER",
          entity_id: playerId,
          action: "CREATED",
          new_value: JSON.stringify({ status: "REGISTERED" }),
          user_id: null,
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    console.log("✓ Created audit logs");

    console.log("\n✅ Seeding complete!");
    console.log(`\nDemo Login Credentials:`);
    console.log(`Owner: owner@demo.local / demo123456`);
    console.log(`Player: 9009000001 / player123`);
    console.log(`Coach: ${coaches[0].phone} / temppin123`);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
