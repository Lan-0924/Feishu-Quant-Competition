import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// ── Order Book Background Canvas ────────────────────────────
function OrderBookBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Use type assertion — both checks already guard above
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let raf: number;
    const cv = canvas; // capture stable reference for closures

    const resize = () => {
      cv.width  = cv.offsetWidth;
      cv.height = cv.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const N_LEVELS = 12;
    const TICK = 0.5;
    let midPrice = 100;
    let t = 0;

    // Bid volumes: higher at inside, decreasing outward
    const bidVol = Array.from({ length: N_LEVELS }, (_, i) => 20 + Math.random() * 80 - i * 4);
    const askVol = Array.from({ length: N_LEVELS }, (_, i) => 20 + Math.random() * 80 - i * 4);
    const bidTarget = [...bidVol];
    const askTarget = [...askVol];

    function update() {
      t++;
      // Drift mid price
      if (t % 40 === 0) midPrice += (Math.random() - 0.5) * TICK;

      // Randomly update volume targets
      for (let i = 0; i < N_LEVELS; i++) {
        if (Math.random() < 0.04) bidTarget[i] = Math.max(2, 20 + Math.random() * 80 - i * 5);
        if (Math.random() < 0.04) askTarget[i] = Math.max(2, 20 + Math.random() * 80 - i * 5);
      }
      // Smooth toward targets
      for (let i = 0; i < N_LEVELS; i++) {
        bidVol[i] += (bidTarget[i] - bidVol[i]) * 0.07;
        askVol[i] += (askTarget[i] - askVol[i]) * 0.07;
      }
    }

    function draw() {
      const W = cv.width;
      const H = cv.height;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const rowH = Math.min(28, H / (N_LEVELS * 2.5));
      const startY = H / 2 - rowH * N_LEVELS / 2;
      const maxBarW = cx * 0.42;
      const maxVol = 100;

      // Draw bid levels (left side, teal)
      for (let i = 0; i < N_LEVELS; i++) {
        const y = startY + i * rowH + rowH * 0.1;
        const rh = rowH * 0.8;
        const barW = (bidVol[i] / maxVol) * maxBarW;
        const alpha = 0.04 + (1 - i / N_LEVELS) * 0.08;
        ctx.fillStyle = `rgba(46,164,79,${alpha})`;
        ctx.fillRect(cx - barW, y, barW, rh);

        // Price label
        const price = midPrice - (i + 0.5) * TICK;
        ctx.font = `${Math.max(8, rowH * 0.45)}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = `rgba(46,164,79,${0.15 + (1 - i / N_LEVELS) * 0.2})`;
        ctx.textAlign = 'right';
        ctx.fillText(price.toFixed(2), cx - barW - 6, y + rh * 0.65);
      }

      // Draw ask levels (right side, red)
      for (let i = 0; i < N_LEVELS; i++) {
        const y = startY + i * rowH + rowH * 0.1;
        const rh = rowH * 0.8;
        const barW = (askVol[i] / maxVol) * maxBarW;
        const alpha = 0.04 + (1 - i / N_LEVELS) * 0.08;
        ctx.fillStyle = `rgba(201,64,64,${alpha})`;
        ctx.fillRect(cx, y, barW, rh);

        const price = midPrice + (i + 0.5) * TICK;
        ctx.font = `${Math.max(8, rowH * 0.45)}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = `rgba(201,64,64,${0.15 + (1 - i / N_LEVELS) * 0.2})`;
        ctx.textAlign = 'left';
        ctx.fillText(price.toFixed(2), cx + barW + 6, y + rh * 0.65);
      }

      // Spread line
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.beginPath();
      ctx.moveTo(cx, startY - 8);
      ctx.lineTo(cx, startY + N_LEVELS * rowH + 8);
      ctx.stroke();
      ctx.setLineDash([]);

      // Mid price label
      ctx.font = `${Math.max(9, rowH * 0.5)}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.textAlign = 'center';
      ctx.fillText(midPrice.toFixed(2), cx, startY - 14);
    }

    function loop() {
      update();
      draw();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-40"
      style={{ zIndex: 0 }}
    />
  );
}

// ── Hero Metric ──────────────────────────────────────────────
function HeroMetric({ label, value, note, positive, negative, delay }:
  { label: string; value: string; note?: string; positive?: boolean; negative?: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: delay ?? 0 }}
      className="text-center"
    >
      <p className="metric-label mb-2">{label}</p>
      <p className={`metric-display ${positive ? 'pos' : negative ? 'neg' : 'text-[var(--text)]'}`}>{value}</p>
      {note && <p className="font-mono text-[0.62rem] text-[var(--text-3)] mt-1">{note}</p>}
    </motion.div>
  );
}

// ── Main Hero ────────────────────────────────────────────────
export function S1_Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <OrderBookBg />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_0%,rgba(7,11,18,0.85)_100%)]" style={{ zIndex: 1 }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Publication header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 flex items-center gap-3"
        >
          <span className="font-mono text-[0.65rem] text-[var(--text-3)] tracking-widest uppercase">Feishu Quant Competition 2026</span>
          <span className="text-[var(--text-3)]">·</span>
          <span className="font-mono text-[0.65rem] text-[var(--blue)] tracking-widest">Team T025</span>
          <span className="text-[var(--text-3)]">·</span>
          <span className="font-mono text-[0.65rem] text-[var(--text-3)] tracking-widest">June 2026</span>
        </motion.div>

        {/* Paper title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.3 }}
          className="font-serif text-4xl md:text-6xl font-medium leading-tight max-w-3xl mb-4"
          style={{ letterSpacing: '-0.01em', fontFamily: 'EB Garamond, Georgia, serif' }}
        >
          A Defensive Short-Horizon Reversal Strategy with Order-Book Microstructure
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-[var(--text-2)] text-lg mb-2 font-light"
        >
          for Long-Only A-Share Portfolios
        </motion.p>

        {/* Abstract excerpt */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-[var(--text-3)] text-sm leading-relaxed max-w-xl mb-12 font-mono"
        >
          The key design principle is ensembling for diversification: rather than stacking correlated
          factors to maximize raw IC, we blend a weak but decorrelated ML signal into a robust base composite.
        </motion.p>

        {/* Key result equation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="mb-14 px-6 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] font-mono text-sm text-[var(--text-2)]"
        >
          <span className="text-[var(--teal)] font-semibold">Finalpha</span>
          <span className="text-[var(--text-3)]"> = </span>
          <span className="text-[var(--blue)]">0.8</span>
          <span> × z(BaseAlpha_res) </span>
          <span className="text-[var(--text-3)]">+</span>
          <span className="text-[var(--purple)]"> 0.2</span>
          <span> × z(ridge5d)</span>
        </motion.div>

        {/* OOS metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-6">
          <HeroMetric label="OOS CAGR"   value="+17.64%" note="D485–D726 · ≈1 year"  positive delay={0.9} />
          <HeroMetric label="Sharpe"     value="1.00"    note="Out-of-sample"         positive delay={1.0} />
          <HeroMetric label="Max DD"     value="−10.18%" note="Shallow vs IS −12.32%" negative delay={1.1} />
          <HeroMetric label="Final NAV"  value="¥58.44M" note="From ¥50M cold start"  positive delay={1.2} />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="font-mono text-[0.65rem] text-[var(--text-3)] tracking-widest"
        >
          IS: CAGR +17.26% · Sharpe 1.42 · MaxDD −12.32% · ¥67.88M (≈1.9y, D080–D484)
        </motion.p>

        {/* Scroll prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <p className="font-mono text-[0.6rem] text-[var(--text-3)] tracking-widest uppercase">Scroll to read</p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-4 h-7 rounded-full border border-[var(--text-3)] flex items-start justify-center pt-1"
          >
            <div className="w-0.5 h-1.5 rounded-full bg-[var(--text-3)]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
