import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@bantas.com' },
    update: {},
    create: {
      email: 'admin@bantas.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create menu categories
  const categories = [
    { title: 'Tarihçe', slug: 'tarihce', icon: 'History', order: 1 },
    { title: 'Teknoloji', slug: 'teknoloji', icon: 'Cpu', order: 2 },
    { title: 'Kalite Belgelerimiz', slug: 'kalite', icon: 'FileText', order: 3 },
    { title: 'Politikalarımız', slug: 'politikalar', icon: 'FileText', order: 4 },
    { title: 'İnsan Kaynakları', slug: 'ik', icon: 'Users', order: 5 },
    { title: 'Sosyal Sorumluluk', slug: 'sosyal', icon: 'Heart', order: 6 },
    { title: 'Sürdürülebilirlik İlkelerimiz', slug: 'surdurulebilirlik', icon: 'Leaf', order: 7 },
  ];

  for (const cat of categories) {
    await prisma.menuCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Menu categories created');

  // Create menu items for Politikalarımız
  const politikalarCategory = await prisma.menuCategory.findUnique({
    where: { slug: 'politikalar' },
  });

  if (politikalarCategory) {
    const items = [
      { title: 'Bilgi Güvenliği Politikası', slug: 'bilgi-guvenlik', link: '#bilgi-guvenlik', order: 1 },
      { title: 'Gıda Güvenliği Politikası', slug: 'gida-guvenlik', link: '#gida-guvenlik', order: 2 },
      { title: 'İnsan Kaynakları Politikası', slug: 'ik-politika', link: '#ik-politika', order: 3 },
      { title: 'İş Sağlığı Güvenliği Politikası', slug: 'is-sagligi', link: '#is-sagligi', order: 4 },
      { title: 'Kalite Politikası', slug: 'kalite-politika', link: '#kalite-politika', order: 5 },
      { title: 'Kişisel Veri Saklama ve İmha Politikası', slug: 'veri-saklama', link: '#veri-saklama', order: 6 },
      { title: 'Kişisel Verilerin Korunması ve İşlenmesi Politikası', slug: 'kvkk-islenme', link: '#kvkk-islenme', order: 7 },
      { title: 'Web Sitesi Aydınlatma Politikası', slug: 'aydinlatma', link: '#aydinlatma', order: 8 },
      { title: 'KVKK – Başvuru Formu', slug: 'kvkk-basvuru', link: '#kvkk-basvuru', order: 9 },
    ];

    for (const item of items) {
      await prisma.menuItem.create({
        data: {
          ...item,
          categoryId: politikalarCategory.id,
        },
      });
    }
    console.log('✅ Menu items created for Politikalarımız');
  }

  // Create featured content
  await prisma.featuredContent.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      title: '30+ yıllık',
      description: 'üretim tecrübesi',
      buttonText: 'Detayları İncele',
      buttonLink: '#hakkimizda',
    },
  });
  console.log('✅ Featured content created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
