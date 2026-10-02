import { useState } from "react";
import NetworkCanvas from "./components/NetworkCanvas.jsx";
import Console from "./components/Console.jsx";
import { ScrambleText, HudCounter, Ambience } from "./components/Effects.jsx";
import { profile, messaging, filters, projects, timeline } from "./data/content.js";

export default function App() {
  return (
    <>
      <Ambience />
      <div className="wrap">
        <nav aria-label="Principal">
          <a className="mark" href="#topo">julio<span>.</span>mendes</a>
          <ul>
            <li><a href="#atendimento">Atendimento</a></li>
            <li><a href="#projetos">Projetos</a></li>
            <li><a href="#trajetoria">Trajetória</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>
      </div>

      <header className="hero" id="topo">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="who"><strong>{profile.name}</strong><span>{profile.role}</span></p>
            <h1><ScrambleText text="Eu construo conversas que trabalham sozinhas." /></h1>
            <p className="lede">Automação de atendimento, chatbots e IA com WhatsApp Business API. Eu transformo uma necessidade do negócio em um fluxo que funciona, do levantamento de requisitos até a sustentação em produção.</p>
            <div className="actions">
              <a className="btn primary" href="#projetos">Ver projetos</a>
              <a className="btn ghost" href="#atendimento">Ver como funciona</a>
            </div>
          </div>
          <div className="hero-visual">
            <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
            <NetworkCanvas />
            <HudCounter />
          </div>
        </div>
      </header>

      <section id="atendimento" className="messaging">
        <div className="wrap">
          <div className="split">
            <div>
              <h2>Atendimento automatizado de ponta a ponta</h2>
              <p className="sub">Do desenho do fluxo conversacional à integração com os sistemas, das campanhas em grande volume ao relatório do dia seguinte. Escolha um exemplo e veja a mensagem atravessar o fluxo.</p>
              <ul className="channels" aria-label="Canais e plataformas">
                {messaging.channels.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </div>
            <Console />
          </div>

          <div className="skills">
            {messaging.skills.map((s) => (
              <div className="skill" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Projects />

      <section id="trajetoria">
        <div className="wrap">
          <h2>Trajetória</h2>
          <p className="sub">Sete anos liderando vendas me ensinaram o que o cliente quer ouvir. Hoje eu ensino isso para as máquinas.</p>
          <ol className="timeline">
            {timeline.map((s) => (
              <li className={`step ${s.now ? "now" : ""}`} key={s.title}>
                <span className="when">{s.when}</span>
                <div><h3>{s.title}</h3>{s.role && <p className="role">{s.role}</p>}<p>{s.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contato">
        <div className="wrap">
          <div className="contact">
            <h2>Tem um processo que deveria rodar sozinho?</h2>
            <p className="sub">Conte o que o seu time repete todo dia, no atendimento ou nos disparos. Eu mostro como automatizar.</p>
            <div className="actions">
              {profile.whatsapp && <a className="btn primary" href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent("Oi, Julio! Vi seu portfólio e queria conversar sobre automação.")}`} target="_blank" rel="noopener">Chamar no WhatsApp</a>}
              {profile.linkedin && <a className={`btn ${profile.whatsapp ? "ghost" : "primary"}`} href={profile.linkedin} target="_blank" rel="noopener">Falar no LinkedIn</a>}
              <a className={`btn ${profile.whatsapp || profile.linkedin ? "ghost" : "primary"}`} href={profile.github} target="_blank" rel="noopener">Ver meu GitHub</a>
            </div>
            {profile.email && <p className="mail">Ou escreva para <a href={`mailto:${profile.email}`}>{profile.email}</a></p>}
          </div>
        </div>
      </section>

      <footer><div className="wrap">{profile.name} · {profile.city} · {new Date().getFullYear()}</div></footer>
    </>
  );
}

function Projects() {
  const [filter, setFilter] = useState("todos");
  const list = projects.filter((p) => filter === "todos" || p.cats.includes(filter));

  return (
    <section id="projetos">
      <div className="wrap">
        <h2>Projetos</h2>
        <p className="sub">Produtos próprios, chatbots, agentes de IA, integrações e automações. Abra cada um para ver como funciona por dentro.</p>

        <div className="filters" role="group" aria-label="Filtrar projetos">
          {filters.map((f) => (
            <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}<span className="count">{f.id === "todos" ? projects.length : projects.filter((p) => p.cats.includes(f.id)).length}</span>
            </button>
          ))}
        </div>

        <div className="projects">
          {list.map((p) => (
            <details className="proj" key={p.name}>
              <summary>
                <div><span className="pname">{p.name}</span><span className="ptag">{p.tag}</span></div>
                <p className="pline">{p.line}</p>
                <span className="plus" aria-hidden="true" />
              </summary>
              <div className="pbody">
                <div className="stack">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
                <div className="detail">
                  <p>{p.text}</p>
                  {p.points.length > 0 && <ul>{p.points.map((x) => <li key={x}>{x}</li>)}</ul>}
                  {p.links && (
                    <div className="links">
                      {p.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}</a>)}
                    </div>
                  )}
                </div>
                <span className="spacer" />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
