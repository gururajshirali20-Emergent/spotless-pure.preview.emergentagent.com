import { motion } from "framer-motion";
import { Sparkles, Wind, Sun, HeartHandshake, Building2 } from "lucide-react";

const ICONS = [Sparkles, Wind, Sun, HeartHandshake, Building2];

// bento placement classes per index
const SPANS = [
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];
const DARK = [true, false, false, true, false];

export default function Features({ features = [] }) {
  return (
    <section data-testid="features-section" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[88rem] px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-gold font-semibold mb-4">
              Why Choose Elvora-X
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-navy leading-tight">
              Crafted for performance, designed for trust.
            </h2>
          </div>
          <p className="text-navy/60 max-w-sm font-light">
            Every formula is engineered to deliver a spotless, fragrant and hygienic
            finish across homes and professional spaces alike.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4 md:auto-rows-[220px]">
          {features.map((f, i) => {
            const Icon = ICONS[i % ICONS.length];
            const dark = DARK[i % DARK.length];
            return (
              <motion.div
                key={f.title}
                data-testid={`feature-${i}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`${SPANS[i % SPANS.length]} group relative rounded-3xl p-8 flex flex-col justify-between overflow-hidden border ${
                  dark ? "navy-bg border-gold/20 text-white" : "bg-marble border-gold/20 text-navy"
                }`}
              >
                <div
                  className={`h-12 w-12 rounded-full grid place-items-center ${
                    dark ? "bg-gold/15 text-gold" : "bg-forest/10 text-forest"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className={`font-serif text-2xl md:text-3xl mb-2 ${dark ? "text-gold-light" : "text-forest"}`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm font-light ${dark ? "text-white/70" : "text-navy/60"}`}>
                    {f.desc}
                  </p>
                </div>
                <span className="pointer-events-none absolute -right-6 -bottom-6 font-serif text-8xl opacity-[0.06]">
                  0{i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
