"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const services = [
  {
    name: "Cày tiền sao",
    description: "Cày tiền sao Play Together nhanh chóng",
    price: 10000,
    icon: "⭐",
  },
  {
    name: "Dắt thẻ",
    description: "Hỗ trợ dắt thẻ theo yêu cầu của bạn",
    price: 10000,
    icon: "🎴",
  },
  {
    name: "Làm cần quái vật",
    description: "Nhận làm cần quái vật chuyên nghiệp",
    price: 10000,
    icon: "🐉",
  },
  {
    name: "Kim Cương Xanh",
    description: "Nhận kiếm Kim Cương Xanh nhanh gọn",
    price: 10000,
    icon: "💎",
  },
  {
    name: "Kim Cương Đỏ",
    description: "Nhận kiếm Kim Cương Đỏ hiệu quả",
    price: 10000,
    icon: "❤️",
  },
  {
    name: "Câu bóng 6",
    description: "Dịch vụ câu bóng 6 chuyên nghiệp",
    price: 10000,
    icon: "🎯",
  },
  {
    name: "Câu bóng 7",
    description: "Dịch vụ câu bóng 7 tối ưu nhất",
    price: 10000,
    icon: "🎪",
  },
  {
    name: "Cho thuê map trống",
    description: "Cho thuê map trống giá rẻ nhất",
    price: 10000,
    icon: "🗺️",
  },
];

