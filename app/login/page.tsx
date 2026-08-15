"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function makeAuthEmail(username: string) {
  return `${username.trim().toLowerCase()}@ptshop.local`;
}

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const authEmail = makeAuthEmail(username);

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

    if (loginError) {
      setError("Tên đăng nhập hoặc mật khẩu không chính xác.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 shadow-xl">
        <h1 className="mb-2 text-3xl font-bold text-white">
          Đăng nhập
        </h1>

        <p className="mb-6 text-zinc-400">
          PlayTogether Shop
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-300">
              Tên đăng nhập
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="gaugaming"
              required
              autoComplete="username"
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300">
              Mật khẩu
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-500 disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-green-400 hover:underline"
          >
            Đăng ký
          </Link>
        </p>
      </div>
    </main>
  );
}