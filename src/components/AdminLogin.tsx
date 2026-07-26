import { useState } from "react";
import { useCMS } from "../context/CMSContext";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function AdminLogin() {
  const { login } = useCMS();
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setIsLoading(true);
    setIsError(false);

    // Artificial tiny delay for premium feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    const success = await login(passcode);
    setIsLoading(false);
    
    if (!success) {
      setIsError(true);
      setPasscode("");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-9999 flex flex-col items-center justify-center p-6 text-white font-grotesk overflow-hidden selection:bg-brand-green selection:text-brand-black">
      {/* Ambient background glow grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#151515_1px,transparent_1px),linear-gradient(to_bottom,#151515_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Login container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[420px] bg-neutral-900/90 border border-white/10 rounded-2xl p-8 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      >
        {/* Glow corner line */}
        <div className="absolute -top-[1px] left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-brand-green/40 to-transparent" />

        {/* Head branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-white/5 flex items-center justify-center mb-4 text-brand-green shadow-inner">
            <ShieldCheck size={24} className="animate-pulse" />
          </div>
          <h1 className="font-bebas text-3xl tracking-widest text-white">
            PORTFOLIO CMS
          </h1>
          <p className="text-xs text-neutral-400 tracking-wider uppercase mt-1">
            Youssef Abaali • Secure Workspace
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase">
              Enter Admin Passcode
            </label>
            <div className={`relative flex items-center rounded-xl bg-neutral-950 border transition-all duration-300 ${
              isError
                ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-shake"
                : "border-white/10 focus-within:border-brand-green focus-within:shadow-[0_0_15px_rgba(140,255,46,0.1)]"
            }`}>
              <div className="pl-4 text-neutral-500">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (isError) setIsError(false);
                }}
                placeholder="••••••••"
                disabled={isLoading}
                autoFocus
                className="w-full bg-transparent px-3 py-3.5 text-sm font-mono tracking-widest text-white placeholder-neutral-700 focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-4 text-neutral-500 hover:text-brand-green transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {isError && (
              <motion.span
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] text-red-500 font-medium tracking-wide"
              >
                Passcode incorrect. Please try again.
              </motion.span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !passcode}
            className="w-full bg-brand-green text-brand-black font-semibold text-xs tracking-widest uppercase py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all duration-300 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                AUTHENTICATE
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] text-neutral-500 tracking-wide leading-relaxed">
            Hint: The default secure passcode is <code className="font-mono text-neutral-400 select-all font-bold px-1 py-0.5 rounded bg-neutral-950">admin</code>.<br />
            You can customize this in the settings panel.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
