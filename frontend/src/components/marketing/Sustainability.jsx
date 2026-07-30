import { motion } from "framer-motion";
import { Leaf, Recycle, ShieldCheck, MapPin } from "lucide-react";
import lion from "@/assets/lion.png";

const POINTS = [
  { Icon: Leaf, title: "Eco-Conscious Formulas", body: "Thoughtfully crafted to be effective yet gentle — kind to your home and the world around it." },
  { Icon: Recycle, title: "Responsible Manufacturing", body: "Premium sourcing and mindful processes that reduce waste at every step." },
  { Icon: ShieldCheck, title: "Safe For Everyday Use", body: "Dependable, hygienic protection you can trust for daily family living." },
];

export default function Sustainability() {
  return (
    <section
      id="sustainability"
      data-testid="sustainability-section"
      className="relative forest-bg text-white py-24 md:py-32 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(212,175,55,0.12),transparent_55%)]" />

      <div className="relative mx-auto max-w-[88rem] px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-gold font-semibold mb-4">
            Sustainability · Make in India
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-8">
            Proudly made in India, <span className="italic text-gold-light">purely for the planet.</span>
          </h2>
          <p className="text-white/70 font-light text-lg leading-relaxed mb-10 max-w-xl">
            Elvora-X is rooted in Indian craftsmanship and a commitment to sustainable
            home care. We honour the land that inspires us — from forest-fresh fragrances
            to eco-minded manufacturing.
          </p>

          <div className="space-y-6">
            {POINTS.map((p, i) => (
              <motion.div
                key={p.title}
                data-testid={`sustainability-point-${i}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="h-11 w-11 rounded-full bg-white/10 grid place-items-center text-gold shrink-0">
                  <p.Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-gold-light mb-1">{p.title}</h3>
                  <p className="text-white/65 font-light">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center justify-center"
        >
          <div className="absolute h-80 w-80 rounded-full border border-gold/30" />
          <div className="absolute h-96 w-96 rounded-full border border-gold/10" />
          <div className="relative rounded-3xl bg-white/95 px-10 py-12 text-center shadow-2xl">
            <img src={lion} alt="Make in India" className="h-28 object-contain mx-auto mb-4" />
            <p className="font-serif text-3xl text-navy">Crafted with Pride</p>
            <p className="text-forest text-sm tracking-[0.25em] uppercase font-semibold mt-2">
              A Manishika Ventures Brand
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
