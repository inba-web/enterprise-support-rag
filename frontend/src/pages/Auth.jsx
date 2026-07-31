import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card, { CardContent } from "../components/ui/Card";

export default function Auth({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    // Simulate login loading delay
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({ email, name: email.split("@")[0] });
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors">
      <div className="w-full max-w-sm flex flex-col gap-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-50 flex items-center justify-center font-bold text-white dark:text-slate-900 text-lg shadow-sm">
            Ω
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
              Antigravity AI Console
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sign in to manage helpdesks and RAG knowledge bases
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="border border-slate-200 dark:border-slate-800">
          <CardContent className="flex flex-col gap-4 p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase px-0.5">
                  Email Address
                </label>
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
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center px-0.5">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  >
                    Forgot?
                  </a>
                </div>
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
                />
              </div>

              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="w-full mt-2 h-9 text-xs font-bold"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials Notice */}
        <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-lg p-3 text-center">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
            ℹ️ <strong>Demo Access</strong>: Enter any valid email and a 6+ character password to explore the workspace console.
          </p>
        </div>

      </div>
    </div>
  );
}
