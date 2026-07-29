import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "lenis/react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { NAV_LINKS } from "@/data/site";
import emblem from "@/assets/emblem.png";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setOpen(false);
    if (lenis) lenis.scrollTo(href, { offset: -90, duration: 1.3 });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      data-testid="site-header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-2xl shadow-[0_10px_40px_rgba(10,17,40,0.08)] border-b border-white/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
        <div className="flex items-center justify-between h-[74px]">
          <button
            data-testid="logo-home"
            onClick={() => go("#home")}
            className="flex items-center gap-3 group"
          >
            <img src={emblem} alt="Elvora-X emblem" className="h-11 w-11 object-contain" />
            <span className="flex flex-col items-start leading-none">
              <span className="font-serif text-2xl font-semibold tracking-tight text-navy">
                ELVORA-X
              </span>
              <span className="text-[0.6rem] tracking-[0.35em] text-forest font-semibold mt-0.5">
                SPOTLESS AND PURE
              </span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-9">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                data-testid={`nav-${l.href.replace("#", "")}`}
                onClick={() => go(l.href)}
                className="relative text-sm font-medium text-navy/80 hover:text-navy transition-colors duration-300 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold hover:after:w-full after:transition-[width] after:duration-300"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 text-forest">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[0.7rem] font-semibold tracking-wide">
                Premium Quality You Can Trust
              </span>
            </div>
            <button
              data-testid="header-contact-cta"
              onClick={() => go("#contact")}
              className="btn-sweep hidden sm:inline-flex items-center border border-navy text-navy hover:text-white px-6 py-2.5 text-sm font-semibold tracking-wide rounded-full transition-colors duration-500"
            >
              Enquire Now
            </button>
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden text-navy p-2"
              aria-label="Menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gold/20"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.href}
                  data-testid={`mobile-nav-${l.href.replace("#", "")}`}
                  onClick={() => go(l.href)}
                  className="text-left font-serif text-2xl text-navy"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => go("#contact")}
                className="mt-2 bg-navy text-white py-3 rounded-full font-semibold"
              >
                Enquire Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
