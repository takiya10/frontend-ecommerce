# Favicon Setup Instructions

## Current Status
✅ Brand sudah diganti dari "KAZE" ke "Byher" di semua file
✅ Logo (logo.png) sudah di copy ke public folder
✅ Favicon (fav.png) sudah di copy ke public folder dan fav.ico
✅ HTML sudah menggunakan multiple favicon sizes

## Untuk Konversi PNG ke ICO yang Proper

Saat ini `fav.ico` adalah copy dari `fav.png`. Untuk hasil terbaik, konversi ke format ICO proper dengan salah satu cara:

### Option 1: Online Converter (Tercepat)
1. Buka https://www.icoconverter.com/ atau https://favicon.io/
2. Upload `frontend/src/assets/fav.png`
3. Download hasil ICO file
4. Replace `frontend/public/fav.ico` dengan hasil download

### Option 2: Menggunakan ImageMagick (Local)
```bash
cd frontend/public
magick convert fav.png -define icon:auto-resize=256,128,64,48,32,16 fav.ico
```

### Option 3: Menggunakan Sharp (Node.js)
Install sharp terlebih dahulu:
```bash
npm install --save-dev sharp sharp-ico
```

Buat script `scripts/generate-favicon.js`:
```javascript
const sharp = require('sharp');
const ico = require('sharp-ico');
const fs = require('fs');

async function generateFavicon() {
  const sizes = [16, 32, 48, 64];
  const buffers = [];

  for (const size of sizes) {
    const buffer = await sharp('src/assets/fav.png')
      .resize(size, size)
      .toBuffer();
    buffers.push(buffer);
  }

  const icoBuffer = await ico.encode(buffers);
  fs.writeFileSync('public/fav.ico', icoBuffer);
  console.log('✅ Favicon generated successfully!');
}

generateFavicon();
```

Jalankan script:
```bash
node scripts/generate-favicon.js
```

## Files Updated

### HTML & Configuration
- ✅ `frontend/index.html` - Title, meta tags, favicon links
- ✅ `frontend/public/fav.ico` - Favicon file
- ✅ `frontend/public/fav.png` - Favicon PNG version
- ✅ `frontend/public/logo.png` - Logo for Open Graph

### Components
- ✅ `frontend/src/components/layout/Header.tsx` - Brand name (3 locations) + Collaboration names
- ✅ `frontend/src/components/layout/Footer.tsx` - Brand name, email, copyright
- ✅ `frontend/src/components/home/HeroSlider.tsx` - Brand name
- ✅ `frontend/src/pages/Collection.tsx` - Collaboration collection names
- ✅ `frontend/src/pages/StaticPage.tsx` - Multiple brand references

## Brand Changes Summary
- Brand Name: KAZE → **Byher**
- Email: hello@kaze.id → **hello@byher.id**
- Collaboration Names: Kaze x [Name] → **Byher x [Name]**
- URLs: /collections/kaze-x-* → **/collections/byher-x-***

## Testing
Setelah changes, test dengan:
1. `npm run dev`
2. Buka http://localhost:8080
3. Check browser tab - should show "Byher" title and favicon
4. Check all navigation links
5. Check footer brand name
6. Test mobile menu

## Notes
- Modern browsers support PNG as favicon, jadi fav.png sudah cukup
- ICO format lebih kompatibel dengan browser lama (IE, Safari lama)
- Ukuran favicon optimal: 16x16, 32x32, 48x48, 64x64 pixels
- Logo bisa di optimize untuk web menggunakan TinyPNG atau Squoosh
