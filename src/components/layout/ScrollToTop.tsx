import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Memaksa browser untuk scroll ke paling atas (0,0) setiap kali halaman berpindah
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Gunakan "instant" agar tidak ada jeda animasi saat pindah halaman
    });
  }, [pathname]);

  return null; // Komponen ini tidak merender apapun ke layar
}
