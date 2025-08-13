import { Link } from 'react-router-dom';

export default function JBotFerrariDashboardPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-ferrari-red/30 flex items-center gap-6 hover:border-ferrari-red/50 transition-all duration-300 mb-8">
          <div className="relative w-28 h-28 rounded-lg overflow-hidden border-2 border-ferrari-red/50 bg-white">
            <img
              src="/images/assistants/JbotAI.jpg"
              alt="JBot AI"
              className="rounded-lg object-cover object-center scale-[1.35]"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-white mb-2">JBot Ferrari <span className="text-[#FF2800]">Dashboard</span></h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#FF2800]/20 text-[#FF2800] text-sm rounded-full">Elite Driver</span>
              <span className="px-3 py-1 bg-[#FFB800]/20 text-[#FFB800] text-sm rounded-full">VIP Status</span>
              <Link
                to="/"
                className="px-4 py-1.5 bg-green-500/20 text-green-400 text-sm rounded-full hover:bg-green-500/30 transition-colors flex items-center gap-2 border border-green-500/30"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

