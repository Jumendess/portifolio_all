import { useEffect, useRef } from "react";

const CHANNELS = ["WhatsApp", "Telegram", "Teams", "Messenger", "Blip", "Oracle ODA", "n8n"];

// Rede de canais orbitando um núcleo de IA, com mensagens indo e voltando.
export default function NetworkCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0, running = true, t = 0;
    let pointer = { x: 0, y: 0 };
    const packets = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const geom = () => {
      const cx = w / 2 + pointer.x * 10, cy = h / 2 + pointer.y * 10;
      const rx = Math.min(w / 2 - 56, 290), ry = Math.min(h * 0.38, 210);
      return { cx, cy, rx, ry };
    };

    const channelPos = (i, g) => {
      const a = (i / CHANNELS.length) * Math.PI * 2 + t * 0.00012;
      return { x: g.cx + Math.cos(a) * g.rx, y: g.cy + Math.sin(a) * g.ry, depth: (Math.sin(a) + 1) / 2 };
    };

    const spawn = () => {
      const from = Math.floor(Math.random() * CHANNELS.length);
      packets.push({ ch: from, p: 0, inbound: Math.random() > 0.45, speed: 0.006 + Math.random() * 0.006 });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const g = geom();

      // órbitas
      ctx.lineWidth = 1;
      [1, 0.66, 0.36].forEach((k, i) => {
        ctx.strokeStyle = `rgba(195,180,255,${0.16 - i * 0.03})`;
        ctx.setLineDash(i === 0 ? [2, 6] : []);
        ctx.beginPath();
        ctx.ellipse(g.cx, g.cy, g.rx * k, g.ry * k, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      const pos = CHANNELS.map((_, i) => channelPos(i, g));

      // raios até o núcleo
      pos.forEach((p) => {
        const grad = ctx.createLinearGradient(p.x, p.y, g.cx, g.cy);
        grad.addColorStop(0, "rgba(158,235,255,0.0)");
        grad.addColorStop(1, "rgba(158,235,255,0.22)");
        ctx.strokeStyle = grad;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(g.cx, g.cy); ctx.stroke();
      });

      // mensagens em trânsito
      for (let i = packets.length - 1; i >= 0; i--) {
        const k = packets[i];
        k.p += reduce ? 0 : k.speed;
        if (k.p >= 1) { packets.splice(i, 1); continue; }
        const p = pos[k.ch];
        const e = k.p < 0.5 ? 2 * k.p * k.p : 1 - Math.pow(-2 * k.p + 2, 2) / 2;
        const a = k.inbound ? e : 1 - e;
        const x = p.x + (g.cx - p.x) * a, y = p.y + (g.cy - p.y) * a;
        const color = k.inbound ? "195,180,255" : "158,235,255";
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 12);
        glow.addColorStop(0, `rgba(${color},0.9)`);
        glow.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgb(${color})`;
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill();
      }

      // núcleo
      const pulse = reduce ? 0 : Math.sin(t * 0.003) * 4;
      const core = ctx.createRadialGradient(g.cx, g.cy, 0, g.cx, g.cy, 70 + pulse);
      core.addColorStop(0, "rgba(158,235,255,0.55)");
      core.addColorStop(0.35, "rgba(150,140,255,0.22)");
      core.addColorStop(1, "rgba(150,140,255,0)");
      ctx.fillStyle = core;
      ctx.beginPath(); ctx.arc(g.cx, g.cy, 70 + pulse, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0D1028";
      ctx.strokeStyle = "#9EEBFF"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(g.cx, g.cy, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#E8EAF7";
      ctx.font = "600 14px Unbounded, system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("IA", g.cx, g.cy + 1);

      // canais (os de trás ficam mais apagados)
      pos.map((p, i) => ({ ...p, i })).sort((a, b) => a.depth - b.depth).forEach((p) => {
        const alpha = 0.55 + p.depth * 0.45;
        ctx.font = "500 13px Manrope, system-ui, sans-serif";
        const label = CHANNELS[p.i];
        const tw = ctx.measureText(label).width + 22;
        const bh = 28;
        ctx.fillStyle = `rgba(27,32,73,${0.85 * alpha + 0.1})`;
        ctx.strokeStyle = `rgba(158,235,255,${0.25 + p.depth * 0.45})`;
        ctx.lineWidth = 1;
        roundRect(ctx, p.x - tw / 2, p.y - bh / 2, tw, bh, 14);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = `rgba(232,234,247,${alpha})`;
        ctx.fillText(label, p.x, p.y + 1);
      });
    };

    const loop = (now) => {
      t = now;
      if (Math.random() < 0.07 && packets.length < 26) spawn();
      draw();
      if (running) raf = requestAnimationFrame(loop);
    };

    resize();
    const onResize = () => { resize(); if (reduce) draw(); };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove);

    if (reduce) {
      for (let i = 0; i < 9; i++) packets.push({ ch: i % CHANNELS.length, p: 0.2 + (i % 5) * 0.15, inbound: i % 2 === 0, speed: 0 });
      document.fonts?.ready.then(draw);
      draw();
    } else {
      const io = new IntersectionObserver(([en]) => {
        const vis = en.isIntersecting;
        if (vis && !running) { running = true; raf = requestAnimationFrame(loop); }
        if (!vis) { running = false; cancelAnimationFrame(raf); }
      });
      io.observe(canvas);
      raf = requestAnimationFrame(loop);
      return () => {
        io.disconnect(); running = false; cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onMove);
      };
    }
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="network" aria-hidden="true" />;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
