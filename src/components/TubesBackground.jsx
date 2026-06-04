import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// Helper for random colors
const randomColors = (count) => {
  return new Array(count)
    .fill(0)
    .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
};

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true 
}) {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const tubesRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    let cleanup;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        // Load the TubesCursor module dynamically from CDN
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        const TubesCursor = module.default;

        if (!mounted) return;

        // Initialize the Tubes cursor
        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#f967fb", "#53bc28", "#6958d5"],
            lights: {
              intensity: 200,
              colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
            }
          }
        });

        // Intercept the animation render loop to force the sleep/idle infinity loop path
        if (app && app.three && app.tubes) {
          app.three.onBeforeRender = function(e) {
            // Get screen-scale factor
            const t = app.three.size.wWidth / app.three.size.width;
            
            // Get dimensions and speeds from options or use defaults from the library
            const sleepRadiusX = app.options.sleepRadiusX !== undefined ? app.options.sleepRadiusX : 300;
            const sleepRadiusY = app.options.sleepRadiusY !== undefined ? app.options.sleepRadiusY : 150;
            const sleepTimeScale1 = app.options.sleepTimeScale1 !== undefined ? app.options.sleepTimeScale1 : 1;
            const sleepTimeScale2 = app.options.sleepTimeScale2 !== undefined ? app.options.sleepTimeScale2 : 2;

            // Apply infinity loop mathematical equations directly
            app.tubes.target.x = sleepRadiusX * t * Math.cos(e.elapsed * sleepTimeScale1);
            app.tubes.target.y = sleepRadiusY * t * Math.sin(e.elapsed * sleepTimeScale2);

            // Trigger geometry rendering updates
            app.tubes.update(e);
          };
        }

        tubesRef.current = app;
        setIsLoaded(true);

        cleanup = () => {
          if (app && typeof app.dispose === 'function') {
            app.dispose();
          }
        };

      } catch (error) {
        console.error("Failed to load TubesCursor:", error);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;
    
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    
    if (tubesRef.current.tubes && typeof tubesRef.current.tubes.setColors === 'function') {
      tubesRef.current.tubes.setColors(colors);
    }
    if (tubesRef.current.tubes && typeof tubesRef.current.tubes.setLightsColors === 'function') {
      tubesRef.current.tubes.setLightsColors(lightsColors);
    }
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#04101c'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          touchAction: 'none',
          pointerEvents: 'none' // Block direct mouse events on canvas
        }}
      />
      
      {/* Content Overlay */}
      <div 
        className={cn("relative z-10 w-full h-full", className)}
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%'
        }}
        onClick={handleClick}
      >
        {children}
      </div>
    </div>
  );
}

export default TubesBackground;
