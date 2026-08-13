"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    alert("Đã nhận thông tin đăng nhập");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          Đăng nhập
        </h1>

        <p className="mb-6 text-center text-zinc-400">
          PlayTogether Shop
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none"
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none"
            required
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-green-600 py-3 font-bold text-white"
          >
            Đăng nhập
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-green-400">
            Đăng ký
          </a>
        </p>
      </div>
    </main>
  );
}
