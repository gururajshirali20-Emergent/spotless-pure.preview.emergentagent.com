import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Loader2, Send, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api, formatApiErrorDetail } from "@/lib/api";
import { CONTACT } from "@/data/site";

const EMPTY = { name: "", email: "", phone: "", message: "", enquiry_type: "general", product: "" };

export default function Contact({ prefill }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Pre-fill when a visitor clicks "Enquire" on a product
  useEffect(() => {
    if (!prefill) return;
    setForm((f) => ({
      ...f,
      product: prefill,
      message: f.message?.trim()
        ? f.message
        : `Hi Elvora-X, I'd like to enquire about ${prefill}.`,
    }));
  }, [prefill]);

  const clearProduct = () => setForm((f) => ({ ...f, product: "" }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/enquiries", form);
      toast.success("Enquiry received", {
        description: "Thank you — our team will reach out to you shortly.",
      });
      setForm(EMPTY);
    } catch (err) {
      toast.error("Could not submit", {
        description: formatApiErrorDetail(err.response?.data?.detail) || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6 grid lg:grid-cols-2 gap-14">
        {/* Left: info + map */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-gold font-semibold mb-4">
            Contact Us
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-navy leading-[1.05] mb-8">
            Let's bring purity <span className="italic text-forest">to your space.</span>
          </h2>

          <div className="space-y-5 mb-8">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-gold mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-navy">{CONTACT.company}</p>
                <p className="text-navy/60 font-light">{CONTACT.address}</p>
              </div>
            </div>
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-4 text-navy hover:text-forest transition-colors">
              <Phone className="h-5 w-5 text-gold" /> {CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-4 text-navy hover:text-forest transition-colors">
              <Mail className="h-5 w-5 text-gold" /> {CONTACT.email}
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden border border-gold/30 h-64">
            <iframe
              title="Elvora-X location"
              data-testid="contact-map"
              className="w-full h-full grayscale-[0.2]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${CONTACT.mapQuery}&output=embed`}
            />
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.form
          data-testid="contact-form"
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-t-[2.5rem] rounded-br-[2.5rem] border border-gold/30 bg-marble p-8 md:p-10 shadow-[0_20px_60px_rgba(10,17,40,0.08)]"
        >
          <h3 className="font-serif text-3xl text-navy mb-6">Send an Enquiry</h3>

          {form.product && (
            <div
              data-testid="enquiry-product-tag"
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 pl-4 pr-2 py-1.5 text-sm text-navy"
            >
              <Tag className="h-3.5 w-3.5 text-forest" />
              <span className="font-semibold">{form.product}</span>
              <button
                type="button"
                data-testid="clear-product-tag"
                onClick={clearProduct}
                aria-label="Remove product"
                className="ml-1 grid h-6 w-6 place-items-center rounded-full text-navy/50 hover:bg-navy/10 hover:text-navy transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-navy/70 text-xs uppercase tracking-wider">Name</Label>
              <Input id="name" data-testid="input-name" required value={form.name} onChange={set("name")} placeholder="Your full name" className="mt-1.5 bg-white border-navy/15 focus-visible:ring-gold" />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="email" className="text-navy/70 text-xs uppercase tracking-wider">Email</Label>
                <Input id="email" data-testid="input-email" type="email" required value={form.email} onChange={set("email")} placeholder="you@email.com" className="mt-1.5 bg-white border-navy/15 focus-visible:ring-gold" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-navy/70 text-xs uppercase tracking-wider">Phone</Label>
                <Input id="phone" data-testid="input-phone" required value={form.phone} onChange={set("phone")} placeholder="+91 ..." className="mt-1.5 bg-white border-navy/15 focus-visible:ring-gold" />
              </div>
            </div>
            <div>
              <Label className="text-navy/70 text-xs uppercase tracking-wider">Enquiry Type</Label>
              <Select value={form.enquiry_type} onValueChange={(v) => setForm((f) => ({ ...f, enquiry_type: v }))}>
                <SelectTrigger data-testid="select-enquiry-type" className="mt-1.5 bg-white border-navy/15 focus:ring-gold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Enquiry</SelectItem>
                  <SelectItem value="bulk">Bulk Purchase</SelectItem>
                  <SelectItem value="distributor">Distributor / Reseller</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message" className="text-navy/70 text-xs uppercase tracking-wider">Message</Label>
              <Textarea id="message" data-testid="input-message" required rows={4} value={form.message} onChange={set("message")} placeholder="Tell us how we can help..." className="mt-1.5 bg-white border-navy/15 focus-visible:ring-gold resize-none" />
            </div>

            <button
              type="submit"
              data-testid="contact-submit"
              disabled={loading}
              className="btn-sweep w-full inline-flex items-center justify-center gap-2 bg-navy text-white hover:text-navy py-4 rounded-full font-semibold tracking-wide transition-colors duration-500 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? "Sending..." : "Submit Enquiry"}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
