import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { createSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const name = formData.get("name")?.toString().trim();
  const priceRaw = formData.get("price")?.toString();
  const description = formData.get("description")?.toString().trim() ?? "";
  const image = formData.get("image");

  if (!name || !priceRaw || !(image instanceof File) || image.size === 0) {
    return NextResponse.json(
      { error: "Name, price, and image are required" },
      { status: 400 }
    );
  }

  const price = parseFloat(priceRaw);
  if (Number.isNaN(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await image.arrayBuffer());
    const uploaded = await uploadImage(buffer, image.name);

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        price,
        description,
        image_url: uploaded.secure_url,
      })
      .select()
      .single();

    if (error) {
      await deleteImage(uploaded.public_id);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/");

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
