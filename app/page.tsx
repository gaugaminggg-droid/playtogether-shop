"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const services = [
  ["Cày tiền sao", "Cày tiền sao Play Together", 10000],
  ["Đặt thẻ", "Hỗ trợ đặt thẻ theo yêu cầu", 10000],
  ["Làm cần quái vật", "Nhận làm cần quái vật", 10000],
  ["Kim Cương Xanh", "Nhận kiếm Kim Cương Xanh", 10000],
  ["Kim Cương Đỏ", "Nhận kiếm Kim Cương Đỏ", 10000],
  ["Câu bóng 6", "Nhận câu bóng 6", 10000],
  ["Câu bóng 7", "Nhận câu bóng 7", 10000],
  ["Cho thuê map trống", "Cho thuê map trống", 10000],
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
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800 bg-zinc-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold">
            PT<span className="text-green-500">SHOP</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-sm text-zinc-300 sm:block"
            >
              Trang chủ
            </Link>

            {loading ? (
              <span className="text-sm text-zinc-500">
                ...
              </span>
            ) : profile ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="rounded-xl bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
                >
                  👤 {profile.display_name || profile.username}
                </Link>

                <Link
                  href="/deposit"
                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold hover:bg-green-500"
                >
                  💰 {Number(profile.balance || 0).toLocaleString("vi-VN")}đ
                </Link>

                <button
                  onClick={logout}
                  className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                >
                  Thoát
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="rounded-xl bg-zinc-800 px-4 py-2 text-sm"
                >
                  Đăng nhập
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
              PLAY TOGETHER SERVICES
            </p>

            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              SHOP
              <span className="text-green-500">
                {" "}PLAY TOGETHER
              </span>
            </h1>

            <p className="mt-5 text-lg text-zinc-400">
              Cày thuê nhanh chóng • Uy tín • Giá hợp lý
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#services"
                className="rounded-xl bg-green-600 px-5 py-3 font-semibold hover:bg-green-500"
              >
                Đặt dịch vụ
              </a>

              {profile ? (
                <Link
                  href="/account"
                  className="rounded-xl border border-zinc-700 px-5 py-3"
                >
                  Tài khoản của tôi
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl border border-zinc-700 px-5 py-3"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="mb-5 text-5xl">🎮</div>

            <h2 className="text-2xl font-bold">
              ĐẶT ĐƠN NHANH
            </h2>

            <p className="mt-3 text-zinc-400">
              Chọn dịch vụ → gửi thông tin → theo dõi trạng thái đơn hàng.
            </p>

            {profile && (
              <div className="mt-6 rounded-2xl bg-zinc-800 p-4">
                <p className="text-sm text-zinc-400">
                  Xin chào
                </p>

                <p className="mt-1 text-xl font-bold">
                  {profile.display_name || profile.username}
                </p>

                <p className="mt-3 text-sm text-zinc-400">
                  Số dư
                </p>

                <p className="text-2xl font-bold text-green-400">
                  {Number(profile.balance || 0).toLocaleString("vi-VN")}đ
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="services"
        className="mx-auto max-w-6xl px-4 pb-20"
      >
        <div className="mb-8">
          <p className="text-sm font-semibold text-green-400">
            DỊCH VỤ
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Dịch vụ nổi bật
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(([name, description, price]) => (
            <article
              key={String(name)}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-1 hover:border-green-500/50"
            >
              <div className="mb-4 text-3xl">
                🎮
              </div>

              <h3 className="font-bold">
                {name}
              </h3>

              <p className="mt-2 min-h-12 text-sm text-zinc-400">
                {description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <strong className="text-green-400">
                  Từ {Number(price).toLocaleString("vi-VN")}đ
                </strong>

                <Link
                  href={`/order?service=${encodeURIComponent(
                    String(name)
                  )}`}
                  className="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold"
                >
                  Đặt
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-4 py-8 text-center text-sm text-zinc-500">
        © 2026 PlayTogether Shop
      </footer>
    </main>
  );
}