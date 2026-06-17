import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { client, urlFor } from "../lib/sanity";
import "../styles/Gallery.css";

import {
  ContainerScroll,
  BentoGrid,
  BentoCell,
  ContainerScale,
} from "./ui/hero-gallery-scroll-animation";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeGallery = async () => {
      try {
        // Fetch all gallery documents and combine their images
        const data = await client.fetch(`*[_type == "gallery"] | order(_createdAt desc) { images }`);

        let allImages = [];
        if (data?.length) {
          allImages = data.flatMap((doc) => doc.images || []);
        }

        if (allImages.length > 0) {
          // Shuffle and take 5 for the scroll bento grid
          const shuffled = [...allImages]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);
          setImages(shuffled);
        } else {
          // Unsplash fallbacks if CMS is empty (5 images)
          setImages([
            { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800" },
            { url: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?q=80&w=800" },
            { url: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=800" },
            { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800" },
            { url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=800" }
          ]);
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
        // Unsplash fallbacks on error
        setImages([
          { url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800" },
          { url: "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?q=80&w=800" },
          { url: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?q=80&w=800" },
          { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800" },
          { url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=800" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeGallery();
  }, []);

  return (
    <section className="gallery-sec" id="gallery" style={{ padding: 0 }}>
      {loading ? (
        <div className="gallery-loading" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="gallery-loader" />
        </div>
      ) : (
        <ContainerScroll className="h-[350vh]">
          {/* Scroll Bento Grid containing the dynamic images with higher z-index (z-20) */}
          <BentoGrid className="sticky left-0 top-0 z-20 h-screen w-full p-4">
            {images.map((img, index) => {
              const src = img.image?.asset?._ref
                ? urlFor(img.image).width(800).url()
                : img.url;
              return (
                <BentoCell
                  key={index}
                  className="overflow-hidden rounded-xl shadow-xl"
                >
                  <img
                    className="size-full object-cover object-center"
                    src={src}
                    alt={img.caption || "ProSummits Event"}
                  />
                </BentoCell>
              );
            })}

            {/* 
              ContainerScale is placed INSIDE BentoGrid as a child!
              Its position is always absolute so it is centered inside the sticky grid viewport.
              This keeps it 100% visible on scroll-in, and lets bento cells overlay it perfectly!
            */}
            <ContainerScale className="z-10 text-center" style={{ pointerEvents: "auto" }}>
              <span className="section-tag" style={{ color: "#F47B20", letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "600" }}>
                Visual Journey
              </span>
              <h1 className="max-w-xl text-5xl font-bold tracking-tighter text-white" style={{ fontFamily: "var(--fd)", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", margin: "16px 0", fontStyle: "normal" }}>
                Conference <em style={{ color: "#F9C515", fontStyle: "italic" }}>Moments</em>
              </h1>
              <p className="my-6 max-w-xl text-sm text-slate-300 md:text-base" style={{ lineHeight: "1.7", color: "rgba(255,255,255,0.75)" }}>
                Capturing the energy, innovation, and connections that make our global summits unforgettable. 
                Scroll down to watch our gallery expand and reveal the visual memories of our summits.
              </p>
              <div className="flex items-center justify-center gap-4" style={{ marginTop: "24px" }}>
                <Link to="/gallery" className="btn-g" style={{ background: "linear-gradient(135deg, #7B2FBE, #E01F5C)", textDecoration: "none" }}>
                  View Full Gallery
                </Link>
              </div>
            </ContainerScale>
          </BentoGrid>
        </ContainerScroll>
      )}
    </section>
  );
}
