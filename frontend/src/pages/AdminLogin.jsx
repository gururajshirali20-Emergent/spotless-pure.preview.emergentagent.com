import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import emblem from "@/assets/emblem.png";

export default function AdminLogin() {
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) navigate("/admin", { replace: true });
  }, [ready, user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) {
      toast.success("Welcome back");
      navigate("/admin", { replace: true });
    } else {
      toast.error(res.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen navy-bg flex items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.12),transparent_55%)]" />
      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={emblem} alt="Elvora-X" className="h-14 w-14 object-contain bg-white/95 rounded-full p-1 mb-4" />
          <p className="font-serif text-3xl text-white">ELVORA-X</p>
          <p className="text-[0.6rem] tracking-[0.35em] text-gold">ADMIN CONSOLE</p>
        </div>

        <form
          data-testid="login-form"
          onSubmit={submit}
          className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8"
        >
          <h1 className="font-serif text-2xl text-white mb-1 flex items-center gap-2">
            <Lock className="h-5 w-5 text-gold" /> Sign in
          </h1>
          <p className="text-white/50 text-sm mb-6">Manage customer enquiries.</p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white/70 text-xs uppercase tracking-wider">Email</Label>
              <Input id="email" data-testid="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-gold" placeholder="admin@elvora-x.com" />
            </div>
            <div>
              <Label htmlFor="password" className="text-white/70 text-xs uppercase tracking-wider">Password</Label>
              <Input id="password" data-testid="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 bg-white/5 border-white/15 text-white placeholder:text-white/30 focus-visible:ring-gold" placeholder="••••••••" />
            </div>
            <button
              type="submit"
              data-testid="login-submit"
              disabled={loading}
              className="btn-sweep w-full inline-flex items-center justify-center gap-2 bg-gold text-navy py-3 rounded-full font-semibold tracking-wide disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>
        <button onClick={() => navigate("/")} className="mt-6 mx-auto block text-white/50 hover:text-white text-sm transition-colors">
          ← Back to website
        </button>
      </div>
    </div>
  );
}
