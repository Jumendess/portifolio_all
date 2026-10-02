import { useEffect, useRef, useState } from "react";
import { scenes } from "../data/content.js";

const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Console que mostra uma mensagem passando pelo fluxo até a resposta.
export default function Console() {
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [inText, setIn] = useState("");
  const [outText, setOut] = useState("");
  const [lit, setLit] = useState(-1);
  const [typing, setTyping] = useState(null);
  const timers = useRef([]);
  const s = scenes[index];

  useEffect(() => {
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    timers.current.forEach(clearTimeout); timers.current = [];
    setIn(""); setOut(""); setLit(-1);

    if (reduce) { setIn(s.inText); setOut(s.outText); setLit(s.nodes.length - 1); return; }

    const type = (text, set, speed, done) => {
      setTyping(set === setIn ? "in" : "out");
      let i = 0;
      const tick = () => { i++; set(text.slice(0, i)); if (i < text.length) later(tick, speed); else { setTyping(null); done(); } };
      later(tick, speed);
    };

    type(s.inText, setIn, 26, () => {
      s.nodes.forEach((_, k) => later(() => setLit(k), 280 + k * 460));
      later(() => type(s.outText, setOut, 16, () => {
        if (auto) later(() => setIndex((i) => (i + 1) % scenes.length), 3400);
      }), 300 + s.nodes.length * 460);
    });
    return () => timers.current.forEach(clearTimeout);
  }, [index, auto]);

  const pick = (i) => { setAuto(false); setIndex(i); };
  const beam = lit < 0 ? 0 : (lit / (s.nodes.length - 1)) * 100;

  return (
    <div className="console">
      <div className="console-bar">
        <div className="tabs" role="tablist" aria-label="Escolha um exemplo">
          {scenes.map((sc, i) => (
            <button key={sc.tab} role="tab" aria-selected={i === index} onClick={() => pick(i)}>{sc.tab}</button>
          ))}
        </div>
        <span className={`live ${auto ? "" : "paused"}`}>{auto ? "ao vivo" : "pausado"}</span>
      </div>

      <div className="flow" aria-live="polite">
        <div className="bubble in">
          <span className="from">{s.inFrom}</span>
          {inText}{typing === "in" && <span className="caret" />}
        </div>

        <div className="pipe" aria-hidden="true">
          <div className="track" />
          <div className="beam" style={{ width: `calc((100% - 36px) * ${beam / 100})` }} />
          {s.nodes.map((n, k) => (
            <div key={n} className={`node ${k <= lit ? "on" : ""}`}><i /><small>{n}</small></div>
          ))}
        </div>

        <div className={`bubble out ${outText ? "" : "waiting"}`}>
          <span className="from">{s.outFrom}</span>
          {outText}{typing === "out" && <span className="caret" />}
        </div>
      </div>
      <p className="foot">{s.foot}</p>
    </div>
  );
}
