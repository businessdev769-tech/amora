import React, { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';

const Dragon3D = lazy(() => import('./Dragon3D'));

export default function DragonFlameLogo() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const isVisibleRef = useRef(true);
  const burstMultiplierRef = useRef(1.0);
  const isSpinningRef = useRef(false);
  const discRef = useRef(null);
  const mouthRef = useRef(null);

  // Trigger grand entrance on mount: dragon rotates smoothly into homescreen with fire
  const triggerEntrance = useCallback(() => {
    setHasEntered(false);
    setIsSpinning(true);
    isSpinningRef.current = true;
    burstMultiplierRef.current = 2.4;

    const timer1 = setTimeout(() => {
      setHasEntered(true);
      burstMultiplierRef.current = 1.0;
    }, 1500);

    const timer2 = setTimeout(() => {
      setIsSpinning(false);
      isSpinningRef.current = false;
    }, 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    const cleanup = triggerEntrance();
    return cleanup;
  }, [triggerEntrance]);

  // Click or touch to unleash manual flame burst spin
  const triggerBurst = () => {
    if (isSpinningRef.current) return;
    setIsSpinning(true);
    isSpinningRef.current = true;
    setSpinCount(prev => prev + 1);
    burstMultiplierRef.current = 2.6;

    setTimeout(() => {
      burstMultiplierRef.current = 1.0;
      setIsSpinning(false);
      isSpinningRef.current = false;
    }, 1400);
  };

  // Auto-rotate with exact 3-second gap between spins (silent background auto-rotation)
  useEffect(() => {
    if (!hasEntered) return;

    let timeoutId = null;
    let isMounted = true;

    const runAutoSpin = () => {
      timeoutId = setTimeout(() => {
        if (!isMounted) return;

        if (isVisibleRef.current && !document.hidden && !isHovered && !isSpinningRef.current) {
          setIsSpinning(true);
          isSpinningRef.current = true;
          setSpinCount(prev => prev + 1);
          burstMultiplierRef.current = 2.4;

          setTimeout(() => {
            if (!isMounted) return;
            burstMultiplierRef.current = 1.0;
            setIsSpinning(false);
            isSpinningRef.current = false;
            runAutoSpin();
          }, 1400);
        } else {
          timeoutId = setTimeout(runAutoSpin, 1000);
        }
      }, 3000);
    };

    runAutoSpin();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasEntered, isHovered]);

  // 3D tilt tracking on mouse move
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const maxTilt = 10;
    setTilt({
      x: -(y / (rect.height / 2)) * maxTilt,
      y: (x / (rect.width / 2)) * maxTilt
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // High-Performance GPU-Optimized Fire & Dragon Breath Particle Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const size = 520;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { alpha: true });
    const center = size / 2;
    const emblemRadius = 135;
    // Particle canvas overhangs the container by 40px per side (see .dragon-fire-canvas)
    const overhang = 40;
    let containerWidth = containerRef.current ? containerRef.current.offsetWidth : size - overhang * 2;

    const particleCount = 38; // Lightweight count for 60fps+ speed
    const particles = [];

    const firePalettes = [
      '255, 235, 175',
      '255, 195, 75',
      '245, 145, 30',
      '230, 95, 20',
      '255, 120, 30'
    ];

    class FireParticle {
      constructor(isDragonBreath = false) {
        this.reset(true, isDragonBreath);
      }

      reset(init = false, isDragonBreath = false) {
        // Breath comes from the 3D dragon's mouth; until it has loaded (or while its head is behind the logo) emit rim fire
        const mouth = mouthRef.current;
        this.isDragonBreath = isDragonBreath && !!mouth && !mouth.hidden;

        if (this.isDragonBreath) {
          const scale = size / (containerWidth + overhang * 2);
          this.x = (mouth.x + overhang) * scale + (Math.random() - 0.5) * 6;
          this.y = (mouth.y + overhang) * scale + (Math.random() - 0.5) * 6;

          const speed = Math.random() * 2.4 + 1.2;
          this.vx = mouth.dirX * speed + (Math.random() - 0.5) * 1.2;
          this.vy = mouth.dirY * speed - (Math.random() * 1.4 + 0.4);

          this.size = Math.random() * 3.8 + 1.4;
          this.life = init ? Math.random() * 25 : 0;
          this.maxLife = Math.random() * 32 + 18;
          this.rgb = firePalettes[Math.floor(Math.random() * firePalettes.length)];
          this.baseAlpha = Math.random() * 0.8 + 0.3;
        } else {
          // Standard circular emblem rim particles
          this.angle = Math.random() * Math.PI * 2;
          const rOffset = (Math.random() - 0.5) * 32;
          this.r = emblemRadius + rOffset;

          this.x = center + Math.cos(this.angle) * this.r;
          this.y = center + Math.sin(this.angle) * this.r;

          const baseSpeed = Math.random() * 1.5 + 0.7;
          const swirlAngle = this.angle + (Math.PI / 2);

          this.vx = Math.cos(swirlAngle) * (baseSpeed * 0.7) + (Math.cos(this.angle) * (baseSpeed * 0.4));
          this.vy = Math.sin(swirlAngle) * (baseSpeed * 0.7) + (Math.sin(this.angle) * (baseSpeed * 0.4)) - (Math.random() * 1.6 + 0.5);

          this.size = Math.random() * 3.4 + 1.2;
          this.life = init ? Math.random() * 35 : 0;
          this.maxLife = Math.random() * 40 + 25;
          this.rgb = firePalettes[Math.floor(Math.random() * firePalettes.length)];
          this.baseAlpha = Math.random() * 0.7 + 0.25;
        }
      }

      update(multiplier) {
        this.x += this.vx * multiplier;
        this.y += this.vy * multiplier;
        this.vy -= (this.isDragonBreath ? 0.07 : 0.04) * multiplier;
        this.vx *= 0.985;
        this.size *= 0.965;
        this.life += 1 * multiplier;

        if (this.life >= this.maxLife || this.size <= 0.4) {
          this.reset(false, Math.random() < 0.35);
        }
      }

      draw() {
        const progress = this.life / this.maxLife;
        const currentAlpha = Math.max(0, this.baseAlpha * (1 - progress));
        const r = Math.max(0.4, this.size);

        // Fast GPU-friendly additive circle (zero shadowBlur lag)
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.rgb}, ${currentAlpha})`;
        ctx.fill();

        // Inner luminous core for incandescent look
        if (this.size > 2.0) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, r * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 240, ${currentAlpha * 0.8})`;
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new FireParticle(i % 3 === 0));
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    let lastTime = performance.now();
    const render = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isVisibleRef.current && !document.hidden) {
        ctx.clearRect(0, 0, size, size);
        ctx.globalCompositeOperation = 'screen';

        const multiplier = burstMultiplierRef.current;
        if (containerRef.current) containerWidth = containerRef.current.offsetWidth;

        for (let i = 0; i < particles.length; i++) {
          particles[i].update(multiplier);
          particles[i].draw();
        }

        ctx.globalCompositeOperation = 'source-over';
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`dragon-showcase-container ${hasEntered ? 'is-entered' : 'is-entering'}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerBurst}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerBurst(); }}
      aria-label="AMORA Golden Dragon (Rotates smoothly into homescreen with fire; auto-rotates every 3 seconds)"
      style={{
        transform: isHovered && hasEntered && !isSpinning
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.025, 1.025, 1.025)`
          : undefined
      }}
    >
      {/* Background Solar Dragon Fire Aura */}
      <div className={`dragon-fire-aura ${isSpinning ? 'flaring' : ''}`} aria-hidden="true" />

      {/* GPU-Accelerated Golden Fire Energy Rings */}
      <div className={`dragon-conic-ring ring-outer ${isSpinning ? 'spinning-fast' : ''}`} aria-hidden="true" />
      <div className={`dragon-conic-ring ring-inner ${isSpinning ? 'spinning-reverse' : ''}`} aria-hidden="true" />

      {/* 3D Golden Dragon coiling around the logo (passes behind and in front of the disc) */}
      <Suspense fallback={null}>
        <Dragon3D visible={hasEntered} swooping={isSpinning} discRef={discRef} mouthRef={mouthRef} />
      </Suspense>

      {/* Ultra-Fast Fiery Particle Canvas Overlay */}
      <canvas 
        ref={canvasRef} 
        className="dragon-fire-canvas"
        aria-hidden="true" 
      />

      {/* Central Dragon Logo Disc: Rotates & Comes to Homescreen with Fire + 3s Auto-Rotations */}
      <div
        ref={discRef}
        className={`dragon-emblem-disc ${!hasEntered ? 'animating-entrance' : ''} ${isSpinning && hasEntered ? 'burst-spinning' : ''}`}
      >
        <img
          className="hero-logo dragon-image"
          src="/assets/amora-logo.jpg"
          alt="AMORA gold dragon emblem"
          loading="eager"
        />

        {/* Fiery Golden Edge Glow Ring */}
        <div className="dragon-rim-light" aria-hidden="true" />

        {/* Shockwave ripple when dragon arrives or bursts */}
        {(hasEntered || isSpinning) && (
          <div 
            key={`wave-${spinCount}`} 
            className={`dragon-shockwave ${isSpinning ? 'active-shockwave' : ''}`} 
            aria-hidden="true" 
          />
        )}
      </div>

      {/* Floating Orbit Badges (No explicit button words) */}
      <span className={`orbit-tag tag-one ${hasEntered ? 'tag-visible' : 'tag-hidden'}`}>
        Custom AI Engineering
      </span>
      <span className={`orbit-tag tag-two ${hasEntered ? 'tag-visible' : 'tag-hidden'}`}>
        Built around your needs
      </span>
    </div>
  );
}
