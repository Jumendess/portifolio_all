import { useState } from "react";
import NetworkCanvas from "./components/NetworkCanvas.jsx";
import Console from "./components/Console.jsx";
import { profile, messaging, filters, projects, timeline } from "./data/content.js";

export default function App() {
  return (
    <>
      <div className="wrap">
        <nav aria-label="Principal">
          <a className="mark" href="#topo">julio<span>.</span>mendes</a>
          <ul>
            <li><a href="#mensageria">Mensageria</a></li>
            <li><a href="#projetos">Projetos</a></li>
            <li><a href="#trajetoria">Trajetória</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>
      </div>

      <header className="hero" id="topo">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="who"><strong>{profile.name}</strong>, desenvolvedor de mensageria, automação e IA em {profile.city}</p>
            <h1>Eu construo conversas que trabalham sozinhas.</h1>
            <p className="lede">APIs do WhatsApp, chatbots e agentes de IA que respondem clientes, disparam campanhas e avisam o time na hora certa. Do webhook ao Microsoft Copilot.</p>
            <div className="actions">
              <a className="btn primary" href="#projetos">Ver projetos</a>
              <a className="btn ghost" href="#mensageria">Como eu trabalho com mensageria</a>
            </div>
          </div>
          <div className="hero-visual"><NetworkCanvas /></div>
        </div>
      </header>

      <section id="mensageria" className="messaging">
        <div className="wrap">
          <div className="split">
            <div>
              <h2>Mensageria de ponta a ponta</h2>
              <p className="sub">Da configuração do número no WhatsApp até o relatório de entregas do dia seguinte. Escolha um exemplo e veja a mensagem atravessar o fluxo.</p>
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
                <div><h3>{s.title}</h3><p>{s.text}</p></div>
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
              {profile.whatsapp && <a className="btn primary" href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noopener">Chamar no WhatsApp</a>}
              {profile.linkedin && <a className={`btn ${profile.whatsapp ? "ghost" : "primary"}`} href={profile.linkedin} target="_blank" rel="noopener">Falar no LinkedIn</a>}
              {profile.email && <a className="btn ghost" href={`mailto:${profile.email}`}>Enviar e-mail</a>}
              <a className={`btn ${profile.whatsapp || profile.linkedin ? "ghost" : "primary"}`} href={profile.github} target="_blank" rel="noopener">Ver meu GitHub</a>
            </div>
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
        <p className="sub">Produtos próprios, integrações de canais, agentes de IA e automações. Abra cada um para ver como funciona por dentro.</p>

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
