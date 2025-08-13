// pages/pledge.tsx
'use client';

import Link from 'next/link';

export default function PledgePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-ferrari-red bg-clip-text text-transparent">
          Become an AiiQ Pledge
        </h1>
        <p className="text-lg text-gray-400 mb-12 text-center">
          AiiQ is where Artificial Intelligence meets Personal Intelligence. This is your first step in aligning tech with your vision, your execution, and your path forward.
        </p>

        <div className="bg-[#1a1a1a] p-8 rounded-lg border border-white/10 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Why now?</h2>
          <p className="text-gray-400 mb-6">Begin your pledge by answering one simple question.</p>

          <form className="space-y-6">
            <div>
              <label className="block mb-2 text-left font-medium">Why are you joining AiiQ today?</label>
              <select className="w-full bg-[#0f0f0f] border border-white/10 px-4 py-3 rounded">
                <option value="">Select your reason</option>
                <option value="growth">I’m ready to grow with something different</option>
                <option value="clone">I want to develop my digital assistant</option>
                <option value="efficiency">I need a more efficient way to manage deals</option>
                <option value="community">I want to work with like-minded people</option>
                <option value="other">Other (I’ll explain later)</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-left font-medium">What does forward look like for you?</label>
              <textarea className="w-full bg-[#0f0f0f] border border-white/10 px-4 py-3 rounded" rows={4} />
            </div>

            <div className="pt-4">
              <Link
                href="/clone-request"
                className="inline-block w-full py-3 bg-ferrari-red text-white font-semibold text-center rounded hover:opacity-90 transition"
              >
                Continue to Create Your Clone
              </Link>
            </div>
          </form>
        </div>

        <p className="text-sm text-gray-500 mt-10">
          This is a closed ecosystem. All pledge requests are reviewed manually. Only the serious make it.
        </p>

        <div className="mt-8 text-xs text-gray-500 text-left">
          <p className="mb-2">
            <strong>Privacy Statement:</strong> Your data is used solely to personalize your AiiQ experience. It is not sold, shared, or used for marketing purposes. We do not store sensitive personal information beyond your own use within the AiiQ ecosystem.
          </p>
          <p className="mb-2">
            AiiQ Thinktank utilizes a coordinated internal platform which includes the utilization of external large language models (LLMs) to provide you with a personalized, detailed model.
          </p>
          <p className="mb-2">
            This model is intended strictly for your private use and is not to be cloned, sold, or redistributed without explicit written approval by AiiQ Group, LLC.
          </p>
        </div>
      </div>
    </main>
  );
}
