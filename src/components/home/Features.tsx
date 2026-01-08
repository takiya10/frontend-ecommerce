import { Truck, RotateCcw, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Gratis Ongkir",
    description: "Untuk pembelian min. Rp500.000",
  },
  {
    icon: RotateCcw,
    title: "Gratis Pengembalian",
    description: "30 hari pengembalian mudah",
  },
  {
    icon: Shield,
    title: "Pembayaran Aman",
    description: "100% transaksi terlindungi",
  },
  {
    icon: Headphones,
    title: "Customer Service",
    description: "Siap membantu 24/7",
  },
];

export function Features() {
  return (
    <section className="py-12 border-y border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent mb-3">
                <feature.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
