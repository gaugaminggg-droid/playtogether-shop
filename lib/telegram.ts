/**
 * Telegram Notification Service
 * Only runs on server side - never exposed to browser
 */

export interface TelegramNotificationData {
  orderId: number;
  customerName: string;
  phoneNumber: string;
  serviceName: string;
  gameCharacter: string;
  serverName: string;
  quantity: number;
  totalPrice: number;
  notes?: string;
  timestamp: string;
}

export async function sendTelegramNotification(data: TelegramNotificationData): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Validate environment variables
  if (!botToken || !chatId) {
    console.error("[Telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return false;
  }

  try {
    const message = formatTelegramMessage(data);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Telegram] Failed to send message:", error);
      return false;
    }

    console.log("[Telegram] Notification sent successfully for order:", data.orderId);
    return true;
  } catch (error) {
    console.error("[Telegram] Error sending notification:", error);
    return false;
  }
}

function formatTelegramMessage(data: TelegramNotificationData): string {
  const divider = "━━━━━━━━━━━━━━━━━━━━";

  return `
<b>🎮 ĐƠN HÀNG MỚI - PT SHOP 🎮</b>

${divider}
<b>📋 Thông tin đơn hàng:</b>
🔑 Mã đơn: <code>#${data.orderId}</code>
⏰ Thời gian: ${data.timestamp}
📊 Trạng thái: <b>Chờ xử lý</b>

${divider}
<b>👤 Thông tin khách:</b>
📝 Tên: ${escapeHtml(data.customerName)}
📱 SĐT: <code>${escapeHtml(data.phoneNumber)}</code>

${divider}
<b>🎯 Chi tiết dịch vụ:</b>
🏷️ Dịch vụ: ${escapeHtml(data.serviceName)}
🎪 Nhân vật: ${escapeHtml(data.gameCharacter)}
🖥️ Máy chủ: ${escapeHtml(data.serverName)}
📦 Số lượng: ${data.quantity}
💰 Tổng tiền: <b>${formatPrice(data.totalPrice)}</b>

${data.notes ? `<b>📄 Ghi chú:</b>\n${escapeHtml(data.notes)}\n\n` : ""}
${divider}
<i>Hệ thống tự động - PlayTogether Shop</i>
  `.trim();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
