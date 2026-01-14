import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-image.jpg";
import lozyHero1 from "@/assets/lozy-hero-1.jpg";
import lozyHero2 from "@/assets/lozy-hero-2.jpg";
import lozyHero3 from "@/assets/lozy-hero-3.jpeg";
import lozyHero4 from "@/assets/lozy-hero-4.jpeg";

const slides = [
  {
    id: 1,
    image: heroImage,
    title: "Januari",
    subtitle: "KICK-OFF",
    highlight: "Sale",
  },
  {
    id: 2,
    image: lozyHero1,
    title: "New Season",
    subtitle: "ESSENTIAL",
    highlight: "2026",
  },
  {
    id: 3,
    image: lozyHero2,
    title: "Exclusive",
    subtitle: "MODEST",
    highlight: "Wear",
  },
  {
    id: 4,
    image: lozyHero3,
    title: "Limited",
    subtitle: "ELEGANT",
    highlight: "Style",
  },
  {
    id: 5,
    image: lozyHero4,
    title: "Collection",
    subtitle: "TIMELESS",
    highlight: "Look",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* Gradient overlay for text readability - Light Gray style */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full container mx-auto flex items-center z-10">
        <div className="max-w-xl animate-fade-in">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-primary/70 font-serif text-xl md:text-2xl mb-1 italic tracking-widest">
                {slides[currentSlide].title}
              </p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-none tracking-tight drop-shadow-sm">
                {slides[currentSlide].subtitle}
                <span className="font-serif italic text-5xl md:text-7xl lg:text-8xl ml-3 text-primary/90">
                  {slides[currentSlide].highlight}
                </span>
              </h1>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-4 mt-4">
            <div className="h-[1px] w-8 bg-primary/30" />
            <p className="text-sm md:text-base text-primary font-sans tracking-[0.6em] uppercase font-light">
              Byher
            </p>
          </div>

          {/* CTAs - Transparent Glass Style */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              variant="outline"
              className="justify-center text-xs md:text-sm bg-white/10 backdrop-blur-xl border-white/20 text-primary hover:bg-white/20 hover:border-white/40 transition-all duration-300 active:scale-[0.98] px-10 py-7 rounded-none tracking-[0.2em] uppercase shadow-md border"
            >
              <span className="flex items-center gap-2">
                Shop Now
                <span className="font-bold bg-primary text-white px-2 py-1 rounded-sm text-[10px] shadow-sm ml-2">
                  10% OFF
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-10 right-10 flex items-center gap-4 z-20">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-primary hover:bg-primary hover:text-white transition-all"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        {/* Progress Dots */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-1 transition-all duration-300",
                currentSlide === index ? "bg-primary w-8" : "bg-primary/20 w-4"
              )}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/10 backdrop-blur-md border-white/20 text-primary hover:bg-primary hover:text-white transition-all"
          onClick={nextSlide}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
}
