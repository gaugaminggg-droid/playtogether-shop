"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    alert("Đăng ký thành công! Vui lòng đăng nhập.");
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          Đăng ký
        </h1>

        <p className="mb-6 text-center text-zinc-400">
          PlayTogether Shop
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Tên người dùng"
            value={formData.username}
            onChange={handleChange}
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none placeholder-zinc-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none placeholder-zinc-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none placeholder-zinc-500"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-white outline-none placeholder-zinc-500"
            required
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-green-600 py-3 font-bold text-white hover:bg-green-700 transition"
          >
            Đăng ký
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-green-400 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}
