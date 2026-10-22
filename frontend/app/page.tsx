
"use client";

import { useEffect, useState } from "react";

type InvestigationResult = {
  pod_name: string;
  status: string;
  issues: string[];
  recommendations: string[];
  ai_analysis: string;
};

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [podName, setPodName] = useState("checkout-api");
  const [podStatus, setPodStatus] = useState("CrashLoopBackOff");
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((response) => {
        if (!response.ok) throw new Error("Backend unavailable");
        return response.json();
      })
      .then((data) => {
        setBackendStatus(
          data.status === "healthy" ? "Connected" : "Unhealthy"
        );
      })
      .catch(() => setBackendStatus("Disconnected"));
  }, []);

  async function handleInvestigate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: podName, status: podStatus }),
      });

      if (!response.ok) {
        throw new Error("Investigation request failed");
      }

      const data: InvestigationResult = await response.json();
      setResult(data);
    } catch {
      setError(
        "Could not investigate the Pod. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-4xl font-bold">
          AI DevOps Kubernetes Agent
        </h1>

        <p className="mt-4 text-center text-slate-300">
          Investigate Kubernetes Pod issues and receive AI-powered
          troubleshooting guidance.
        </p>

        <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-5">
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
        </section>

        <section className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">Pod Investigation</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter sample Pod information to test the investigation engine.
          </p>

          <form onSubmit={handleInvestigate} className="mt-5 space-y-4">
            <div>
              <label htmlFor="podName" className="mb-2 block text-sm">
                Pod name
              </label>
              <input
                id="podName"
                value={podName}
                onChange={(event) => setPodName(event.target.value)}
                required
                className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
              />
            </div>

            <div>
              <label htmlFor="podStatus" className="mb-2 block text-sm">
                Pod status
              </label>
              <select
                id="podStatus"
                value={podStatus}
                onChange={(event) => setPodStatus(event.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white"
              >
                <option value="CrashLoopBackOff">CrashLoopBackOff</option>
                <option value="ImagePullBackOff">ImagePullBackOff</option>
                <option value="Pending">Pending</option>
                <option value="Running">Running</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 p-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Investigating with AI..." : "Investigate Pod"}
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-lg bg-red-950 p-3 text-red-300">
              {error}
            </p>
          )}

          {result && (
            <div className="mt-6 space-y-5 rounded-lg border border-slate-700 p-4">
              <h3 className="text-xl font-semibold">Investigation Result</h3>

              <div className="rounded-lg bg-slate-800 p-3">
                <p><strong>Pod:</strong> {result.pod_name}</p>
                <p className="mt-2">
                  <strong>Status:</strong> {result.status}
                </p>
              </div>

              <div>
                <h4 className="font-semibold">Detected Issues</h4>
                {result.issues.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                    {result.issues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-slate-300">
                    No issues identified by the current rules.
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-semibold">Rule-Based Recommendations</h4>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-blue-500/40 bg-blue-950/40 p-4">
                <h4 className="text-lg font-semibold text-blue-300">
                  AI Analysis
                </h4>
                <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-200">
                  {result.ai_analysis || "No AI analysis was returned."}
                </p>
              </div>
            </div>
          )}
        </section>

        <p className="mt-5 text-center text-xs text-slate-500">
          Current prototype uses sample Pod data, rule-based investigation,
          and Groq AI analysis. It is not yet connected to a live Kubernetes
          cluster.
        </p>
      </div>
    </main>
  );
}
