import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, Plus, X } from "lucide-react";
import { useLenis } from "lenis/react";
import blossom from "@/assets/forest-blossom.png";
import dew from "@/assets/forest-dew.png";
import royal from "@/assets/royal-forest.png";

const IMG = {
  "forest-blossom": blossom,
  "forest-dew": dew,
  "royal-forest": royal,
};

export default function Products({ products = [] }) {
  const [active, setActive] = useState(null);
  const lenis = useLenis();

  return (
    <section id="collection" data-testid="products-section" className="relative bg-marble py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6">
        <div className="max-w-2xl mb-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-gold font-semibold mb-4">
            Our Collection
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-navy leading-tight">
            Three signatures, one promise — <span className="italic text-forest">spotless purity.</span>
          </h2>
          <div className="gold-divider mt-8 max-w-xs" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              data-testid={`product-card-${p.id}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setActive(p)}
              className="group relative cursor-pointer rounded-t-[2.5rem] rounded-br-[2.5rem] border border-gold/30 bg-white overflow-hidden shadow-[0_20px_50px_rgba(10,17,40,0.06)] transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(10,17,40,0.14)]"
            >
              <div className="relative h-[360px] flex items-end justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.12),transparent_60%)] overflow-hidden">
                <span
                  className="absolute top-5 left-5 text-[0.65rem] tracking-[0.2em] uppercase font-semibold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: p.accent }}
                >
                  {p.size}
                </span>
                <img
                  src={IMG[p.id]}
                  alt={p.name}
                  className="h-[92%] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06] product-shadow"
                />
              </div>
              <div className="p-7 border-t border-gold/20">
                <p className="text-[0.7rem] tracking-[0.25em] uppercase text-forest font-semibold mb-2">
                  {p.category}
                </p>
                <h3 className="font-serif text-3xl text-navy leading-none mb-3">{p.name}</h3>
                <p className="text-sm text-navy/55 mb-5">{p.tagline}</p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy group-hover:text-gold transition-colors duration-300">
                  <Plus className="h-4 w-4" /> View Details
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          data-testid="product-modal"
          className="max-w-3xl p-0 overflow-hidden border-gold/30 bg-white/95 backdrop-blur-2xl [&>button]:hidden"
        >
          {active && (
            <div className="grid md:grid-cols-2">
              <div
                className="relative flex items-end justify-center p-8 min-h-[320px]"
                style={{ background: `radial-gradient(circle at 50% 30%, ${active.accent}22, transparent 65%)` }}
              >
                <img src={IMG[active.id]} alt={active.name} className="h-[300px] object-contain product-shadow" />
              </div>
              <div className="p-8">
                <button
                  data-testid="modal-close"
                  onClick={() => setActive(null)}
                  className="absolute top-4 right-4 text-navy/40 hover:text-navy transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <p className="text-[0.7rem] tracking-[0.25em] uppercase text-forest font-semibold mb-2">
                  {active.category}
                </p>
                <h3 className="font-serif text-4xl text-navy leading-none mb-4">{active.name}</h3>
                <p className="text-sm text-navy/65 leading-relaxed mb-6">{active.description}</p>
                <ul className="space-y-3 mb-8">
                  {active.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm text-navy/80">
                      <Check className="h-4 w-4 mt-0.5 text-gold shrink-0" /> {h}
                    </li>
                  ))}
                </ul>
                <button
                  data-testid="modal-enquire"
                  onClick={() => {
                    setActive(null);
                    setTimeout(() => lenis?.scrollTo("#contact", { offset: -70, duration: 1.4 }), 200);
                  }}
                  className="btn-sweep w-full bg-navy text-white hover:text-navy py-3 rounded-full font-semibold transition-colors duration-500"
                >
                  Enquire About {active.name}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
