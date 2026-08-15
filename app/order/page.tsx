"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function OrderContent() {
  const searchParams = useSearchParams();
  const serviceName = searchParams.get("service") || "Dịch vụ";
  const [formData, setFormData] = useState({
    gameName: "",
    serverName: "",
    phoneNumber: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameName: formData.gameName,
          serverName: formData.serverName,
          phoneNumber: formData.phoneNumber,
          notes: formData.notes,
          serviceName: serviceName,
          quantity: 1,
          totalPrice: 0, // To be updated with real pricing
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể tạo đơn hàng");
      }

      setMessage({
        type: "success",
        text: `✅ ${data.message} Mã đơn: #${data.orderId}`,
      });
      setOrderId(data.orderId);
      setFormData({ gameName: "", serverName: "", phoneNumber: "", notes: "" });

      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Lỗi không xác định. Vui lòng thử lại.",
      });
      console.error("Order submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="text-green-400 mb-6 inline-block hover:underline">
        ← Quay lại
      </Link>

      <div className="rounded-2xl bg-zinc-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">
          Đặt dịch vụ
        </h1>
        <p className="text-zinc-400 mb-6">
          Dịch vụ: <span className="text-green-400 font-bold">{serviceName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div
              className={`rounded-xl p-4 text-sm font-semibold ${
                message.type === "success"
                  ? "bg-green-900/50 text-green-300 border border-green-700"
                  : "bg-red-900/50 text-red-300 border border-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-white font-semibold mb-2">Tên nhân vật</label>
            <input
              type="text"
              name="gameName"
              value={formData.gameName}
              onChange={handleChange}
              placeholder="Nhập tên nhân vật..."
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none placeholder-zinc-500 disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Máy chủ</label>
            <input
              type="text"
              name="serverName"
              value={formData.serverName}
              onChange={handleChange}
              placeholder="Nhập tên máy chủ..."
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none placeholder-zinc-500 disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Số điện thoại</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none placeholder-zinc-500 disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Ghi chú thêm</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Yêu cầu thêm..."
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none placeholder-zinc-500 resize-none h-24 disabled:opacity-50"
              disabled={loading}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 transition disabled:bg-green-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Đang xử lý...
              </>
            ) : (
              "Gửi đơn đặt"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Hoặc liên hệ Zalo: <a href="https://zalo.me/0849414809" className="text-green-400 hover:underline">0849414809</a>
        </p>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-8">
      <Suspense fallback={<div className="text-white">Đang tải...</div>}>
        <OrderContent />
      </Suspense>
    </main>
  );
}
