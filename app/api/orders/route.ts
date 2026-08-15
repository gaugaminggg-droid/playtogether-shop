import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTelegramNotification } from "@/lib/telegram";

// Initialize Supabase client only when needed (at request time)
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase configuration");
  }

  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      gameName,
      serverName,
      phoneNumber,
      notes,
      serviceName,
      quantity = 1,
      totalPrice = 0,
    } = body;

    // Validate required fields
    if (!gameName || !serverName || !phoneNumber || !serviceName) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin bắt buộc" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[API] Missing Supabase configuration");
      return NextResponse.json(
        { error: "Lỗi cấu hình máy chủ" },
        { status: 500 }
      );
    }

    // Get Supabase client at request time
    const supabase = getSupabaseClient();

    // Insert order into Supabase (without requiring user_id for public orders)
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert([
        {
          character_name: gameName,
          game_id: serverName,
          contact: phoneNumber,
          note: notes || "",
          quantity: quantity,
          unit_price: Math.round(totalPrice / quantity) || 0,
          total: totalPrice,
          status: "pending",
          service_id: null, // Will be linked via service name lookup later if needed
          user_id: null, // Public order without authentication
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("[API] Database error:", dbError);
      return NextResponse.json(
        { error: "Không thể tạo đơn hàng. Vui lòng thử lại sau." },
        { status: 500 }
      );
    }

    if (!order) {
      console.error("[API] Order was not created");
      return NextResponse.json(
        { error: "Không thể tạo đơn hàng" },
        { status: 500 }
      );
    }

    // Send Telegram notification (fire and forget - don't block the response)
    const timestamp = new Date().toLocaleString("vi-VN");
    const telegramData = {
      orderId: order.id,
      customerName: gameName,
      phoneNumber: phoneNumber,
      serviceName: serviceName,
      gameCharacter: gameName,
      serverName: serverName,
      quantity: quantity,
      totalPrice: totalPrice,
      notes: notes,
      timestamp: timestamp,
    };

    // Send async without waiting
    sendTelegramNotification(telegramData).catch((error) => {
      console.error("[API] Failed to send Telegram notification:", error);
      // Don't fail the request - order is already created
    });

    console.log("[API] Order created successfully:", {
      orderId: order.id,
      customer: phoneNumber,
      service: serviceName,
      total: totalPrice,
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        message: "Đơn hàng đã được tạo thành công!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Unexpected error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: "OK" }, { status: 200 });
}
