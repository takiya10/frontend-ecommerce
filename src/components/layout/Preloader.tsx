import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    if (videoRef.current) {
      // TRICK UNTUK iOS: Set property secara langsung, jangan cuma lewat atribut JSX
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay diblokir (biasanya karena Mode Hemat Daya)
          console.warn("Autoplay blocked by browser policy (likely Low Power Mode)");
          // Opsional: Jika diblokir, kita bisa langsung skip agar user tidak stuck di layar hitam
          // handleVideoEnd(); 
        });
      }
    }

    // Safety fallback: Jika video macet/blokir, buka website setelah 4 detik
    const timer = setTimeout(() => {
      handleVideoEnd();
    }, 4500);

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
        /* Tambahkan onCanPlay sebagai pemicu tambahan */
        onCanPlay={(e) => (e.currentTarget.muted = true)}
      >
        <source src={`${import.meta.env.BASE_URL}animationhero.mp4`} type="video/mp4" />
        <source src={`${import.meta.env.BASE_URL}animationhero.webm`} type="video/webm" />
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
