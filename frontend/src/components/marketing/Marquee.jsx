import Marquee from "react-fast-marquee";

const ITEMS = [
  "SPOTLESS AND PURE",
  "PREMIUM QUALITY YOU CAN TRUST",
  "CRAFTED FOR MODERN LIVING",
  "TRUSTED BY HOMES ACROSS INDIA",
  "MADE IN INDIA",
];

export default function EditorialMarquee() {
  return (
    <section
      data-testid="editorial-marquee"
      className="navy-bg border-y border-gold/20 py-6 overflow-hidden"
    >
      <Marquee speed={38} gradient={false} autoFill>
        {ITEMS.map((t, i) => (
          <span key={i} className="flex items-center">
            <span className="font-serif italic text-2xl md:text-4xl text-white/90 px-8 tracking-tight">
              {t}
            </span>
            <span className="text-gold text-xl">✦</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
