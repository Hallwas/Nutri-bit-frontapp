"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Day, Food, MealPlan } from "@/app/types";
import { apiError, apiFetch } from "@/app/login/auth_service";
import PageHeader from "@/app/components/common/PageHeader";
import FormCard from "@/app/components/common/FormCard";
import FormField from "@/app/components/common/FormField";
import Alert from "@/app/components/common/Alert";
import { nomeDoDia, tiposRefeicao, unidadeEmGramas } from "../../../opcoes";

type NovoIngrediente = {
    foodId: number;
    name: string;
    quantity: number;
    unit: string;
    grams?: number;
};

type Sugestao = {
    id: number;
    name: string;
    grams: number;
    caloriasEquivalentes: number;
};

function valor(n: number | null) {
    return n === null ? "—" : n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

export default function Refeicao() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const dayId = Number(searchParams.get("dia"));
    const mealId = searchParams.get("refeicao") ? Number(searchParams.get("refeicao")) : null;
    const voltar = `/planos/${params.id}`;

    const [subtitulo, setSubtitulo] = useState("");
    const [error, setError] = useState("");

    const [nome, setNome] = useState("");
    const [tipo, setTipo] = useState("");
    const [horario, setHorario] = useState("");
    const [ingredientes, setIngredientes] = useState<NovoIngrediente[]>([]);

    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState<Food[]>([]);
    const [escolhido, setEscolhido] = useState<Food | null>(null);
    const [quantidade, setQuantidade] = useState("");
    const [unidade, setUnidade] = useState("g");
    const [gramas, setGramas] = useState("");

    const [trocando, setTrocando] = useState<number | null>(null); // índice do ingrediente
    const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);

    async function load() {
        const resp = await apiFetch(`/meal-plans/${params.id}`);
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        const plano: MealPlan = await resp.json();
        for (const semana of plano.weeks) {
            const dia: Day | undefined = semana.days.find((d) => d.id === dayId);
            if (!dia) continue;
            setSubtitulo(`${plano.name}, Semana ${semana.number}, ${nomeDoDia(dia.weekday)}.`);

            const refeicao = dia.meals.find((m) => m.id === mealId);
            if (refeicao) {
                setNome(refeicao.name);
                setTipo(refeicao.type);
                setHorario(refeicao.time ?? "");
                setIngredientes(refeicao.ingredients.map((ing) => ({
                    foodId: ing.food.id,
                    name: ing.food.name,
                    quantity: ing.quantity,
                    unit: ing.unit,
                    grams: ing.grams ?? undefined,
                })));
            }
        }
    }

    async function buscarAlimentos(texto: string) {
        const resp = await apiFetch(`/foods?search=${encodeURIComponent(texto)}`);
        if (resp.ok) setResultados(await resp.json());
    }

    useEffect(() => {
        void load();
    }, []);

    useEffect(() => {
        if (busca.trim().length >= 2) void buscarAlimentos(busca.trim());
        else setResultados([]);
    }, [busca]);

    function adicionarIngrediente() {
        if (!escolhido || !quantidade || !unidade) return;
        // unidades como "fatias" precisam dos gramas para a API calcular
        if (!unidadeEmGramas(unidade) && !gramas) {
            setError("Informe quantos gramas dá essa quantidade (ex.: 2 fatias = 50 g).");
            return;
        }
        setIngredientes([...ingredientes, {
            foodId: escolhido.id,
            name: escolhido.name,
            quantity: Number(quantidade),
            unit: unidade,
            grams: gramas ? Number(gramas) : undefined,
        }]);
        setEscolhido(null);
        setQuantidade("");
        setUnidade("g");
        setGramas("");
        setError("");
    }

    function removerIngrediente(index: number) {
        setIngredientes(ingredientes.filter((_, i) => i !== index));
        fecharTroca();
    }

    // Clicou em "Remover": abre a caixa de sugestões
    async function pedirTroca(index: number) {
        const ing = ingredientes[index];
        setTrocando(index);
        setSugestoes([]);

        const gramasIng = ing.grams ?? (unidadeEmGramas(ing.unit) ? ing.quantity : null);
        if (!gramasIng) return;

        const resp = await apiFetch(`/foods/${ing.foodId}/similar?grams=${gramasIng}&limit=3`);
        // 400 (alimento sem calorias) ou outro erro: só não mostra sugestões
        if (!resp.ok) return;
        const dados = await resp.json();
        setSugestoes(dados.similar);
    }

    // sugestao.grams já vem equivalente em calorias
    function trocar(index: number, sugestao: Sugestao) {
        const novos = [...ingredientes];
        novos[index] = { foodId: sugestao.id, name: sugestao.name, quantity: sugestao.grams, unit: "g" };
        setIngredientes(novos);
        fecharTroca();
    }

    function fecharTroca() {
        setTrocando(null);
        setSugestoes([]);
    }

    async function salvar(event: any) {
        event.preventDefault();
        setError("");

        const body = {
            name: nome,
            type: tipo,
            time: horario || undefined,
            ingredients: ingredientes.map((ing) => ({
                foodId: ing.foodId, quantity: ing.quantity, unit: ing.unit, grams: ing.grams,
            })),
        };

        const resp = mealId === null
            ? await apiFetch(`/days/${dayId}/meals`, { method: "POST", body: JSON.stringify(body) })
            : await apiFetch(`/meals/${mealId}`, { method: "PUT", body: JSON.stringify(body) });

        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        router.push(voltar);
    }

    return (
        <main>
            <PageHeader title={mealId === null ? "Nova refeição" : "Editar refeição"} subtitle={subtitulo}>
                <Link href={voltar} className="btn btn-outline-dark">Voltar ao plano</Link>
            </PageHeader>

            <Alert type="danger" message={error} onClose={() => setError("")} />

            <div className="row g-4 align-items-start">
                <div className="col-lg-5">
                    <FormCard
                        title="Dados da refeição"
                        submitLabel="Salvar refeição"
                        clearLabel="Cancelar"
                        onSubmit={salvar}
                        onClear={() => router.push(voltar)}
                    >
                        <FormField label="Nome" htmlFor="nome">
                            <input id="nome" className="form-control" placeholder="Café da manhã"
                                value={nome} onChange={(e) => setNome(e.target.value)} minLength={2} maxLength={120} required />
                        </FormField>

                        <FormField label="Tipo" htmlFor="tipo">
                            <select id="tipo" className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                                <option value="">Selecione o tipo</option>
                                {tiposRefeicao.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </FormField>

                        <FormField label="Horário" htmlFor="horario">
                            <input id="horario" type="time" className="form-control"
                                value={horario} onChange={(e) => setHorario(e.target.value)} />
                        </FormField>

                        <h3 className="h6 filete pt-2">Ingredientes</h3>
                        {ingredientes.length === 0 && (
                            <p className="small text-secondary">Nenhum ingrediente ainda. Busque um alimento ao lado.</p>
                        )}
                        <ul className="list-group list-group-flush">
                            {ingredientes.map((ing, index) => (
                                <li key={index} className="list-group-item px-0">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="small fw-bold">{ing.name}</div>
                                            <small className="text-secondary">
                                                {ing.quantity} {ing.unit}{ing.grams ? ` (${ing.grams} g)` : ""}
                                            </small>
                                        </div>
                                        <button type="button" className="btn btn-link btn-sm link-danger fw-semibold p-0 text-decoration-none"
                                            onClick={() => pedirTroca(index)}>
                                            Remover
                                        </button>
                                    </div>

                                    {trocando === index && (
                                        <div className="bg-success-subtle p-2 mt-2 small">
                                            {sugestoes.length > 0 ? (
                                                <>
                                                    <div className="fw-bold mb-1">Trocar por algo parecido?</div>
                                                    {sugestoes.map((s) => (
                                                        <div key={s.id} className="d-flex justify-content-between align-items-center gap-2 py-1 border-bottom">
                                                            <span>{s.name}, {s.grams} g <span className="text-secondary">(≈ {s.caloriasEquivalentes.toLocaleString("pt-BR")} kcal)</span></span>
                                                            <button type="button" className="btn btn-link btn-sm p-0 fw-bold text-decoration-none"
                                                                onClick={() => trocar(index, s)}>
                                                                Trocar
                                                            </button>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className="text-secondary">Sem sugestões parecidas para este alimento.</div>
                                            )}
                                            <div className="d-flex gap-3 mt-2">
                                                <button type="button" className="btn btn-link btn-sm p-0 link-danger fw-semibold text-decoration-none"
                                                    onClick={() => removerIngrediente(index)}>
                                                    Só remover
                                                </button>
                                                <button type="button" className="btn btn-link btn-sm p-0 text-secondary text-decoration-none"
                                                    onClick={fecharTroca}>
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </FormCard>
                </div>

                <div className="col-lg-7">
                    <div className="painel p-3">
                        <h2 className="h5 mb-3">Buscar alimento</h2>
                        <FormField label="Nome do alimento" htmlFor="busca" help="Digite com acento (ex.: pão, feijão).">
                            <input id="busca" type="search" className="form-control" placeholder="pão"
                                value={busca} onChange={(e) => setBusca(e.target.value)} />
                        </FormField>

                        {resultados.length > 0 && (
                            <>
                                <table className="table table-sm align-middle small mb-1">
                                    <thead>
                                        <tr>
                                            <th className="fw-semibold">Alimento</th>
                                            <th className="fw-semibold">kcal</th>
                                            <th className="fw-semibold">Prot.</th>
                                            <th className="fw-semibold">Carb.</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados.map((alimento) => {
                                            const ativo = escolhido?.id === alimento.id;
                                            return (
                                                <tr key={alimento.id} className={ativo ? "table-warning fw-bold" : ""}>
                                                    <td>{alimento.name}</td>
                                                    <td>{valor(alimento.calorias)}</td>
                                                    <td>{valor(alimento.proteinas)} g</td>
                                                    <td>{valor(alimento.carboidratosDisponiveis)} g</td>
                                                    <td className="text-end">
                                                        {ativo ? "Escolhido" : (
                                                            <button type="button" className="btn btn-link btn-sm p-0 fw-bold"
                                                                onClick={() => setEscolhido(alimento)}>
                                                                Escolher
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <small className="text-secondary" style={{ fontSize: 11 }}>
                                    Valores por 100 g, da tabela TBCA.
                                </small>
                            </>
                        )}

                        {busca.trim().length >= 2 && resultados.length === 0 && (
                            <p className="small text-secondary">Nenhum alimento encontrado.</p>
                        )}

                        {escolhido && (
                            <div className="filete pt-2 mt-3">
                                <h3 className="h6">Adicionar: {escolhido.name}</h3>
                                <div className="row">
                                    <div className="col">
                                        <FormField label="Quantidade" htmlFor="quantidade">
                                            <input id="quantidade" type="number" step="0.1" className="form-control" placeholder="2"
                                                value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                                        </FormField>
                                    </div>
                                    <div className="col">
                                        <FormField label="Unidade" htmlFor="unidade">
                                            <input id="unidade" className="form-control" placeholder="g, ml, fatias..."
                                                value={unidade} onChange={(e) => setUnidade(e.target.value)} />
                                        </FormField>
                                    </div>
                                    {!unidadeEmGramas(unidade) && (
                                        <div className="col">
                                            <FormField label="Total em gramas" htmlFor="gramas">
                                                <input id="gramas" type="number" step="0.1" className="form-control" placeholder="50"
                                                    value={gramas} onChange={(e) => setGramas(e.target.value)} />
                                            </FormField>
                                        </div>
                                    )}
                                </div>
                                <button type="button" className="btn btn-dark btn-sm" onClick={adicionarIngrediente}>
                                    Adicionar ingrediente
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
