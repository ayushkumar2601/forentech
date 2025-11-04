// "use client";

// import { useSearchParams } from "next/navigation";
// import { useBlockchain } from "@/context/blockchain-context";
// import { useState, useEffect } from "react";

// export default function VerifyPage() {
//   const searchParams = useSearchParams();
//   const hash = searchParams.get("hash");
//   const { verifyHash } = useBlockchain();
//   const [status, setStatus] = useState<null | "loading" | "verified" | "not-found" | "compromised">(null);

//   useEffect(() => {
//     async function check() {
//       if (!hash) return;
//       setStatus("loading");
//       const result = await verifyHash(hash);
//       setStatus(result.matchStatus);
//     }
//     check();
//   }, [hash]);

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center text-white">
//       <h1 className="text-2xl font-bold mb-6">🔍 Verification Result</h1>

//       {status === "loading" && <p className="text-gray-300">Checking blockchain...</p>}
//       {status === "verified" && <p className="text-green-400 text-xl">✅ Verified — No Tampering Detected</p>}
//       {status === "compromised" && <p className="text-red-400 text-xl">❌ Tampered / Altered</p>}
//       {status === "not-found" && <p className="text-yellow-400 text-xl">⚠ Not Found on Blockchain</p>}

//       {!hash && <p className="text-gray-400 mt-4">No hash provided.</p>}
//     </div>
//   );
// }


"use client";

import { useSearchParams } from "next/navigation";
import { useBlockchain } from "@/context/blockchain-context";
import { useState, useEffect } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const hash = searchParams.get("hash");
  const { verifyHash } = useBlockchain();
  const [status, setStatus] = useState<"loading" | "verified" | "not-found" | "compromised" | null>(null);
  const [blockchainHash, setBlockchainHash] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      if (!hash) return;
      setStatus("loading");
      const result = await verifyHash(hash);
      setStatus(result.matchStatus);
      setBlockchainHash(result.blockchainHash ?? null);
    }
    check();
  }, [hash]);

  function StatusBadge() {
    if (status === "loading")
      return <span className="text-blue-400 animate-pulse">Checking...</span>;

    if (status === "verified")
      return <span className="text-green-400 font-semibold">✅ Verified — Authentic</span>;

    if (status === "compromised")
      return <span className="text-red-400 font-semibold">❌ Tampered / Altered</span>;

    if (status === "not-found")
      return <span className="text-yellow-300 font-semibold">⚠ Not Found on Blockchain</span>;

    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-black text-white">
      <div className="w-full max-w-lg bg-[#111] border border-gray-700 rounded-2xl p-6 shadow-xl">

        <h1 className="text-center text-2xl font-bold mb-4">🔍 Document Verification</h1>

        <div className="mt-3 text-center text-lg">
          <StatusBadge />
        </div>

        {/* Hash Section */}
        <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400">Submitted SHA-256 Hash:</p>
          <div className="flex justify-between items-center gap-2 mt-1">
            <span className="text-xs break-all text-gray-200">{hash || "No hash provided"}</span>
            {hash && (
              <button
                className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                onClick={() => navigator.clipboard.writeText(hash)}
              >
                Copy
              </button>
            )}
          </div>
        </div>

        {/* Blockchain Hash Section */}
        {blockchainHash && (
          <div className="mt-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">Blockchain Stored Hash:</p>
            <p className="text-xs break-all text-gray-200 mt-1">{blockchainHash}</p>
          </div>
        )}

        {/* CTA (Optional) */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-sm px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
          >
            Return to Dashboard
          </a>
        </div>

      </div>
    </div>
  );
}
