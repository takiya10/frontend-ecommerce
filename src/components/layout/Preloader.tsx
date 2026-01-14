import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Memastikan body tidak bisa di-scroll saat loading
    document.body.style.overflow = "hidden";
    
    // Safety fallback: Jika video gagal load/berhenti, paksa selesai setelah 5 detik
    const timer = setTimeout(() => {
      handleVideoEnd();
    }, 5000);

    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(timer);
    };
  }, []);

  const handleVideoEnd = () => {
    setFadeOut(true);
    // Beri sinyal ke App bahwa video selesai lebih awal untuk persiapan
    onComplete(); 
    
    setTimeout(() => {
      setIsRemoved(true);
    }, 1000); // Sesuai durasi durasi transition
  };

  if (isRemoved) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-all duration-1000 ease-in-out",
        fadeOut ? "opacity-0 invisible" : "opacity-100 visible"
      )}
    >
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover pointer-events-none"
        style={{ filter: "brightness(0.9)" }} // Sedikit redup agar transisi ke konten tidak terlalu silau
      >
        <source src="/animationhero.webm" type="video/webm" />
      </video>
      
      <button 
        onClick={handleVideoEnd}
        className="absolute bottom-10 right-10 text-primary/40 text-[10px] uppercase tracking-[0.5em] hover:text-primary transition-all z-50"
      >
        Skip
      </button>
    </div>
  );
}
