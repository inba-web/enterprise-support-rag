import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card, { CardContent } from "../components/ui/Card";
import { ArrowLeft, KeyRound, Mail, ShieldAlert, Cpu } from "lucide-react";

export default function Auth({ onLoginSuccess, onBackToLanding }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ email, name: email.split("@")[0] });
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* LEFT SIDE - Authentic Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-12 lg:px-20 z-10 bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-900/60 relative">
        
        {/* Back navigation button */}
        <button 
          onClick={onBackToLanding}
          className="absolute top-6 left-6 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 font-semibold cursor-pointer outline-none select-none transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing
        </button>

        <div className="w-full max-w-sm flex flex-col gap-6">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-650 flex items-center justify-center font-bold text-white text-base shadow-sm">
              K
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                KnowledgeHub AI Console
              </h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider">
                Enterprise Knowledge Intelligence
              </p>
            </div>
          </div>

          {/* Login Form Card */}
          <Card className="border border-slate-200 dark:border-slate-850">
            <CardContent className="flex flex-col gap-4 p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 tracking-wider uppercase px-0.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      error={errors.email}
                      disabled={isLoading}
                      className="pl-8"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center px-0.5">
                    <label className="text-[10px] font-bold text-slate-555 dark:text-slate-400 tracking-wider uppercase">
                      Password
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => e.preventDefault()}
                      className="text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-semibold"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      error={errors.password}
                      disabled={isLoading}
                      className="pl-8"
                    />
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center justify-between px-0.5 text-xs select-none">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-655 dark:text-slate-400">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 dark:border-slate-800 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                    />
                    Remember my workspace
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading}
                  className="w-full mt-2 h-9 text-xs font-bold"
                >
                  {isLoading ? "Verifying Workspace..." : "Sign In to Console"}
                </Button>

              </form>

              {/* Social Login Placeholders */}
              <div className="flex flex-col gap-2.5 mt-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] bg-slate-200 dark:bg-slate-900 flex-1"></div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">or sign in with SSO</span>
                  <div className="h-[1px] bg-slate-200 dark:bg-slate-900 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={(e) => e.preventDefault()}
                    className="flex justify-center items-center gap-2 py-2 border border-slate-200 dark:border-slate-850 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    Google
                  </button>
                  <button 
                    type="button" 
                    onClick={(e) => e.preventDefault()}
                    className="flex justify-center items-center gap-2 py-2 border border-slate-200 dark:border-slate-850 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    Azure ID
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Access Banner */}
          <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-xl p-3.5">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal flex items-start gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>Console Access</strong>: Enter any valid email and a 6+ character password to explore the workspace console.</span>
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE - Large AI Vector Graphic */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-tr from-slate-900 to-indigo-950 flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        
        {/* Abstract vector backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        
        <div className="max-w-md w-full flex flex-col gap-6 text-center z-10 select-none">
          
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-650 flex items-center justify-center font-bold text-white text-3xl shadow-lg border border-white/10">
              K
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-2">Neural Ingestion Pipeline</h2>
            <p className="text-xs text-slate-350 leading-relaxed max-w-sm mx-auto">
              KnowledgeHub AI builds real-time contextual indexes for generative models, transforming manuals into custom fact-grounded knowledge streams.
            </p>
          </div>

          {/* Animated Brain/Vector Network Illustration */}
          <div className="flex justify-center relative w-full h-64 mt-4">
            <svg className="w-64 h-64 text-indigo-500/30" viewBox="0 0 200 200" fill="none">
              <g className="stroke-indigo-500/40" strokeWidth="1">
                <line x1="100" y1="40" x2="60" y2="90" />
                <line x1="100" y1="40" x2="140" y2="90" />
                <line x1="60" y1="90" x2="80" y2="150" />
                <line x1="140" y1="90" x2="120" y2="150" />
                <line x1="80" y1="150" x2="120" y2="150" />
                <line x1="60" y1="90" x2="140" y2="90" />
                <line x1="100" y1="40" x2="100" y2="120" />
                <line x1="100" y1="120" x2="80" y2="150" />
                <line x1="100" y1="120" x2="120" y2="150" />
              </g>
              <circle cx="100" cy="40" r="5" className="fill-blue-500 animate-pulse" />
              <circle cx="60" cy="90" r="5" className="fill-indigo-550" />
              <circle cx="140" cy="90" r="5" className="fill-cyan-500" />
              <circle cx="100" cy="120" r="4" className="fill-violet-500 animate-ping" />
              <circle cx="80" cy="150" r="5" className="fill-emerald-500" />
              <circle cx="120" cy="150" r="5" className="fill-blue-600" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Cpu className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
