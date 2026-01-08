import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setEmail("");
    toast.success("Terima kasih! Anda akan menerima update terbaru dari kami.");
  };

  return (
    <section className="py-16 lg:py-20 bg-accent">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
            Dapatkan Update Terbaru
          </h2>
          <p className="text-muted-foreground mb-8">
            Daftar newsletter kami untuk mendapatkan promo eksklusif dan koleksi terbaru.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Alamat email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-background"
              required
            />
            <Button
              type="submit"
              variant="hero"
              size="lg"
              disabled={isLoading}
              className="h-12"
            >
              {isLoading ? "Mendaftar..." : "Daftar"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Dengan mendaftar, Anda setuju dengan kebijakan privasi kami.
          </p>
        </div>
      </div>
    </section>
  );
}
