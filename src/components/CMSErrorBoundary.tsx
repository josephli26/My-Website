import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw, Trash2 } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CMSErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Admin CMS:", error, errorInfo);
  }

  private handleResetCache = () => {
    try {
      localStorage.removeItem("cms_portfolio_data");
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin + window.location.pathname + "?reset=true#admin";
  };

  private handleClearAll = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin + window.location.pathname + "?clear=" + Date.now() + "#admin";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#0a0a0a] z-9999 flex flex-col items-center justify-center p-6 text-white font-grotesk">
          <div className="w-full max-w-lg bg-neutral-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl flex flex-col gap-6 text-left">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <AlertCircle size={22} />
              </div>
              <div>
                <h2 className="font-bebas text-2xl tracking-widest text-white">CMS UI RUNTIME RECOVERY</h2>
                <p className="text-[10px] uppercase font-mono text-red-400">Cache schema mismatch detected</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed dir-rtl text-right">
              حدث تعارض في الذاكرة المؤقتة (LocalStorage/Cache) للمتصفح بسبب تغيير هيكل البيانات. يمكنك إصلاح هذا بضغطة زر واحدة لإعادة تحميل بيانات <code className="text-brand-green font-mono">defaultData.ts</code> الجديدة من GitHub:
            </p>

            {this.state.error && (
              <div className="p-3 bg-black/60 border border-white/10 rounded-lg text-[10px] font-mono text-neutral-400 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={this.handleResetCache}
                className="w-full py-3.5 px-4 bg-[#8cff2e] hover:bg-[#8cff2e]/90 text-[#131313] font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
              >
                <RotateCcw size={16} />
                إعادة ضبط الذاكرة وتحميل defaultData.ts الجديدة
              </button>

              <button
                onClick={this.handleClearAll}
                className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Trash2 size={14} />
                مسح التخزين المؤقت بالكامل (Clear LocalStorage)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
