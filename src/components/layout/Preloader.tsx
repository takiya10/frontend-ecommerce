import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    // Mencoba memaksakan play via JavaScript untuk mobile
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(err => {
        console.warn("Autoplay blocked, skipping to content...", err);
        // Jika benar-benar diblokir (misal Mode Hemat Daya), langsung skip ke konten
        handleVideoEnd();
      });
    }

    const timer = setTimeout(() => {
      handleVideoEnd();
    }, 6000);

    return () => {
      document.body.style.overflow = "unset";
      clearTimeout(timer);
    };
  }, []);

  const handleVideoEnd = () => {
    if (fadeOut) return;
    setFadeOut(true);
    onComplete(); 
    
    setTimeout(() => {
      setIsRemoved(true);
    }, 1000);
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
        ref={videoRef}
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onEnded={handleVideoEnd}
        disablePictureInPicture
        className="w-full h-full object-cover pointer-events-none"
        style={{ filter: "brightness(0.9)" }}
      >
        <source src={`${import.meta.env.BASE_URL}animationhero.webm`} type="video/webm" />
        <source src={`${import.meta.env.BASE_URL}animationhero.mp4`} type="video/mp4" />
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
