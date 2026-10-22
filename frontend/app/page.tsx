
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    fetch(
  `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/health`
)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend unavailable");
        }
        return response.json();
      })
      .then((data) => {
        setBackendStatus(data.status === "healthy" ? "Connected" : "Unhealthy");
      })
      .catch(() => {
        setBackendStatus("Disconnected");
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-8 text-white">
      <h1 className="text-center text-4xl font-bold">
        AI DevOps Kubernetes Agent
      </h1>

      <p className="mt-4 max-w-xl text-center text-slate-300">
        An AI-powered assistant to investigate Kubernetes issues,
        understand errors, and help troubleshoot infrastructure.
      </p>

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6 text-center">
        <h2 className="text-xl font-semibold">System Status</h2>
        <p className="mt-3 text-slate-300">
          Frontend: <span className="text-green-400">Running</span>
        </p>
        <p className="mt-2 text-slate-300">
          Backend:{" "}
          <span
            className={
              backendStatus === "Connected"
                ? "text-green-400"
                : "text-yellow-400"
            }
          >
            {backendStatus}
          </span>
        </p>
      </div>
    </main>
  );
}
