import { motion } from "framer-motion";

const CHAPTERS = [
  {
    n: "01",
    title: "Our Story",
    body: "At Elvora-X we create premium home care solutions designed for modern living. Born from a belief that everyday cleaning should feel elevated, we blend science with sensorial craft.",
  },
  {
    n: "02",
    title: "Our Craft",
    body: "Our products combine effective cleaning, elegant fragrances and dependable quality — concentrated formulas that respect your home while delivering spotless, lasting results.",
  },
  {
    n: "03",
    title: "Our Promise",
    body: "Premium quality you can trust, every single day. From homes to professional spaces, Elvora-X is a commitment to purity, freshness and protection you can feel.",
  },
];

export default function About() {
  return (
    <section id="about" data-testid="about-section" className="relative bg-marble py-24 md:py-32 overflow-hidden">
      {/* botanical accent */}
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(30,63,32,0.10),transparent_70%)] blur-2xl" />

      <div className="mx-auto max-w-[88rem] px-6">
        <div className="max-w-3xl mb-20">
          <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-gold font-semibold mb-4">
            About Elvora-X
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-navy leading-[1.05]">
            A house devoted to the art of <span className="italic text-forest">spotless living.</span>
          </h2>
        </div>

        <div className="space-y-px">
          {CHAPTERS.map((c, i) => (
            <motion.div
              key={c.n}
              data-testid={`about-chapter-${c.n}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="grid md:grid-cols-12 gap-6 items-start py-10 border-t border-navy/10 group"
            >
              <div className="md:col-span-2">
                <span className="font-serif text-5xl md:text-6xl text-gold group-hover:text-forest transition-colors duration-500">
                  {c.n}
                </span>
              </div>
              <h3 className="md:col-span-3 font-serif text-3xl md:text-4xl text-navy">{c.title}</h3>
              <p className="md:col-span-7 text-base md:text-lg text-navy/65 font-light leading-relaxed">
                {c.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
