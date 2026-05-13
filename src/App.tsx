/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  Instagram, 
  Calendar, 
  Car, 
  ShieldCheck, 
  Droplets, 
  Sparkles, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import React, { useState, useEffect } from "react";

// === IMAGES ===
// Helper to correctly encode filenames for URLs
const getImgPath = (name: string) => `/${encodeURIComponent(name)}`;

// === LOGO ===
const LOGO_IMG = getImgPath("logo.jpeg");

const PHOTO_STRINGS = {
  hero: getImgPath("WhatsApp Image 2026-04-26 at 2.58.46 PM.jpeg"),
  story: getImgPath("WhatsApp Image 2026-04-26 at 2.59.02 PM (3).jpeg"),
  interior: getImgPath("WhatsApp Image 2026-04-29 at 2.26.29 PM (2).jpeg"),
  wheel: getImgPath("WhatsApp Image 2026-04-26 at 2.58.45 PM.jpeg"),
  trx: getImgPath("WhatsApp Image 2026-04-29 at 2.26.29 PM.jpeg"),
  escalade: getImgPath("WhatsApp Image 2026-04-26 at 2.59.36 PM.jpeg"),
  gallery: [
    getImgPath("WhatsApp Image 2026-04-29 at 2.26.29 PM (1).jpeg"),
    getImgPath("WhatsApp Image 2026-04-29 at 2.26.29 PM (3).jpeg"),
    getImgPath("WhatsApp Image 2026-04-29 at 2.26.29 PM (5).jpeg"),
    getImgPath("WhatsApp Image 2026-04-29 at 2.26.29 PM (6).jpeg"),
    getImgPath("WhatsApp Image 2026-04-29 at 2.26.29 PM (7).jpeg"),
    getImgPath("WhatsApp Image 2026-04-26 at 2.59.02 PM (1).jpeg"),
    getImgPath("WhatsApp Image 2026-04-26 at 2.59.02 PM (2).jpeg"),
    getImgPath("WhatsApp Image 2026-04-26 at 2.59.22 PM (1).jpeg"),
  ],
  transformations: [
    { 
      image: getImgPath("WhatsApp Image 2026-04-29 at 2.26.30 PM (5).jpeg"),
      label: "Paint Correction & Protection"
    },
    { 
      image: getImgPath("WhatsApp Image 2026-04-29 at 2.26.30 PM (1).jpeg"),
      label: "Mirror-Like Surface Restoration"
    },
    { 
      image: getImgPath("WhatsApp Image 2026-04-29 at 2.26.30 PM (3).jpeg"),
      label: "Multi-Stage Exterior Wash"
    }
  ]
};

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.style.display = 'none';
};

