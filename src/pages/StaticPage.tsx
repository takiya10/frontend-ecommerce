import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type StaticSection = {
  title: string;
  body: string[];
};

type StaticPageContent = {
  title: string;
  subtitle?: string;
  sections: StaticSection[];
};

const staticPages: Record<string, StaticPageContent> = {
  "cara-order": {
    title: "Cara Order",
    subtitle: "Langkah mudah belanja di Byher",
    sections: [
      {
        title: "Pilih Produk",
        body: [
          "Telusuri koleksi, pilih warna dan ukuran yang kamu inginkan.",
          "Klik Tambah ke Keranjang untuk menyimpan pilihan.",
        ],
      },
      {
        title: "Checkout",
        body: [
          "Masuk ke halaman Keranjang lalu isi alamat pengiriman.",
          "Pilih metode pengiriman dan pembayaran yang tersedia.",
        ],
      },
      {
        title: "Konfirmasi",
        body: [
          "Periksa kembali detail pesanan sebelum bayar.",
          "Setelah pembayaran sukses, pesanan segera diproses.",
        ],
      },
    ],
  },
  pengiriman: {
    title: "Pengiriman",
    subtitle: "Informasi estimasi dan biaya kirim",
    sections: [
      {
        title: "Estimasi",
        body: [
          "Estimasi pengiriman 2-5 hari kerja tergantung lokasi.",
          "Nomor resi akan dikirim setelah paket diproses.",
        ],
      },
      {
        title: "Biaya",
        body: [
          "Biaya pengiriman mengikuti tarif kurir.",
          "Gratis ongkir bisa berlaku pada promo tertentu.",
        ],
      },
    ],
  },
  pengembalian: {
    title: "Pengembalian",
    subtitle: "Kebijakan retur dan penukaran",
    sections: [
      {
        title: "Syarat Retur",
        body: [
          "Produk belum dipakai dan masih dalam kondisi asli.",
          "Retur dilakukan maksimal 7 hari setelah diterima.",
        ],
      },
      {
        title: "Proses Retur",
        body: [
          "Hubungi tim Byher terlebih dahulu sebelum mengirim.",
          "Lampirkan bukti pembelian untuk verifikasi.",
        ],
      },
    ],
  },
  faq: {
    title: "FAQ",
    subtitle: "Pertanyaan yang sering diajukan",
    sections: [
      {
        title: "Apakah stok selalu update?",
        body: [
          "Status stok diperbarui secara berkala di halaman koleksi.",
        ],
      },
      {
        title: "Bagaimana cara melacak pesanan?",
        body: [
          "Nomor resi akan dikirim setelah pesanan diproses.",
        ],
      },
    ],
  },
  kontak: {
    title: "Hubungi Kami",
    subtitle: "Tim Byher siap membantu",
    sections: [
      {
        title: "Customer Support",
        body: [
          "Email: hello@byher.id",
          "Telepon: +62 812-3456-7890",
          "Jam layanan: Senin - Jumat, 09:00 - 18:00 WIB",
        ],
      },
    ],
  },
  "tentang-kami": {
    title: "Tentang Byher",
    subtitle: "Modest fashion yang berkelas",
    sections: [
      {
        title: "Cerita Kami",
        body: [
          "Byher menghadirkan modest fashion modern untuk wanita Indonesia.",
          "Fokus kami adalah kualitas premium dengan desain yang nyaman.",
        ],
      },
    ],
  },
  karir: {
    title: "Karir",
    subtitle: "Bergabung dengan Byher",
    sections: [
      {
        title: "Kesempatan",
        body: [
          "Kami selalu mencari talenta baru untuk berkembang bersama.",
          "Kirim CV dan portofolio ke hello@byher.id.",
        ],
      },
    ],
  },
  privasi: {
    title: "Kebijakan Privasi",
    subtitle: "Perlindungan data pelanggan",
    sections: [
      {
        title: "Data Pribadi",
        body: [
          "Kami menjaga data pelanggan dan tidak membagikannya tanpa izin.",
          "Data digunakan untuk pemrosesan transaksi dan layanan.",
        ],
      },
    ],
  },
  "syarat-ketentuan": {
    title: "Syarat & Ketentuan",
    subtitle: "Ketentuan penggunaan layanan",
    sections: [
      {
        title: "Penggunaan Layanan",
        body: [
          "Dengan menggunakan situs Byher, Anda setuju pada ketentuan yang berlaku.",
          "Syarat dapat berubah sewaktu-waktu tanpa pemberitahuan.",
        ],
      },
    ],
  },
};

export default function StaticPage() {
  const { slug } = useParams();
  const content = useMemo(() => staticPages[slug || ""], [slug]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto py-12 lg:py-16">
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
              {content?.title || "Halaman"}
            </h1>
            {content?.subtitle && (
              <p className="mt-2 text-muted-foreground">{content.subtitle}</p>
            )}
          </div>

          {content ? (
            <div className="mt-8 grid gap-6">
              {content.sections.map((section) => (
                <section key={section.title} className="rounded-xl border border-border bg-background p-6">
                  <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {section.body.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className="mt-8 text-muted-foreground">
              Konten sedang disiapkan.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
