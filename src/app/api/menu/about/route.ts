import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cache for 5 minutes
export const revalidate = 300;

export async function GET() {
  try {
    // Fetch categories with their items
    const categories = await prisma.menuCategory.findMany({
      where: { active: true },
      include: {
        items: {
          where: { active: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    // Fetch featured content
    const featured = await prisma.featuredContent.findFirst({
      where: { active: true },
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
