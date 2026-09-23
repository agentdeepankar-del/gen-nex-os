import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const playerId = formData.get("player_id") as string;
    const drillAssignmentId = formData.get("drill_assignment_id") as string;

    if (!file || !playerId) {
      return NextResponse.json(
        { error: "Missing file or player_id" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const fileName = `${playerId}/${Date.now()}-${file.name}`;

    // Upload to Supabase storage
    const { data, error: uploadError } = await supabase.storage
      .from("player-media")
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    // Create media record
    const { data: media, error: mediaError } = await supabase
      .from("media")
      .insert([
        {
          player_id: playerId,
          drill_assignment_id: drillAssignmentId || null,
          type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
          media_url: data.path,
          storage_reference: data.path,
          file_size_bytes: file.size,
          processing_status: "READY",
          metadata: JSON.stringify({
            filename: file.name,
            mimetype: file.type,
          }),
        },
      ])
      .select()
      .single();

    if (mediaError) throw mediaError;

    // Update drill assignment to STARTED
    if (drillAssignmentId) {
      await supabase
        .from("player_drill_assignments")
        .update({ status: "STARTED" })
        .eq("id", drillAssignmentId);
    }

    return NextResponse.json({ media });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
