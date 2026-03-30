'use client';

export default function IntroText() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[600px] mx-auto text-center space-y-4 sm:space-y-5 md:space-y-6">
          {/* Small Title */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-normal text-gray-900">
            Bantaş Teneke Ambalaj Çözümleri
          </h2>

          {/* Description */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base font-light text-gray-600 leading-relaxed">
              1993 yılından bu yana metal ambalaj sektöründe faaliyet gösteren Bantaş, 
              yüksek kalite standartları ve müşteri memnuniyeti odaklı hizmet anlayışıyla 
              sektörde öncü konumdadır.
            </p>
            <p className="text-sm sm:text-base font-light text-gray-600 leading-relaxed">
              Zeytin, peynir, yağ ve diğer gıda ürünleri için özel tasarım metal ambalaj 
              çözümleri sunarak, ürünlerinizin güvenli ve estetik bir şekilde muhafaza 
              edilmesini sağlıyoruz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
