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
    ctas: [
      { text: "Exclusive Discount 10% for All Items", highlight: "10%" },
      { text: "Best Seller Bundle up to 25%", highlight: "25%" },
    ],
  },
  {
    id: 2,
    image: lozyHero1,
    title: "Januari",
    subtitle: "KICK-OFF",
    highlight: "Sale",
    ctas: [
      { text: "Exclusive Discount 10% for All Items", highlight: "10%" },
      { text: "Best Seller Bundle up to 25%", highlight: "25%" },
    ],
  },
  {
    id: 3,
    image: lozyHero2,
    title: "Januari",
    subtitle: "KICK-OFF",
    highlight: "Sale",
    ctas: [
      { text: "Exclusive Discount 10% for All Items", highlight: "10%" },
      { text: "Best Seller Bundle up to 25%", highlight: "25%" },
    ],
  },
  {
    id: 4,
    image: lozyHero3,
    title: "Januari",
    subtitle: "KICK-OFF",
    highlight: "Sale",
    ctas: [
      { text: "Exclusive Discount 10% for All Items", highlight: "10%" },
      { text: "Best Seller Bundle up to 25%", highlight: "25%" },
    ],
  },
  {
    id: 5,
    image: lozyHero4,
    title: "Januari",
    subtitle: "KICK-OFF",
    highlight: "Sale",
    ctas: [
      { text: "Exclusive Discount 10% for All Items", highlight: "10%" },
      { text: "Best Seller Bundle up to 25%", highlight: "25%" },
    ],
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 20000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <AnimatePresence mode="wait">
            {currentSlide === index && (
              <motion.img
                key={slide.id}
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-top"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </AnimatePresence>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
          
          {/* Content */}
          <div className="relative h-full container mx-auto flex items-center">
            <div className="max-w-xl animate-fade-in">
              <p className="text-muted-foreground font-serif text-xl md:text-2xl mb-2 italic">
                {slide.title}
              </p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-none">
                {slide.subtitle}
                <span className="font-serif italic text-5xl md:text-7xl lg:text-8xl ml-2 text-warm-brown">
                  {slide.highlight}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mt-2 font-serif tracking-widest">Byher</p>
              
              {/* CTAs */}
              <div className="mt-8 space-y-3">
                {slide.ctas.map((cta, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="w-full md:w-auto justify-center text-xs md:text-sm bg-warm-brown/10 backdrop-blur-md border-warm-brown/20 text-warm-brown hover:bg-warm-brown/20 transition-all active:scale-[0.98] px-8 py-6 rounded-none tracking-widest uppercase shadow-none border"
                    style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                  >
                    {cta.text.split(cta.highlight).map((part, j) => (
                      <span key={j} className="flex items-center gap-1">
                        {part}
                        {j === 0 && cta.highlight && (
                          <span className="font-bold bg-warm-brown text-white px-2 py-0.5 rounded text-[10px] ml-1 shadow-sm">
                            {cta.highlight}
                          </span>
                        )}
                      </span>
                    ))}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground bg-background/50 hover:bg-background/80 hidden md:flex"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground bg-background/50 hover:bg-background/80 hidden md:flex"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                currentSlide === index
                  ? "bg-foreground w-6"
                  : "bg-foreground/40 hover:bg-foreground/60"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
