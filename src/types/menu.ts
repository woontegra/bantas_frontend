export interface MenuItem {
  id: string;
  title: string;
  slug: string;
  link: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  slug: string;
  icon?: string | null;
  items: MenuItem[];
}

export interface FeaturedContent {
  image?: string | null;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface MenuData {
  categories: MenuCategory[];
  featured: FeaturedContent | null;
}