const PACKAGES = [
  {
    price: "$60",
    name: "Essential Detail",
    description: "The baseline for a clean ride. High-pressure wash, wheel cleaning, and vacuum.",
    icon: <Droplets className="w-5 h-5 text-primary" />
  },
  {
    price: "$150",
    name: "Complete Care",
    description: "Full Interior & Exterior overhaul plus premium shampoo treatment.",
    icon: <Sparkles className="w-5 h-5 text-primary" />,
    featured: true
  },
  {
    price: "$400",
    name: "1-Year Guard",
    description: "Professional Ceramic Coating + Paint Correction for lasting depth.",
    icon: <ShieldCheck className="w-5 h-5 text-primary" />
  },
  {
    price: "$600",
    name: "5-Year Armor",
    description: "Advanced performance coating with multi-stage paint correction.",
    icon: <ShieldCheck className="w-5 h-5 text-red-500" />
  },
  {
    price: "$1,500",
    name: "Diamond Suite",
    description: "The ultimate total interior & exterior ceramic protection ecosystem.",
    icon: <ShieldCheck className="w-5 h-5 text-red-500" />
  }
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    model: "",
    service: "Select A Package",
    dateTime: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.service === "Select A Package") {
      alert("Please select a package");
      return;
    }

    // Map internal state keys to the names requested for Formspree labels
    const submissionData = {
      "Name": formData.name,
      "Email": formData.email,
      "Vehicle": formData.model,
      "Service": formData.service,
      "Requested Date/Time": formData.dateTime,
      "Message": formData.message
    };

    console.log("Submitting booking request to Formspree...", submissionData);
    setStatus("loading");
    try {
      const response = await fetch("https://formspree.io/f/mwvyzvnb", {
        method: "POST",
        headers: { 
          "Accept": "application/json",
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(submissionData)
      });
      
      const result = await response.json();
      console.log("Formspree response:", result);

      if (response.ok) {
        setStatus("success");
        setFormData({ 
          name: "", 
          email: "", 
          model: "", 
          service: "Select A Package", 
          dateTime: "",
          message: "" 
        });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        const errorMsg = result.errors?.[0]?.message || "Submission failed";
        alert(`Error: ${errorMsg}`);
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error("Formspree submission failed:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="bg-navy text-zinc-100 min-h-screen font-sans selection:bg-primary selection:text-navy relative overflow-x-hidden">
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${
          isScrolled ? "py-4 bg-navy/90 backdrop-blur-3xl border-b border-primary/10 shadow-2xl" : "py-10 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black tracking-tighter flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-navy overflow-hidden rounded-full border border-primary/30 relative shadow-2xl">
              <img src={LOGO_IMG} alt="Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-serif italic text-2xl font-bold text-white tracking-widest leading-tight">
                DHALIWAL
              </span>
              <span className="text-primary font-sans font-black text-[11px] uppercase tracking-[0.6em] leading-none opacity-90">
                ELITE DETAILING
              </span>
            </div>
          </motion.div>

          <div className="hidden md:flex gap-10 items-center text-[9px] font-bold tracking-[0.3em] uppercase">
            {["Services", "Our Story", "Packages", "Gallery"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-zinc-400 hover:text-primary transition-all duration-300 relative group font-sans"
              >
                {item}
              </a>
            ))}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('book-now')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-primary border-b border-primary pb-1 font-black transition-all duration-500 font-sans tracking-widest"
            >
              BOOK NOW
            </motion.button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={PHOTO_STRINGS.hero} 
            alt="Hero Car" 
            onError={handleImgError}
            className="w-full h-full object-cover grayscale-[0.3] bg-neutral-800"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-primary/30 text-[10px] uppercase tracking-[0.4em] mb-12 backdrop-blur-xl text-primary bg-primary/5 font-sans rounded-full">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              Toronto's Premier Detailing Studio
            </div>
            
            <h1 className="text-[12vw] md:text-[10vw] font-serif font-light leading-[0.82] mb-12 italic text-white uppercase tracking-tighter mix-blend-difference">
              The Art of <br /> 
              <span className="font-sans font-black uppercase not-italic gold-gradient tracking-tighter block mt-4 drop-shadow-[0_0_50px_rgba(212,175,55,0.4)]">
                Excellence
              </span>
            </h1>
            
            <p className="text-zinc-300 max-w-xl text-sm md:text-base leading-relaxed mb-16 opacity-80 uppercase tracking-[0.3em] font-light font-sans">
              Precision is not an option; it is our reputation. <br className="hidden md:block" /> Gurbir Dhaliwal presents a heritage of automotive perfection.
            </p>
            
            <div className="flex flex-wrap gap-12 items-center">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('book-now')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative bg-primary text-navy px-14 py-6 text-xs font-black uppercase tracking-[0.5em] transition-all duration-500 overflow-hidden shadow-[0_20px_50px_rgba(229,177,42,0.2)] rounded-xs"
              >
                <span className="relative z-10 font-sans">RESERVE NOW</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              </motion.button>
              
              <div className="flex gap-6 items-center">
                <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-sans hidden sm:block">Explore Process</span>
                  <div className="flex gap-3">
                    <div 
                      onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-24 h-16 border border-white/10 overflow-hidden transition-all duration-500 cursor-pointer hover:border-primary group bg-neutral-800"
                    >
                      <img 
                        src={PHOTO_STRINGS.interior} 
                        onError={handleImgError}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        alt="Detailing 1" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div 
                      onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-24 h-16 border border-white/10 overflow-hidden transition-all duration-500 cursor-pointer hover:border-primary group bg-neutral-800"
                    >
                      <img 
                        src={PHOTO_STRINGS.wheel} 
                        onError={handleImgError}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                        alt="Detailing 2" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                  </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section id="our-story" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-2xl overflow-hidden group bg-neutral-800 shadow-2xl border border-white/5"
            >
              <img 
                src={PHOTO_STRINGS.story} 
                alt="Detailing Process" 
                onError={handleImgError}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-primary text-sm font-bold tracking-[0.5em] uppercase mb-6 font-sans">The Pursuit of Perfection</h2>
              <h3 className="text-5xl md:text-7xl font-serif font-light leading-none italic mb-10 text-white">Reputation for <br/>Quality.</h3>
              <div className="space-y-6 text-zinc-400 font-light text-[15px] leading-relaxed font-sans uppercase tracking-widest opacity-80">
                <p>
                  Since 2022, Dhaliwal Detailing has been the silent architect behind some of the city's most brilliant shines. Founded by Gurbir Dhaliwal, our mission has always been simple: zero compromise.
                </p>
                <p>
                  Every crease, every stitch, and every square inch of paint is treated with a level of obsession that only a true enthusiast can provide.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-12 text-primary text-[10px] uppercase tracking-[0.5em] font-bold border-b border-primary/30 pb-2 hover:border-primary transition-all font-sans"
              >
                Learn More About Our Heritage
              </motion.button>
              <div className="mt-16 grid grid-cols-3 gap-12 border-t border-white/5 pt-12">
                <div>
                  <div className="text-4xl font-serif italic text-primary">500+</div>
                  <div className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] mt-3 font-sans font-bold">Vehicles</div>
                </div>
                <div>
                  <div className="text-4xl font-serif italic text-primary">200+</div>
                  <div className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] mt-3 font-sans font-bold">Ceramic</div>
                </div>
                <div>
                  <div className="text-4xl font-serif italic text-primary">100%</div>
                  <div className="text-zinc-500 text-[9px] uppercase tracking-[0.3em] mt-3 font-sans font-bold">Satisfied</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Elite Results Showcase */}
      <section className="py-32 bg-zinc-950 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-primary text-sm font-bold tracking-[0.5em] uppercase mb-6 font-sans">Visual Excellence</h2>
            <h3 className="text-5xl md:text-7xl font-serif italic text-white">Elite Results</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PHOTO_STRINGS.transformations.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-6 group cursor-pointer"
                onClick={() => document.getElementById('book-now')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xs border border-white/5 shadow-2xl">
                  <img src={item.image} alt={item.label} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 transition-all pointer-events-none" />
                </div>
                <div className="text-center">
                  <p className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase font-sans mb-2 group-hover:text-white transition-colors">{item.label}</p>
                  <p className="text-zinc-500 text-[8px] tracking-[0.3em] uppercase underline decoration-red-600/50 underline-offset-4 opacity-0 group-hover:opacity-100 transition-all">Request Service</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid (Visual Focus) */}
      <section id="services" className="py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Ceramic Coating", img: PHOTO_STRINGS.wheel, desc: "Liquid glass protection that repels everything." },
              { title: "Deep Decontamination", img: PHOTO_STRINGS.gallery[7], desc: "Full iron removal and clay bar mechanical treatment." },
              { title: "Paint Correction", img: PHOTO_STRINGS.trx, desc: "Removing swirls for a mirror-like finish." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-neutral-800 aspect-[4/5] cursor-pointer"
              >
                <img src={service.img} onError={handleImgError} alt={service.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-105" />
                <div 
                  onClick={() => document.getElementById('book-now')?.scrollIntoView({ behavior: 'smooth' })}
                  className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-8"
                >
                  <h4 className="text-2xl font-bold mb-2 tracking-tight">{service.title}</h4>
                  <p className="text-zinc-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 underline decoration-red-600 underline-offset-4">Learn More</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto mb-20 text-center">
          <h2 className="text-primary text-sm font-bold tracking-[0.5em] uppercase mb-6 font-sans">Transparent Pricing</h2>
          <h3 className="text-6xl font-serif italic text-white leading-none">THE PACKAGES</h3>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 lg:grid-cols-5 gap-3">
          {PACKAGES.map((pkg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => document.getElementById('book-now')?.scrollIntoView({ behavior: 'smooth' })}
              className={`p-6 border transition-all duration-500 group cursor-pointer ${
                pkg.featured 
                ? "bg-primary/5 border-primary/40 relative shadow-2xl shadow-primary/5" 
                : "bg-white/5 border-white/10 hover:border-primary/40"
              }`}
            >
              {pkg.featured && (
                <div className="absolute top-0 right-0 bg-primary text-black text-[8px] font-black px-2 py-1 uppercase tracking-tighter">
                  Recommended
                </div>
              )}
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 group-hover:text-primary transition-colors font-sans">{pkg.name}</span>
                  <span className="font-serif italic text-lg group-hover:text-zinc-100 transition-colors">{pkg.price}</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-light mb-auto uppercase tracking-[0.2em] font-sans">
                  {pkg.description}
                </p>
                <div className="mt-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h2 className="text-primary text-sm font-bold tracking-[0.5em] uppercase mb-6 font-sans">The Showroom</h2>
            <h3 className="text-6xl md:text-8xl font-serif italic text-white leading-none">RECENT WORK</h3>
          </div>
          <a 
            href="https://instagram.com/dhaliwal_detailing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-primary transition-colors flex items-center gap-3 tracking-[0.4em] text-[10px] uppercase font-sans border-b border-white/10 pb-2"
          >
            Live Updates <Instagram className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1600px] mx-auto auto-rows-[300px]">
          {PHOTO_STRINGS.gallery.concat([PHOTO_STRINGS.hero, PHOTO_STRINGS.story]).map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`relative overflow-hidden rounded-xs group bg-neutral-800 ${
                i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img 
                src={img} 
                alt="Gallery" 
                onError={handleImgError}
                className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-1000 group-hover:scale-105" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-navy/40 opacity-40 group-hover:opacity-0 transition-opacity duration-700" />
              <div className="absolute inset-0 border border-white/0 group-hover:border-primary/30 transition-all duration-700 m-4 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Booking Form */}
      <section id="book-now" className="py-32 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold tracking-tight mb-4 text-white uppercase italic font-serif">Reserve Your Gloss</h3>
            <p className="text-zinc-500 font-light uppercase tracking-widest text-[10px]">Spaces are strictly limited. Secure your appointment today.</p>
          </div>
          
          <form onSubmit={handleBooking} className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-zinc-500">Full Name</label>
              <input 
                required
                name="Name"
                type="text" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-zinc-800/50 border border-white/5 p-4 text-xs text-white focus:outline-none focus:border-white/20 transition-all" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-zinc-500">Email Address</label>
              <input 
                required
                name="Email"
                type="email" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-zinc-800/50 border border-white/5 p-4 text-xs text-white focus:outline-none focus:border-white/20 transition-all" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-zinc-500">Vehicle Model / Year</label>
              <input 
                required
                name="Vehicle"
                type="text" 
                placeholder="Porsche 911 GT3" 
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                className="bg-zinc-800/50 border border-white/5 p-4 text-xs text-white focus:outline-none focus:border-white/20 transition-all" 
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-zinc-500">Type of Service</label>
              <select 
                required
                name="Service"
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className="bg-zinc-800/50 border border-white/5 p-4 text-xs text-white focus:outline-none focus:border-white/20 transition-all appearance-none"
              >
                <option disabled>Select A Package</option>
                {PACKAGES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                <option value="Custom Quote">Custom Quote / Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] uppercase tracking-widest text-zinc-500">What date and time would you like to come?</label>
              <input 
                required
                name="Requested Date/Time"
                type="datetime-local" 
                value={formData.dateTime}
                onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                className="bg-zinc-800/50 border border-white/5 p-4 text-xs text-white focus:outline-none focus:border-white/20 transition-all" 
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[9px] uppercase tracking-widest text-zinc-500">Additional Message</label>
              <textarea 
                rows={4}
                name="Message"
                placeholder="Tell us about the condition or specific requests..." 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="bg-zinc-800/50 border border-white/5 p-4 text-xs text-white focus:outline-none focus:border-white/20 transition-all resize-none" 
              />
            </div>
            <div className="md:col-span-2">
              <button 
                disabled={status === "loading"}
                type="submit"
                className={`w-full py-6 text-[11px] font-black uppercase tracking-[0.4em] transition-all mt-4 flex items-center justify-center gap-2 ${
                  status === "success" ? "bg-green-600 text-white" : 
                  status === "error" ? "bg-red-600 text-white" : 
                  "bg-primary text-black hover:bg-white"
                } shadow-2xl shadow-primary/20`}
              >
                {status === "loading" ? "Processing..." : 
                 status === "success" ? "Booking Requested" : 
                 status === "error" ? "Try Again" : 
                 "Request Booking"}
              </button>
              {status === "success" && (
                <div className="mt-8 text-center space-y-2">
                  <p className="text-[10px] text-green-500 tracking-[0.3em] uppercase font-sans">Booking successfully requested.</p>
                  <p className="text-[9px] text-zinc-400 tracking-[0.2em] uppercase font-sans font-light">We will send a confirmation email after successfully booking.</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 border-t border-primary/10 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-20 relative z-10">
          <div className="space-y-8 col-span-2 md:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-navy overflow-hidden rounded-full border border-primary/30 relative shadow-2xl">
                <img src={LOGO_IMG} alt="Logo" className="w-full h-full object-cover scale-110" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-serif italic text-2xl tracking-wider leading-none">DHALIWAL</span>
                <span className="text-primary font-sans font-black text-[11px] tracking-[0.5em] mt-1 opacity-90">ELITE DETAILING</span>
              </div>
            </div>
            <p className="text-zinc-500 text-xs font-light leading-relaxed uppercase tracking-[0.3em] font-sans max-w-xs">
              TORONTO'S ELITE AUTOMOTIVE PROTECTORS. A REPUTATION FOR QUALITY BUILT ON EVERY REFLECTION.
            </p>
          </div>
          <div className="space-y-6">
            <h5 className="text-primary text-[10px] font-black tracking-[0.5em] uppercase font-sans">Navigation</h5>
            <ul className="text-zinc-400 text-xs space-y-4 font-normal font-sans uppercase tracking-[0.3em]">
              <li className="hover:text-primary cursor-pointer transition-colors">Our Portfolio</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Elite Packages</li>
              <li className="hover:text-primary cursor-pointer transition-colors">The Process</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Gift Cards</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h5 className="text-primary text-[10px] font-black tracking-[0.5em] uppercase font-sans">Social Presence</h5>
            <div className="text-zinc-400 text-xs flex items-center gap-4 hover:text-primary cursor-pointer transition-colors group font-sans uppercase tracking-[0.3em]">
              <Instagram className="w-5 h-5" /> 
              <span>@dhaliwal_detailing</span>
            </div>
            <div className="mt-8 pt-8 border-t border-primary/10">
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-sans">Inquiries via Instagram DM Preferred</p>
            </div>
          </div>
          <div className="space-y-6">
            <h5 className="text-primary text-[10px] font-black tracking-[0.5em] uppercase font-sans">Region</h5>
            <p className="text-zinc-400 text-xs font-normal font-sans uppercase tracking-[0.3em] leading-relaxed">TORONTO, MISSISSAUGA, BRAMPTON & GTA</p>
            <p className="text-primary text-xs font-light italic font-serif mt-4">Available for On-Site Elite Servicing</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-primary/10 text-center text-[10px] text-zinc-600 tracking-[0.8em] uppercase font-sans px-6">
          © {new Date().getFullYear()} DHALIWAL DETAILING. LEGACY BUILT BY GURBIR DHALIWAL.
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-zinc-950 p-10 md:hidden flex flex-col justify-center items-center gap-10"
          >
            <button className="absolute top-10 right-10" onClick={() => setIsMenuOpen(false)}>
              <X className="w-8 h-8" />
            </button>
            {["Services", "Our Story", "Packages", "Gallery"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-4xl font-black tracking-tighter"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                document.getElementById('book-now')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-primary text-black px-10 py-5 rounded-full font-black tracking-widest text-sm uppercase"
            >
              BOOK NOW
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
