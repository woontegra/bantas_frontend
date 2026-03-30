# Metal Ambalaj Kurumsal Web Sitesi

Modern ve premium bir kurumsal web sitesi - UYAP benzeri hero layout ile tasarlanmıştır.

## Özellikler

### 🎨 Tasarım
- **UYAP-benzeri Hero Layout**: Sol içerik, sağ dairesel görsel
- **Gradient Arka Plan**: Yeşil → Mavi geçişli, blur ve glow efektleri
- **Premium Görünüm**: Modern, kurumsal ve profesyonel

### 🚀 Bileşenler

#### Sol Alan
- Güçlü başlık ve açıklama
- Özellik listesi (Üretim Sürecimiz, Ürün Grupları, Sürdürülebilirlik)
- CTA butonu (Kurumsal Tanıtım)

#### Sağ Alan
- Büyük dairesel görsel alanı
- Metal ambalaj görseli (placeholder)
- Glow ve shadow efektleri
- Pulse animasyonu

#### Üst Sağ
- Müşteri Girişi butonu
- Bayi Portalı butonu
- Outline stil, hover glow efekti

#### Alt Floating İkonlar
- 5 adet yuvarlak ikon (Üretim, Kalite, İhracat, Teknoloji, Sürdürülebilirlik)
- Hover: Yukarı kalkma animasyonu
- Shadow artışı
- Tooltip gösterimi

### 🎭 Animasyonlar
- Pulse animasyonu (dairesel görsel)
- Float animasyonu (yukarı-aşağı hareket)
- Hover transformasyonları
- Smooth transitions

### 📱 Responsive
- Desktop-first tasarım
- Tablet ve mobil uyumlu grid sistemi
- Esnek layout yapısı

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Production sunucusunu başlat
npm start
```

## Teknolojiler

- **Next.js 14**: React framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Modern icon library

## Geliştirme

Sunucu `http://localhost:3000` adresinde çalışacaktır.

Ana sayfa: `src/app/page.tsx`

## Özelleştirme

### Görseli Değiştirme
`src/app/page.tsx` dosyasında dairesel alan içindeki placeholder'ı gerçek metal ambalaj görseli ile değiştirin:

```tsx
<img src="/metal-can.png" alt="Metal Ambalaj" className="w-full h-full object-cover" />
```

### Renkleri Değiştirme
`tailwind.config.js` ve `globals.css` dosyalarından gradient ve glow renklerini özelleştirin.

### İçerikleri Güncelleme
`src/app/page.tsx` içindeki metin içeriklerini ihtiyacınıza göre düzenleyin.

## Lisans

Özel proje - Tüm hakları saklıdır.
