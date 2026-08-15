"use client";

export const dynamic = "force-dynamic";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function makeAuthEmail(username: string) {
  return `${username.toLowerCase()}@ptshop.local`;
}

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    setError("");

    const cleanUsername = username.trim().toLowerCase();

    if (!/^[a-z0-9_]{4,20}$/.test(cleanUsername)) {
      setError(
        "Tên đăng nhập phải từ 4-20 ký tự, chỉ gồm chữ thường, số và dấu _"
      );
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không giống nhau.");
      return;
    }

    setLoading(true);

    const authEmail = makeAuthEmail(cleanUsername);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: authEmail,
      password,
      options: {
        data: {
          username: cleanUsername,
          display_name: displayName.trim() || cleanUsername,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError("Không thể tạo tài khoản.");
      setLoading(false);
      return;
    }

    /*
      Trigger handle_new_user() trong supabase.sql
      sẽ tự tạo profile:
      username = phần trước @
      display_name = phần trước @
    */

    if (!data.session) {
      setError(
        "Đăng ký thành công nhưng Supabase đang yêu cầu xác nhận email. Hãy tắt Confirm email trong Supabase Auth."
      );
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
          Đăng ký
        </h1>

        <p className="mb-6 text-zinc-400">
          Tạo tài khoản PlayTogether Shop
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
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
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none ring-green-500 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300">
              Tên hiển thị
            </label>

            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Gau Gaming"
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none ring-green-500 focus:ring-2"
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
              autoComplete="new-password"
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none ring-green-500 focus:ring-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-300">
              Nhập lại mật khẩu
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none ring-green-500 focus:ring-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-500 disabled:opacity-50"
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-green-400 hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}