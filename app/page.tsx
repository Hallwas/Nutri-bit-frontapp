import Link from "next/link";
import SiteHeader from "./components/common/SiteHeader";

// Valores fixos só para ilustrar (no Figma também são exemplo)
const refeicoes = [
  { nome: "Café da manhã", kcal: 420 },
  { nome: "Almoço", kcal: 680 },
  { nome: "Lanche", kcal: 250 },
  { nome: "Jantar", kcal: 520 },
];

const nutrientes = [
  { nome: "Proteínas", valor: "92 g" },
  { nome: "Carboidratos", valor: "214 g" },
  { nome: "Gorduras", valor: "58 g" },
];

const passos = [
  { titulo: "Crie sua conta e preencha o perfil", texto: "Informe peso, altura, idade, sexo e o quanto você se exercita." },
  { titulo: "Monte o seu plano alimentar", texto: "Organize semanas, dias e refeições e escolha os alimentos de cada uma." },
  { titulo: "Veja as calorias de cada dia", texto: "O total de calorias, proteínas e carboidratos aparece por refeição e por dia." },
];

const dadosMeta = [
  { nome: "Peso", valor: "68 kg" },
  { nome: "Altura", valor: "168 cm" },
  { nome: "Idade", valor: "25 anos" },
  { nome: "Atividade", valor: "Moderada" },
];

const menu = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#meta-diaria", label: "Meta diária" },
];

export default function Home() {
  return (
    <>
      <SiteHeader links={menu}>
        <Link href="/login" className="btn btn-outline-dark btn-sm">Entrar</Link>
        <Link href="/cadastro" className="btn btn-primary btn-sm">Criar conta</Link>
      </SiteHeader>

      <main>
        <section className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 mb-4">Planeje suas refeições, dia a dia.</h1>
              <p className="text-secondary mb-4">
                Monte planos alimentares por semana, dia e refeição. O Nutri-bit soma as calorias e os nutrientes
                de cada alimento e mostra quanto você deve comer por dia.
              </p>
              <div className="d-flex gap-2">
                <Link href="/cadastro" className="btn btn-primary">Criar conta</Link>
                <Link href="/login" className="btn btn-outline-dark">Já tenho conta</Link>
              </div>
            </div>

            <div className="col-lg-5 offset-lg-1">
              <div className="painel p-3">
                <h2 className="h4 mb-0">Seu dia no Nutri-bit</h2>
                <small className="text-secondary">Exemplo de um dia planejado</small>

                <ul className="list-group list-group-flush filete mt-2">
                  {refeicoes.map((r) => (
                    <li key={r.nome} className="list-group-item d-flex justify-content-between px-0 small">
                      {r.nome} <span>{r.kcal} kcal</span>
                    </li>
                  ))}
                </ul>

                <div className="destaque filete d-flex justify-content-between fw-bolder fs-5 px-2 py-1">
                  Total do dia <span>1.870 kcal</span>
                </div>

                <ul className="list-group list-group-flush">
                  {nutrientes.map((n) => (
                    <li key={n.nome} className="list-group-item d-flex justify-content-between px-0 small">
                      {n.nome} <span className="fw-bold">{n.valor}</span>
                    </li>
                  ))}
                </ul>
                <small className="text-secondary" style={{ fontSize: 11 }}>Valores de exemplo.</small>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="container py-5">
          <h2 className="h3 pb-3 mb-0 border-bottom border-dark border-3">Como funciona</h2>
          {passos.map((p, index) => (
            <div key={p.titulo} className="row align-items-center py-3 border-bottom border-dark">
              <div className="col-1 h2 text-primary mb-0">{index + 1}</div>
              <div className="col-md-4 fw-bold">{p.titulo}</div>
              <div className="col-md-7 small text-secondary">{p.texto}</div>
            </div>
          ))}
        </section>

        <section id="meta-diaria" className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h2 className="h1 mb-3">Uma meta diária feita para você</h2>
              <p className="text-secondary mb-0">
                Com os dados do seu perfil, o Nutri-bit calcula quantas calorias você deve comer por dia
                para chegar ao seu objetivo.
              </p>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <div className="painel p-3">
                <h3 className="h5 mb-2">O que o Nutri-bit usa</h3>
                <ul className="list-group list-group-flush filete">
                  {dadosMeta.map((d) => (
                    <li key={d.nome} className="list-group-item d-flex justify-content-between px-0 small">
                      {d.nome} <span>{d.valor}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-dark text-white filete d-flex justify-content-between fw-bolder fs-5 px-2 py-1">
                  Meta diária <span>2.150 kcal</span>
                </div>
                <small className="text-secondary" style={{ fontSize: 11 }}>Valores de exemplo.</small>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-dark text-white text-center py-5 mt-4">
          <h2 className="h1 mb-4">Comece a planejar hoje.</h2>
          <Link href="/cadastro" className="btn btn-primary">Criar conta</Link>
        </section>
      </main>
    </>
  );
}
