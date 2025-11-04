"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const hash = searchParams.get("hash");

  const [status, setStatus] = useState<"loading" | "verified" | "compromised" | "not-found">("loading");

  useEffect(() => {
    async function checkHash() {
      if (!hash) {
        setStatus("not-found");
        return;
      }

      try {
        const res = await fetch(`/api/verify?hash=${hash}`);
        const data = await res.json();
        setStatus(data.status || "not-found");
      } catch {
        setStatus("not-found");
      }
    }

    checkHash();
  }, [hash]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-3">Verification Result</h1>

      {status === "loading" && <p className="text-gray-400">Checking authenticity...</p>}
      {status === "verified" && <p className="text-green-400 text-lg font-semibold">✅ Document is Authentic</p>}
      {status === "compromised" && <p className="text-red-400 text-lg font-semibold">❌ Document has been Tampered</p>}
      {status === "not-found" && <p className="text-yellow-400 text-lg font-semibold">⚠️ No record found on blockchain</p>}
    </div>
  );
}

export default function VerifyPageClient() {
  return (
    <Suspense fallback={<p className="text-center text-gray-400 mt-10">Loading verification...</p>}>
      <VerifyContent />
    </Suspense>
  );
}
