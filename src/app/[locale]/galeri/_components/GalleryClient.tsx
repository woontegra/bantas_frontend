"use client";

import {
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { mediaUrl } from "@/lib/api";
import type { GalleryImage, GalleryFeatured } from "@/lib/api";

interface DisplayImage {
  id: string;
  src: string;
  title: string;
  description?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function GalleryClient() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<DisplayImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<DisplayImage[]>([]);
  const [featured, setFeatured] = useState<GalleryFeatured | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [rawImages, featuredData] = await Promise.all([
        fetch(`${API_URL}/api/gallery/images`)
          .then((r) => r.json())
          .catch(() => []) as Promise<GalleryImage[]>,
        fetch(`${API_URL}/api/gallery-featured/type/management_board`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null) as Promise<GalleryFeatured | null>,
      ]);

      const transformed: DisplayImage[] = rawImages.map((img) => ({
        id: img.id,
        src: mediaUrl(img.image),
        title: img.title || "Resim",
        description: img.description,
      }));

      setImages(transformed);
      setFeatured(featuredData);
      setLoading(false);
    }

    load();
  }, []);

  const openLightbox = (image: DisplayImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = "unset";
  }, []);

  const nextImage = useCallback(() => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  }, [currentIndex, images]);

  const prevImage = useCallback(() => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  }, [currentIndex, images]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextImage();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, nextImage, prevImage, closeLightbox]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 py-16 text-white">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-4 flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-blue-400" />
            <span className="text-sm font-light uppercase tracking-wider text-blue-400">
              Görsel Galeri
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-light md:text-5xl">Galeri</h1>
          <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-300">
            Fabrikamız, üretim süreçlerimiz ve etkinliklerimizden görüntüler
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Featured management board */}
        {featured && (
          <div className="mb-12">
            <div className="mx-auto max-w-3xl">
              <div className="overflow-hidden rounded-2xl border-4 border-gray-800 bg-white shadow-xl">
                <img
                  src={mediaUrl(featured.image)}
                  alt={featured.title}
                  className="h-auto w-full"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="mt-6 text-center">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {featured.title}
                </h3>
                {featured.description && (
                  <p className="text-sm text-gray-600">{featured.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {/* ── Gallery grid ── */}
        {!loading && images.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                onClick={() => openLightbox(image, index)}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-200 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1565793993-8ace9f0a80fb?w=400&h=400&fit=crop";
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-semibold text-white">
                      {image.title}
                    </h3>
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <ImageIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && images.length === 0 && (
          <div className="py-20 text-center">
            <Grid3x3 className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Henüz Görsel Yok
            </h3>
            <p className="text-gray-600">
              Galeri görselleri admin panelinden eklenebilir.
            </p>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4">
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="w-full max-w-6xl">
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="max-h-[85vh] w-full rounded-lg object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1565793993-8ace9f0a80fb?w=800&h=600&fit=crop";
              }}
            />
            <div className="mt-4 text-center">
              <h3 className="mb-2 text-xl font-semibold text-white">
                {selectedImage.title}
              </h3>
              {selectedImage.description && (
                <p className="mb-3 text-sm text-gray-300">
                  {selectedImage.description}
                </p>
              )}
              <span className="text-sm text-gray-400">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-400">
            ← → tuşları ile gezinebilirsiniz
          </div>
        </div>
      )}
    </div>
  );
}
