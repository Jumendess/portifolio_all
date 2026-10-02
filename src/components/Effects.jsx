import { Fragment, useEffect, useState } from "react";

const GLYPHS = "▖▘▝▗▚▞01<>/{}[]#%&*+=ABCDEFGHJKLMNPQRSTUVWXYZ";
const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Texto que "decodifica" uma vez, ao abrir a página.
// Cada letra ocupa o seu espaço final desde o início, então o layout não pula.
export function ScrambleText({ text, duration = 1400, delay = 250 }) {
  const [done, setDone] = useState(reduce ? text.length : -1);
  const [, force] = useState(0);
  useEffect(() => {
    if (reduce) return;
    let raf, start;
    const tick = (now) => {
      if (!start) start = now;
      const t = Math.max(0, now - start - delay) / duration;
      setDone(t <= 0 ? -1 : Math.floor(t * text.length));
      force((n) => n + 1);
      if (t < 1) raf = requestAnimationFrame(tick); else setDone(text.length);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  const words = text.split(" ");
  let idx = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="scramble">
        {words.map((w, wi) => {
          const chars = w.split("").map((c) => {
            const i = idx++;
            const state = i < done ? "ok" : i < done + 6 && done >= 0 ? "glyph" : "off";
            const g = state === "glyph" ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : "";
            return <span key={i} className={state} data-g={g}>{c}</span>;
          });
          idx++;
          return <Fragment key={wi}><span className="word">{chars}</span>{wi < words.length - 1 ? " " : ""}</Fragment>;
        })}
      </span>
    </>
  );
}

// Contador real das mensagens que a rede animada entrega.
export function HudCounter() {
  const [count, setCount] = useState(0);
  const [last, setLast] = useState(null);
  useEffect(() => {
    const on = (e) => { setCount((c) => c + 1); setLast(e.detail); };
    window.addEventListener("packet", on);
    return () => window.removeEventListener("packet", on);
  }, []);
  return (
    <div className="hud" aria-hidden="true">
      <div><span className="hud-num">{String(count).padStart(4, "0")}</span><span className="hud-label">mensagens desde que você chegou</span></div>
      <div className="hud-last">{last ? `${last.inbound ? "recebida de" : "enviada para"} ${last.channel}` : "conectando canais"}</div>
    </div>
  );
}

// Luz que segue o cursor e barra de progresso de leitura.
export function Ambience() {
  useEffect(() => {
    const root = document.documentElement;
    const move = (e) => { root.style.setProperty("--mx", `${e.clientX}px`); root.style.setProperty("--my", `${e.clientY}px`); };
    const scroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      root.style.setProperty("--progress", max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("scroll", scroll); };
  }, []);
  return (
    <>
      <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="spotlight" aria-hidden="true" />
      <div className="progress" aria-hidden="true" />
    </>
  );
}
