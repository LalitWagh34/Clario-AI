import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";

const supabase = createClient();

export default function Auth() {
  async function login(provider: "github" | "google") {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
    });
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      {/* Animated background gradient */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 gradient-animation opacity-30"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Backdrop blur effect */}
      <div className="absolute inset-0 z-0 backdrop-blur-3xl opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md">
          {/* Animated card */}
          <div className="glass rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 sm:space-y-8 fade-in">
            {/* Header */}
            <div className="text-center space-y-4">
              {/* Logo/Brand */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">✨</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Clario
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                AI-Powered Research Assistant
              </p>
              <p className="text-slate-400 text-xs">
                Get instant answers powered by web search and advanced AI
              </p>
            </div>

            {/* Auth buttons */}
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => login("google")}
                className="w-full group relative px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-3 font-medium text-sm sm:text-base"
              >
                <span className="text-lg">🔍</span>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => login("github")}
                className="w-full group relative px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-3 font-medium text-sm sm:text-base"
              >
                <span className="text-lg">🐙</span>
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-slate-950/80 text-slate-500">
                  Secure OAuth Login
                </span>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-xs text-slate-400 text-center">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-6 sm:mt-8 flex justify-center gap-4 sm:gap-6 text-slate-400 text-xs">
            <span>🔒 Secure</span>
            <span>⚡ Fast</span>
            <span>🎯 Accurate</span>
          </div>
        </div>
      </div>

      {/* Animated elements */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}