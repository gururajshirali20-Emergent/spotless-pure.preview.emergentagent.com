import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Inbox, Mail, Package, Trash2, Check, RefreshCw, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, formatApiErrorDetail } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import emblem from "@/assets/emblem.png";

const TYPE_LABEL = { general: "General", bulk: "Bulk", distributor: "Distributor" };

function StatCard({ Icon, label, value }) {
  return (
    <div data-testid={`stat-${label.toLowerCase().replace(/\s/g, "-")}`} className="rounded-xl border bg-card p-5 flex items-center gap-4">
      <div className="h-11 w-11 rounded-lg bg-forest/10 text-forest grid place-items-center">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-navy leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, bulk: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [e, s] = await Promise.all([api.get("/enquiries"), api.get("/enquiries/stats")]);
      setRows(e.data);
      setStats(s.data);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id) => {
    try {
      await api.patch(`/enquiries/${id}`);
      load();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/enquiries/${id}`);
      toast.success("Enquiry deleted");
      load();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const doLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-navy text-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={emblem} alt="Elvora-X" className="h-9 w-9 object-contain bg-white/95 rounded-full p-0.5" />
            <div>
              <p className="font-serif text-xl leading-none">ELVORA-X</p>
              <p className="text-[0.55rem] tracking-[0.3em] text-gold">ADMIN</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-white/60">{user?.email}</span>
            <button data-testid="admin-logout" onClick={doLogout} className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-gold transition-colors">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy font-serif">Enquiries</h1>
            <p className="text-sm text-muted-foreground">Customer & distributor enquiries.</p>
          </div>
          <button data-testid="admin-refresh" onClick={load} className="inline-flex items-center gap-2 text-sm border rounded-full px-4 py-2 bg-white hover:bg-muted transition-colors">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <StatCard Icon={Inbox} label="Total Enquiries" value={stats.total} />
          <StatCard Icon={Mail} label="New" value={stats.new} />
          <StatCard Icon={Package} label="Bulk / Distributor" value={stats.bulk} />
        </div>

        <div className="rounded-xl border bg-card overflow-hidden">
          <Table data-testid="enquiries-table">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden lg:table-cell">Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                    No enquiries yet.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((r) => (
                <TableRow key={r.id} data-testid={`enquiry-row-${r.id}`} className={r.status === "new" ? "bg-gold/5" : ""}>
                  <TableCell className="font-medium text-navy">
                    {r.name}
                    <div className="md:hidden text-xs text-muted-foreground">{r.email}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    <div>{r.email}</div>
                    <div className="text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{r.phone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.enquiry_type === "general" ? "secondary" : "default"} className={r.enquiry_type !== "general" ? "bg-forest" : ""}>
                      {TYPE_LABEL[r.enquiry_type] || r.enquiry_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell max-w-xs truncate text-sm text-muted-foreground">{r.message}</TableCell>
                  <TableCell>
                    {r.status === "new" ? (
                      <Badge className="bg-gold text-navy hover:bg-gold">New</Badge>
                    ) : (
                      <Badge variant="outline">Read</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {r.status === "new" && (
                        <button data-testid={`mark-read-${r.id}`} onClick={() => markRead(r.id)} title="Mark read" className="h-8 w-8 grid place-items-center rounded-md hover:bg-muted text-forest transition-colors">
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button data-testid={`delete-${r.id}`} onClick={() => remove(r.id)} title="Delete" className="h-8 w-8 grid place-items-center rounded-md hover:bg-destructive/10 text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