type Profile = {
  username: string;
  display_name: string | null;
  balance: number;
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, balance")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(data);
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    setProfile(null);
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* HEADER */}
      <nav className="sticky top-0 z-50 border-b border-yellow-500/20 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600">
              <span className="text-lg font-black text-slate-950">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-black text-white">
                SHOP
              </span>
              <span className="text-xs font-bold text-yellow-400">
                DUCDUY
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden sm:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition"
            >
              Trang chủ
            </Link>
            <a
              href="#services"
              className="text-sm font-semibold text-slate-300 hover:text-yellow-400 transition"
            >
              Dịch vụ
            </a>
            <Link
              href="/account"
              className="text-sm font-semibold text-slate-300 hover:text-yellow-400 transition"
            >
              Tài khoản
            </Link>
            <Link
              href="/deposit"
              className="text-sm font-semibold text-slate-300 hover:text-yellow-400 transition"
            >
              Nạp tiền
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {loading ? (
              <span className="text-xs sm:text-sm text-slate-500">...</span>
            ) : profile ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-900 hover:from-yellow-400 hover:to-yellow-500 transition"
                >
                  👤 {profile.display_name || profile.username}
                </Link>
                <button
                  onClick={logout}
                  className="rounded-lg bg-slate-800 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg bg-slate-800 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-slate-900 hover:from-yellow-400 hover:to-yellow-500 transition"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="sm:hidden border-t border-yellow-500/20 bg-slate-900/50 px-4 py-3 flex gap-3">
          <a
            href="#services"
            className="flex-1 text-center text-xs font-semibold text-slate-300 py-2 rounded-md hover:bg-slate-800 transition"
          >
            Dịch vụ
          </a>
          <Link
            href="/account"
            className="flex-1 text-center text-xs font-semibold text-slate-300 py-2 rounded-md hover:bg-slate-800 transition"
          >
            Tài khoản
          </Link>
          <Link
            href="/deposit"
            className="flex-1 text-center text-xs font-semibold text-slate-300 py-2 rounded-md hover:bg-slate-800 transition"
          >
            Nạp tiền
          </Link>
        </div>
      </nav>

      {/* BANNER */}
      <section className="relative overflow-hidden px-4 py-12 sm:py-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-400/50">
              <span className="text-xs sm:text-sm font-bold text-yellow-300">
                🎮 PLAY TOGETHER - SHOP CHUYÊN NGHIỆP
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              SHOP DUCDUY
            </h1>

            <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
              🚀 Dịch vụ chuyên nghiệp Play Together - Nạp tiền mau chóng, an toàn, giá tốt nhất
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="#services"
                className="inline-block px-6 sm:px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-bold hover:from-yellow-400 hover:to-yellow-500 transition transform hover:scale-105"
              >
                Khám phá dịch vụ
              </a>
              <a
                href="https://zalo.me/your-zalo-number"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 sm:px-8 py-3 rounded-lg border-2 border-yellow-500 text-yellow-400 font-bold hover:bg-yellow-500/10 transition"
              >
                Liên hệ Zalo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="px-4 py-12 sm:py-20 bg-slate-950/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 text-white">
              Dịch vụ của chúng tôi
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              8 dịch vụ Play Together hàng đầu - chất lượng cao, giá cạnh tranh
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative rounded-xl border border-yellow-500/20 bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-5 sm:p-6 hover:border-yellow-400 hover:bg-gradient-to-br hover:from-slate-900/70 hover:to-slate-800/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20"
              >
                {/* Icon */}
                <div className="mb-4 text-3xl sm:text-4xl">{service.icon}</div>

                {/* Service Name */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4 h-10 line-clamp-2">
                  {service.description}
                </p>

                {/* Price */}
                <div className="mb-4 pb-4 border-b border-yellow-500/10">
                  <p className="text-xs text-slate-500">Giá khởi điểm</p>
                  <p className="text-2xl sm:text-3xl font-black text-yellow-400">
                    {service.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>

                {/* Button */}
                <Link
                  href="/order"
                  className="w-full block text-center py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-bold hover:from-yellow-400 hover:to-yellow-500 transition transform hover:scale-105 text-sm sm:text-base"
                >
                  Đặt ngay
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="px-4 py-12 sm:py-20 bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left Side - Features */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-black mb-6 text-white">
                Về SHOP DUCDUY
              </h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-yellow-500/20 border border-yellow-400/50">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Nạp tiền nhanh chóng
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Hoàn tất giao dịch trong vài phút, không chậm trễ
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-yellow-500/20 border border-yellow-400/50">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      An toàn & bảo mật
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Hệ thống bảo vệ tài khoản hàng đầu, không lo mất số dư
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-yellow-500/20 border border-yellow-400/50">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Giá cạnh tranh</h4>
                    <p className="text-slate-400 text-sm">
                      Giá tốt nhất thị trường, không tính phí ẩn
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-yellow-500/20 border border-yellow-400/50">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Hỗ trợ 24/7
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Đội ngũ hỗ trợ sẵn sàng giúp bạn bất kỳ lúc nào
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-center hover:border-yellow-400 transition">
                <p className="text-3xl sm:text-5xl font-black text-yellow-400 mb-2">
                  5K+
                </p>
                <p className="text-slate-400 text-sm">Khách hàng hài lòng</p>
              </div>

              <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-center hover:border-yellow-400 transition">
                <p className="text-3xl sm:text-5xl font-black text-yellow-400 mb-2">
                  99.9%
                </p>
                <p className="text-slate-400 text-sm">Độ tin cậy</p>
              </div>

              <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-center hover:border-yellow-400 transition">
                <p className="text-3xl sm:text-5xl font-black text-yellow-400 mb-2">
                  24/7
                </p>
                <p className="text-slate-400 text-sm">Hỗ trợ online</p>
              </div>

              <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-center hover:border-yellow-400 transition">
                <p className="text-3xl sm:text-5xl font-black text-yellow-400 mb-2">
                  0₫
                </p>
                <p className="text-slate-400 text-sm">Phí ẩn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="px-4 py-12 sm:py-20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6 text-white">
            Cần hỗ trợ?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg mb-8 sm:mb-10">
            Hãy liên hệ với chúng tôi qua Zalo. Đội ngũ hỗ trợ sẽ giúp bạn ngay lập tức!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <a
              href="https://zalo.me/your-zalo-number"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-bold hover:from-yellow-400 hover:to-yellow-500 transition transform hover:scale-105"
            >
              💬 Liên hệ Zalo
            </a>
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-yellow-500 text-yellow-400 font-bold hover:bg-yellow-500/10 transition"
            >
              🛒 Đặt dịch vụ ngay
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-yellow-500/20 bg-slate-950/80 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600">
                  <span className="text-lg font-black text-slate-950">S</span>
                </div>
                <div>
                  <p className="font-black text-white">SHOP DUCDUY</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Dịch vụ Play Together số 1 Việt Nam
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-3">Dịch vụ</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#services" className="hover:text-yellow-400 transition">
                    Tất cả dịch vụ
                  </a>
                </li>
                <li>
                  <Link href="/order" className="hover:text-yellow-400 transition">
                    Đặt dịch vụ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-bold text-white mb-3">Tài khoản</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/login" className="hover:text-yellow-400 transition">
                    Đăng nhập
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-yellow-400 transition">
                    Đăng ký
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-bold text-white mb-3">Liên hệ</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a
                    href="https://zalo.me/your-zalo-number"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-400 transition"
                  >
                    💬 Zalo
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-yellow-500/10 pt-8 text-center text-sm text-slate-500">
            <p>
              © 2024 SHOP DUCDUY. Tất cả quyền được bảo lưu. | Chuyên cung cấp dịch vụ
              Play Together uy tín
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}