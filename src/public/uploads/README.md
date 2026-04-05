# Yatırımcı İlişkileri Dosya Yükleme Klasörü

Bu klasör, yatırımcı ilişkileri sayfalarında kullanılacak PDF dosyalarını içerir.

## 📁 Klasör Yapısı

```
/public/uploads/
├── halka-arz/              # Halka Arz Bilgileri PDF'leri
│   ├── sermaye-piyasasi-araci-notu.pdf
│   ├── izahname-ozeti.pdf
│   ├── satis-duyurusu.pdf
│   ├── hukukcu-gorusu.pdf
│   ├── yonetim-kurulu-karari.pdf
│   └── fiyat-tespit-raporu.pdf
│
├── kurumsal-yonetim/       # Kurumsal Yönetim PDF'leri
│   ├── ticaret-sicil.pdf
│   ├── ortaklik-yapisi.pdf
│   ├── imtiyazli-paylar.pdf
│   ├── yonetim-kurulu.pdf
│   ├── komiteler.pdf
│   └── kurumsal-yonetim-ilkeleri.pdf
│
├── uyum-raporlari/         # Uyum Raporları PDF'leri
│   ├── genel-kurul.pdf
│   ├── politikalar.pdf
│   └── esas-sozlesme.pdf
│
└── faaliyet-raporlari/     # Faaliyet Raporları PDF'leri
    ├── 2024-faaliyet-raporu.pdf
    ├── 2023-faaliyet-raporu.pdf
    └── 2022-faaliyet-raporu.pdf
```

## 🔗 PDF Dosyalarını Linkleme

PDF dosyalarını sidebar'dan linklemek için:

```typescript
// InvestorSidebar.tsx içinde
{ 
  title: 'Sermaye Piyasası Aracı Notu', 
  href: '/uploads/halka-arz/sermaye-piyasasi-araci-notu.pdf',
  external: true  // Yeni sekmede açılması için
}
```

## 📝 Dosya İsimlendirme Kuralları

1. **Küçük harf kullanın**: `faaliyet-raporu.pdf` ✅ (FAALIYET-RAPORU.pdf ❌)
2. **Türkçe karakter kullanmayın**: `esas-sozlesme.pdf` ✅ (esas-sözleşme.pdf ❌)
3. **Boşluk yerine tire kullanın**: `yonetim-kurulu.pdf` ✅ (yonetim kurulu.pdf ❌)
4. **Yıl belirtin**: `2024-faaliyet-raporu.pdf` ✅

## 🚀 Kullanım

1. PDF dosyalarınızı ilgili klasöre kopyalayın
2. Dosya ismini yukarıdaki kurallara göre düzenleyin
3. InvestorSidebar.tsx'te ilgili linki güncelleyin
4. Sayfayı test edin

## ⚠️ Önemli Notlar

- Dosya boyutlarını mümkün olduğunca küçük tutun (max 5MB önerilir)
- PDF dosyalarının güvenlik ayarlarını kontrol edin
- Hassas bilgiler içeren dosyaları yüklemeden önce yetkili onayı alın
- Eski raporları arşivlemek için yıl bazlı alt klasörler oluşturabilirsiniz

## 📊 Örnek Link Kullanımı

```typescript
// Halka Arz PDF'i
href: '/uploads/halka-arz/sermaye-piyasasi-araci-notu.pdf'

// Faaliyet Raporu
href: '/uploads/faaliyet-raporlari/2024-faaliyet-raporu.pdf'

// Kurumsal Yönetim
href: '/uploads/kurumsal-yonetim/ticaret-sicil.pdf'
```

---

**Not:** Bu klasör `/public` altında olduğu için, dosyalar doğrudan `/uploads/...` URL'i ile erişilebilir.
