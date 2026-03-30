import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering - don't try to generate at build time
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch categories with their items
    const categories = await prisma.menuCategory.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    // Fetch featured content
    const featured = await prisma.featuredContent.findFirst({
      where: { isActive: true },
    });

    // Transform data to match frontend structure
    const response = {
      categories: categories.map((cat) => ({
        id: cat.id,
        title: cat.title,
        slug: cat.slug,
        icon: cat.icon,
        items: cat.items.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          link: item.link,
        })),
      })),
      featured: featured
        ? {
            image: featured.image,
            title: featured.title,
            description: featured.description,
            buttonText: featured.buttonText,
            buttonLink: featured.buttonLink,
          }
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu data' },
      { status: 500 }
    );
  }
}
