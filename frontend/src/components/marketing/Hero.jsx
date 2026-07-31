import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { Droplets, Leaf, ShieldCheck, ArrowDownRight } from "lucide-react";
import homeBanner from "@/assets/home-banner.jpg";

const PILLARS = [
  { label: "Cleaning", Icon: Droplets },
  { label: "Freshness", Icon: Leaf },
  { label: "Protection", Icon: ShieldCheck },
];

const line = {
  hidden: { y: "115%" },
  show: (i) => ({
    y: "0%",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.14 },
  }),
};

export default function Hero() {
  const ref = useRef(null);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yLeaf = useTransform(scrollYProgress, [0, 1], [0, 160]);

  const explore = () =>
    lenis ? lenis.scrollTo("#collection", { offset: -70, duration: 1.4 }) : null;

  return (
    <section
      id="home"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-screen marble-bg overflow-hidden pt-28 pb-16"
    >
      {/* gold radial spotlight */}
      <div className="pointer-events-none absolute right-[10%] top-1/2 -translate-y-1/2 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22),transparent_65%)] blur-2xl" />
      <motion.div
        style={{ y: yLeaf }}
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(30,63,32,0.14),transparent_70%)] blur-2xl"
      />

      <div className="relative mx-auto max-w-[88rem] px-6 flex flex-col justify-center min-h-[calc(60vh-6rem)]">
        {/* Text */}
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-xs md:text-sm uppercase tracking-[0.35em] text-forest font-semibold mb-6"
          >
            Trusted by Homes Across India
          </motion.p>

          <h1 className="font-serif text-navy font-medium tracking-tighter leading-[0.95] text-5xl md:text-7xl lg:text-[5.4rem]">
            {["LUXURY", "HOME CARE", "COLLECTION"].map((t, i) => (
              <span key={t} className="reveal-mask">
                <motion.span
                  custom={i}
                  variants={line}
                  initial="hidden"
                  animate="show"
                  className="block"
                >
                  {i === 1 ? <span className="text-forest">{t}</span> : t}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-7 max-w-md text-base md:text-lg text-navy/70 font-light leading-relaxed"
          >
            Premium cleaning solutions crafted for modern living — effective, elegant
            and dependable, for spotless results every day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {PILLARS.map(({ label, Icon }) => (
              <div
                key={label}
                data-testid={`pillar-${label.toLowerCase()}`}
                className="flex items-center gap-2 rounded-full border border-gold/40 bg-white/60 backdrop-blur px-4 py-2"
              >
                <Icon className="h-4 w-4 text-forest" />
                <span className="text-sm font-semibold text-navy">{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            data-testid="hero-explore-cta"
            onClick={explore}
            className="btn-sweep group mt-10 inline-flex items-center gap-3 bg-navy text-white hover:text-navy px-8 py-4 rounded-full font-semibold tracking-wide transition-colors duration-500"
          >
            Explore Collection
            <ArrowDownRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
          </motion.button>
        </div>
      </div>

      {/* Brand showcase banner */}
      <motion.div
        data-testid="hero-banner"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-[88rem] px-6 mt-10 md:mt-16"
      >
        <div className="overflow-hidden rounded-t-[2.5rem] rounded-br-[2.5rem] border border-gold/40 shadow-[0_30px_70px_rgba(10,17,40,0.15)]">
          <img
            src={homeBanner}
            alt="Elvora-X premium home care collection — About & Why Choose Elvora-X"
            className="w-full h-auto object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
