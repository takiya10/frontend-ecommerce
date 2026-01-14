import { Hammer } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="p-6 bg-primary/5 rounded-full mb-6 animate-pulse">
        <Hammer className="h-12 w-12 text-primary" />
      </div>
      <h1 className="font-serif text-4xl md:text-5xl mb-4">Under Maintenance</h1>
      <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
        Kami sedang memperbarui koleksi terbaik kami untuk Anda. 
        Website Byher akan segera kembali dalam beberapa saat. 
        Terima kasih atas kesabaran Anda.
      </p>
      <div className="mt-12 text-[10px] uppercase tracking-[0.3em] text-muted-foreground border-t pt-8 w-full max-w-xs">
        Byher Official Portal
      </div>
    </div>
  );
}
