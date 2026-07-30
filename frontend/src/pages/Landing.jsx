import { useEffect, useState } from "react";
import Header from "@/components/marketing/Header";
import Hero from "@/components/marketing/Hero";
import EditorialMarquee from "@/components/marketing/Marquee";
import Products from "@/components/marketing/Products";
import Features from "@/components/marketing/Features";
import About from "@/components/marketing/About";
import Sustainability from "@/components/marketing/Sustainability";
import Contact from "@/components/marketing/Contact";
import Footer from "@/components/marketing/Footer";
import { api } from "@/lib/api";

export default function Landing() {
  const [data, setData] = useState({ products: [], features: [] });
  const [prefill, setPrefill] = useState(null);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-marble">
      <Header />
      <main>
        <Hero />
        <EditorialMarquee />
        <Products products={data.products} onEnquire={setPrefill} />
        <Features features={data.features} />
        <About />
        <Sustainability />
        <Contact prefill={prefill} />
      </main>
      <Footer />
    </div>
  );
}
