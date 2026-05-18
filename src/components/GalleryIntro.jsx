import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import "../styles/GalleryIntro.css";
import "../styles/pages.css"; // For page-hero styles

const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({ src, index, phase, target }) {
    return (
        <motion.div
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            className="flip-card-wrapper"
        >
            <motion.div
                className="flip-card-inner"
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            >
                <div className="flip-card-front">
                    <img src={src} alt={`gallery-${index}`} />
                    <div className="flip-card-overlay" />
                </div>
            </motion.div>
        </motion.div>
    );
}



const lerp = (start, end, t) => start * (1 - t) + end * t;
const MAX_SCROLL = 3000;

export default function GalleryIntro({ images = [] }) {
    const [introPhase, setIntroPhase] = useState("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);
    
    // Tile the available gallery images up to 20 for a dense circle
    const displayImages = images.length > 0 
        ? Array.from({ length: 20 }, (_, i) => images[i % images.length]) 
        : [];
    const TOTAL_IMAGES = Math.max(displayImages.length, 1);

    useEffect(() => {
        if (!containerRef.current) return;
        const handleResize = (entries) => {
            for (const entry of entries) {
                setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
            }
        };
        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);
        setContainerSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
        return () => observer.disconnect();
    }, []);

    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleWheel = (e) => {
            const isScrollingDown = e.deltaY > 0;
            const atBottom = scrollRef.current >= MAX_SCROLL;
            const atTop = scrollRef.current <= 0;
            
            // Do not trap user from scrolling the actual page if they reach bounds
            if ((isScrollingDown && atBottom) || (!isScrollingDown && atTop)) {
                return;
            }
            e.preventDefault();
            const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };
        
        let touchStartY = 0;
        const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
        const handleTouchMove = (e) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;
            
            const isScrollingDown = deltaY > 0;
            const atBottom = scrollRef.current >= MAX_SCROLL;
            const atTop = scrollRef.current <= 0;
            
            if ((isScrollingDown && atBottom) || (!isScrollingDown && atTop)) {
                return;
            }
            e.preventDefault();
            const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };
        
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: false });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });
        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [virtualScroll]);

    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });
    const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    const scatterPositions = useMemo(() => {
        return displayImages.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, [displayImages]);

    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => { unsubscribeMorph(); unsubscribeRotate(); unsubscribeParallax(); };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    return (
        <div ref={containerRef} className="gallery-intro-container page-hero" style={{ minHeight: "100vh", padding: 0 }}>
            <Link to="/" className="page-hero-back" style={{ zIndex: 50 }}>← Back to Home</Link>
            
            <div className="gallery-intro-perspective">
                
                {/* Intro Text - Disappears */}
                <div className="gallery-intro-text-wrapper">
                    <motion.div
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                    >
                        <span className="page-hero-tag" style={{ color: "#6DBE45" }}>Event Gallery</span>
                        <h1 className="gallery-intro-h1" style={{ marginBottom: "20px" }}>
                            Moments That<br />
                            <em>Define ProSummits</em>
                        </h1>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 0.5 - morphValue } : { opacity: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="gallery-intro-p"
                    >
                        SCROLL TO EXPLORE
                    </motion.p>
                </div>

                {/* Arc Active Content - Appears */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="gallery-intro-active-content"
                >
                    <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "#fff", marginBottom: "1rem" }}>
                        Explore Our Gallery
                    </h2>
                    <p className="page-hero-desc">
                        A visual journey through our global conferences, showcasing world-class
                        speakers, interactive sessions, and impactful moments.
                    </p>
                </motion.div>

                {/* Animated Images */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "auto" }}>
                        {displayImages.slice(0, TOTAL_IMAGES).map((src, i) => {
                            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };
                            
                            if (introPhase === "scatter") {
                                target = scatterPositions[i];
                            } else if (introPhase === "line") {
                                const lineSpacing = 70;
                                const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                                const lineX = i * lineSpacing - lineTotalWidth / 2;
                                target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                            } else {
                                const isMobile = containerSize.width < 768;
                                const minDimension = Math.min(containerSize.width, containerSize.height);
                                
                                const circleRadius = Math.min(minDimension * 0.45, 450);
                                const circleAngle = (i / TOTAL_IMAGES) * 360;
                                const circleRad = (circleAngle * Math.PI) / 180;
                                const circlePos = {
                                    x: Math.cos(circleRad) * circleRadius,
                                    y: Math.sin(circleRad) * circleRadius,
                                    rotation: circleAngle + 90,
                                };

                                const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                                const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
                                const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                                const arcCenterY = arcApexY + arcRadius;
                                const spreadAngle = isMobile ? 100 : 130;
                                const startAngle = -90 - (spreadAngle / 2);
                                const step = spreadAngle / (TOTAL_IMAGES - 1);
                                
                                const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
                                const maxRotation = spreadAngle * 0.8;
                                const boundedRotation = -scrollProgress * maxRotation;
                                
                                const currentArcAngle = startAngle + (i * step) + boundedRotation;
                                const arcRad = (currentArcAngle * Math.PI) / 180;

                                const arcPos = {
                                    x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                    y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                    rotation: currentArcAngle + 90,
                                    scale: isMobile ? 1.4 : 1.8,
                                };

                                target = {
                                    x: lerp(circlePos.x, arcPos.x, morphValue),
                                    y: lerp(circlePos.y, arcPos.y, morphValue),
                                    rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                    scale: lerp(1, arcPos.scale, morphValue),
                                    opacity: 1,
                                };
                            }

                            return <FlipCard key={i} src={src} index={i} phase={introPhase} target={target} />;
                        })}
                    </div>
                </div>
                
                {/* Initial Scroll Indicator */}
                <motion.div 
                    className="scroll-indicator" 
                    initial={{ opacity: 0 }}
                    animate={introPhase === "circle" && morphValue < 0.1 ? { opacity: 0.6 } : { opacity: 0 }}
                    style={{ pointerEvents: "none" }}
                >
                  <div className="mouse">
                    <div className="wheel"></div>
                  </div>
                  <span className="scroll-text">View Gallery</span>
                </motion.div>
                
            </div>
        </div>
    );
}
