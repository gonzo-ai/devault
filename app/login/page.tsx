"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Wrong email or password");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-bg, #f9f6f0)",
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
        padding: "48px",
        background: "var(--color-surface, #ffffff)",
        border: "1px solid var(--color-border, #e8e3da)",
        borderRadius: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: "320px",
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          background: "#1c1a17",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f9f6f0",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 5V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 5V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 5V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>

        <h1 style={{
          fontSize: "24px",
          fontWeight: 700,
          fontStyle: "italic",
          color: "var(--color-text, #1c1a17)",
          letterSpacing: "-0.02em",
          margin: 0,
        }}>devault</h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoFocus
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid var(--color-border, #e8e3da)",
              borderRadius: "6px",
              fontSize: "14px",
              background: "var(--color-bg, #f9f6f0)",
              color: "var(--color-text, #1c1a17)",
              boxSizing: "border-box",
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1px solid var(--color-border, #e8e3da)",
              borderRadius: "6px",
              fontSize: "14px",
              background: "var(--color-bg, #f9f6f0)",
              color: "var(--color-text, #1c1a17)",
              boxSizing: "border-box",
            }}
          />
          {error && (
            <p style={{ fontSize: "13px", color: "#dc2626", textAlign: "center", margin: 0 }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px",
              background: loading ? "#9ca3af" : "#1c1a17",
              color: "#f9f6f0",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              border: "none",
            }}
          >
            {loading ? "..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
