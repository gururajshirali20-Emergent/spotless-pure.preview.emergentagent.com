import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Check, Plus, X } from "lucide-react";
import { useLenis } from "lenis/react";
import blossom from "@/assets/forest-blossom.png";
import dew from "@/assets/forest-dew.png";
import royal from "@/assets/royal-forest.png";
import dashboard from "@/assets/car-dashboard-polish.png";

const LOCAL_IMG = {
  "forest-blossom": blossom,
  "forest-dew": dew,
  "royal-forest": royal,
  "car-dashboard-polish": dashboard,
};

const imgFor = (p) => LOCAL_IMG[p.id] || p.image_url;
const isPhoto = (p) => !LOCAL_IMG[p.id] && !!p.image_url;

function ProductCard({ p, index, onOpen }) {
  const photo = isPhoto(p);
  return (
    <motion.div
      data-testid={`product-card-${p.id}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(p)}
      className="group relative cursor-pointer rounded-t-[2.5rem] rounded-br-[2.5rem] border border-gold/30 bg-white overflow-hidden shadow-[0_20px_50px_rgba(10,17,40,0.06)] transition-shadow duration-500 hover:shadow-[0_30px_70px_rgba(10,17,40,0.14)]"
    >
      <div
        className={`relative h-[360px] flex items-end justify-center overflow-hidden ${
          photo ? "bg-navy" : "bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.12),transparent_60%)]"
        }`}
      >
        <span
          className="absolute top-5 left-5 z-10 text-[0.65rem] tracking-[0.2em] uppercase font-semibold px-3 py-1 rounded-full text-white"
          style={{ backgroundColor: p.accent }}
        >
          {p.size}
        </span>
        {photo ? (
          <>
            <img
              src={imgFor(p)}
              alt={p.name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          </>
        ) : (
          <img
            src={imgFor(p)}
            alt={p.name}
            className="h-[92%] object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06] product-shadow"
          />
        )}
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
  );
}

function GroupHeader({ overline, title, accent }) {
  return (
    <div className="max-w-2xl mb-12">
      <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-gold font-semibold mb-4">
        {overline}
      </p>
      <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight text-navy leading-tight">
        {title} <span className="italic text-forest">{accent}</span>
      </h3>
      <div className="gold-divider mt-6 max-w-xs" />
    </div>
  );
}

export default function Products({ products = [], onEnquire }) {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("all");
  const lenis = useLenis();

  const homeCare = products.filter((p) => (p.group || "home-care") === "home-care");
  const automobile = products.filter((p) => p.group === "automobile");

  const FILTERS = [
    { key: "all", label: "All Products" },
    { key: "home-care", label: "Home Care" },
    { key: "automobile", label: "Automobile" },
  ];

  return (
    <section id="collection" data-testid="products-section" className="relative bg-marble py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-gold font-semibold mb-4">
            Our Collection
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-navy leading-tight">
            Signature care for every surface — <span className="italic text-forest">spotless purity.</span>
          </h2>
        </div>

        {/* Category filter toggle */}
        <div data-testid="collection-filter" className="mb-16 inline-flex flex-wrap gap-1 rounded-full border border-gold/30 bg-white p-1.5 shadow-[0_10px_30px_rgba(10,17,40,0.05)]">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              data-testid={`filter-${f.key}`}
              onClick={() => setFilter(f.key)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors duration-300 ${
                filter === f.key ? "text-white" : "text-navy/60 hover:text-navy"
              }`}
            >
              {filter === f.key && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-navy"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </div>

        {/* Section 1 — Home Care */}
        {filter !== "automobile" && (
          <div data-testid="collection-home-care" className="mb-24">
            <GroupHeader overline="01 · Home Care" title="For a home that shines," accent="inside out." />
            <div className="grid gap-8 md:grid-cols-3">
              {homeCare.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} onOpen={setActive} />
              ))}
            </div>

            {/* Home Care promo video */}
            <motion.div
              data-testid="home-care-video"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center rounded-t-[2.5rem] rounded-br-[2.5rem] border border-gold/30 bg-navy overflow-hidden shadow-[0_30px_70px_rgba(10,17,40,0.18)]"
            >
              <div className="p-8 md:p-12">
                <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-gold font-semibold mb-4">
                  Elvora-X in Action
                </p>
                <h3 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-4">
                  See the shine, <span className="italic text-gold-light">feel the freshness.</span>
                </h3>
                <p className="text-white/60 font-light leading-relaxed">
                  Watch how our premium home care range transforms everyday cleaning into
                  a spotless, fragrant experience for modern living.
                </p>
              </div>
              <div className="relative bg-black flex items-center justify-center min-h-[280px] max-h-[560px] p-3">
                <video
                  data-testid="home-care-video-player"
                  className="w-full h-full max-h-[540px] object-contain rounded-2xl"
                  src={`${process.env.PUBLIC_URL}/elvora-ad.mp4`}
                  loop
                  playsInline
                  controls
                  preload="metadata"
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* Section 2 — Automobile Interior Cleaning */}
        {filter !== "home-care" && (
          <div data-testid="collection-automobile">
            <GroupHeader
              overline="02 · Automobile Interior Cleaning"
              title="Showroom finish"
              accent="for your drive."
            />
            <div className="grid gap-8 md:grid-cols-3">
              {automobile.map((p, i) => (
                <ProductCard key={p.id} p={p} index={i} onOpen={setActive} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          data-testid="product-modal"
          className="max-w-3xl p-0 overflow-hidden border-gold/30 bg-white/95 backdrop-blur-2xl [&>button]:hidden"
        >
          {active && (
            <div className="grid md:grid-cols-2">
              <DialogTitle className="sr-only">{active.name}</DialogTitle>
              <DialogDescription className="sr-only">{active.description}</DialogDescription>
              <div
                className="relative flex items-end justify-center min-h-[320px] overflow-hidden"
                style={
                  isPhoto(active)
                    ? undefined
                    : { background: `radial-gradient(circle at 50% 30%, ${active.accent}22, transparent 65%)`, padding: "2rem" }
                }
              >
                {isPhoto(active) ? (
                  <img src={imgFor(active)} alt={active.name} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <img src={imgFor(active)} alt={active.name} className="h-[300px] object-contain product-shadow" />
                )}
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
                    onEnquire?.(active.name);
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
