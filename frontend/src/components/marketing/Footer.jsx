import { useLenis } from "lenis/react";
import { Instagram, Facebook, Twitter, Linkedin, Phone, Mail } from "lucide-react";
import { NAV_LINKS, CONTACT } from "@/data/site";
import emblem from "@/assets/emblem.png";
import lion from "@/assets/lion.png";

export default function Footer() {
  const lenis = useLenis();
  const go = (href) => {
    if (lenis) lenis.scrollTo(href, { offset: -90, duration: 1.3 });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer data-testid="site-footer" className="relative navy-bg text-white overflow-hidden">
      {/* Quality assurance strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[88rem] px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center">
          {["Deep Cleaning", "Long Lasting Freshness", "Hygienic Protection", "Premium Quality", "Made In India"].map(
            (t) => (
              <span key={t} className="text-[0.7rem] tracking-[0.25em] uppercase text-gold/90 font-semibold">
                {t}
              </span>
            )
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[88rem] px-6 pt-20 pb-10 relative">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src={emblem} alt="emblem" className="h-12 w-12 object-contain bg-white/95 rounded-full p-1" />
              <div>
                <p className="font-serif text-3xl font-semibold">ELVORA-X</p>
                <p className="text-[0.6rem] tracking-[0.35em] text-gold">SPOTLESS AND PURE</p>
              </div>
            </div>
            <p className="text-white/60 max-w-md font-light leading-relaxed">
              Premium home care crafted for modern living. Effective cleaning, elegant
              fragrances and dependable quality for spotless results every day.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  data-testid={`social-link-${i}`}
                  className="h-10 w-10 grid place-items-center rounded-full border border-white/15 text-white/70 hover:border-gold hover:text-gold transition-colors duration-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-gold text-xs tracking-[0.3em] uppercase mb-5">Explore</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    data-testid={`footer-nav-${l.href.replace("#", "")}`}
                    onClick={() => go(l.href)}
                    className="text-white/70 hover:text-white transition-colors duration-300"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs tracking-[0.3em] uppercase mb-5">Reach Us</h4>
            <p className="text-white/70 font-light leading-relaxed mb-4">{CONTACT.address}</p>
            <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors duration-300 mb-2">
              <Phone className="h-4 w-4" /> {CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-white/70 hover:text-gold transition-colors duration-300">
              <Mail className="h-4 w-4" /> {CONTACT.email}
            </a>
            <img src={lion} alt="Make in India" className="mt-6 h-14 object-contain opacity-90 bg-white/90 rounded-md px-2 py-1" />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/50 text-sm">
          <p>© {new Date().getFullYear()} {CONTACT.company}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
          </div>
        </div>

        {/* Watermark */}
        <p className="pointer-events-none select-none absolute -bottom-6 left-1/2 -translate-x-1/2 font-serif text-[16vw] leading-none text-white/[0.03] whitespace-nowrap">
          ELVORA-X
        </p>
      </div>
    </footer>
  );
}
