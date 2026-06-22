import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("purchase_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const productId = body.product_id?.toString();
  const productName = body.product_name?.toString().trim();
  const customerName = body.customer_name?.toString().trim();
  const contactInfo = body.contact_info?.toString().trim();

  if (!productId || !productName || !customerName || !contactInfo) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("purchase_requests")
    .insert({
      product_id: productId,
      product_name: productName,
      customer_name: customerName,
      contact_info: contactInfo,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
