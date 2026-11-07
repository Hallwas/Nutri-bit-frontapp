"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MealPlan } from "@/app/types";
import { apiError, apiFetch } from "@/app/login/auth_service";
import PageHeader from "@/app/components/common/PageHeader";
import EmptyState from "@/app/components/common/EmptyState";
import Alert from "@/app/components/common/Alert";
import PlanForm, { PlanFormData } from "@/app/components/plan/PlanForm";
import { nomeDoDia, objetivos, rotulo } from "../../opcoes";

function num(valor: number) {
    return valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

export default function Plano() {
    const params = useParams();
    const router = useRouter();

    const [plano, setPlano] = useState<MealPlan | null>(null);
    const [semanaIndex, setSemanaIndex] = useState(0);
    const [diaIndex, setDiaIndex] = useState(0);
    const [editando, setEditando] = useState(false);
    const [error, setError] = useState("");
    const [carregou, setCarregou] = useState(false);

    async function load() {
        const resp = await apiFetch(`/meal-plans/${params.id}`);
        setCarregou(true);
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        setPlano(await resp.json());
    }

    async function update(dados: PlanFormData) {
        setError("");
        const resp = await apiFetch(`/meal-plans/${params.id}`, { method: "PUT", body: JSON.stringify(dados) });
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        setPlano(await resp.json());
        setEditando(false);
    }

    async function removePlan() {
        if (!confirm("Deseja excluir este plano?")) return;
        const resp = await apiFetch(`/meal-plans/${params.id}`, { method: "DELETE" });
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        router.push("/planos");
    }

    async function newWeek() {
        const resp = await apiFetch(`/meal-plans/${params.id}/weeks`, { method: "POST" });
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        const atualizado: MealPlan = await resp.json();
        setPlano(atualizado);
        setSemanaIndex(atualizado.weeks.length - 1);
        setDiaIndex(0);
    }

    async function removeWeek() {
        const semanaAtual = plano?.weeks[semanaIndex];
        if (!semanaAtual) return;
        if (!confirm(`Deseja excluir a Semana ${semanaAtual.number} e todas as refeições dela?`)) return;
        const resp = await apiFetch(`/meal-plans/${params.id}/weeks/${semanaAtual.id}`, { method: "DELETE" });
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        setPlano(await resp.json());
        setSemanaIndex(Math.max(0, semanaIndex - 1));
        setDiaIndex(0);
    }

    async function removeMeal(mealId: number) {
        if (!confirm("Deseja excluir esta refeição?")) return;
        const resp = await apiFetch(`/meals/${mealId}`, { method: "DELETE" });
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        await load();
    }

    useEffect(() => {
        void load();
    }, []);

    if (!plano) {
        return carregou
            ? <><Alert type="danger" message={error} onClose={() => setError("")} /><EmptyState message="Plano não encontrado." /></>
            : <p className="text-secondary">Carregando...</p>;
    }

    const semana = plano.weeks[semanaIndex];
    const dia = semana?.days[diaIndex];

    return (
        <main>
            <PageHeader title={plano.name} subtitle={[rotulo(objetivos, plano.goal), plano.description].filter(Boolean).join(". ")}>
                <button type="button" className="btn btn-outline-dark" onClick={() => setEditando(true)}>Editar plano</button>
                <Link href="/planos" className="btn btn-outline-dark">Voltar aos planos</Link>
            </PageHeader>

            <Alert type="danger" message={error} onClose={() => setError("")} />

            {editando && (
                <div className="mb-4">
                    <PlanForm
                        title="Editar plano"
                        submitLabel="Salvar plano"
                        initial={{ name: plano.name, goal: plano.goal, description: plano.description ?? "", active: plano.active }}
                        onSave={update}
                        onCancel={() => setEditando(false)}
                    />
                    <button type="button" className="btn btn-link link-danger btn-sm fw-semibold px-0 mt-2" onClick={removePlan}>
                        Excluir este plano
                    </button>
                </div>
            )}

            <ul className="nav menu-nutri gap-4 border-bottom mb-4">
                {plano.weeks.map((w, index) => (
                    <li className="nav-item" key={w.id}>
                        <button type="button" className={`nav-link small ${index === semanaIndex ? "active" : ""}`}
                            onClick={() => { setSemanaIndex(index); setDiaIndex(0); }}>
                            {w.label ?? `Semana ${w.number}`}
                        </button>
                    </li>
                ))}
                <li className="nav-item">
                    <button type="button" className="nav-link small text-primary fw-semibold" onClick={newWeek}>
                        Nova semana
                    </button>
                </li>
                {plano.weeks.length > 1 && (
                    <li className="nav-item ms-auto">
                        <button type="button" className="nav-link small link-danger fw-semibold" onClick={removeWeek}>
                            Excluir semana
                        </button>
                    </li>
                )}
            </ul>

            {semana && dia && (
                <div className="row g-4 align-items-start">
                    <div className="col-md-3">
                        <div className="list-group list-group-flush border-top border-bottom">
                            {semana.days.map((d, index) => (
                                <button key={d.id} type="button"
                                    className={`list-group-item list-group-item-action small ${index === diaIndex ? "list-group-item-primary fw-bold" : ""}`}
                                    onClick={() => setDiaIndex(index)}>
                                    {d.weekday}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-9">
                        <div className="painel p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h2 className="h4 mb-0">{nomeDoDia(dia.weekday)}</h2>
                                    <small className="text-secondary">Semana {semana.number}, {dia.meals.length} {dia.meals.length === 1 ? "refeição" : "refeições"}</small>
                                </div>
                                <Link href={`/planos/${plano.id}/refeicao?dia=${dia.id}`} className="btn btn-primary btn-sm">
                                    Adicionar refeição
                                </Link>
                            </div>

                            {dia.meals.length === 0 && (
                                <p className="filete pt-3 text-secondary small">Nenhuma refeição neste dia.</p>
                            )}

                            {dia.meals.map((refeicao) => (
                                <div key={refeicao.id} className="filete pt-2 mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="fw-bolder">{refeicao.name}</span>
                                            {refeicao.time && <small className="text-secondary ms-2">{refeicao.time}</small>}
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <Link href={`/planos/${plano.id}/refeicao?dia=${dia.id}&refeicao=${refeicao.id}`}
                                                className="small fw-semibold">
                                                Editar
                                            </Link>
                                            <button type="button" className="btn btn-link btn-sm p-0 link-danger fw-semibold"
                                                onClick={() => removeMeal(refeicao.id)}>
                                                Excluir
                                            </button>
                                            <span className="fw-bolder">{num(refeicao.calorias)} kcal</span>
                                        </div>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        {refeicao.ingredients.map((ing) => (
                                            <li key={ing.id} className="list-group-item d-flex justify-content-between small ps-3 pe-0">
                                                {ing.food.name}, {num(ing.quantity)} {ing.unit}
                                                <span className="text-secondary">{num(ing.calorias)} kcal</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <div className="destaque filete d-flex justify-content-between fw-bolder fs-5 px-2 py-1">
                                Total do dia <span>{num(dia.calorias)} kcal</span>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between px-0 small">
                                    Proteínas <span className="fw-bold">{num(dia.proteinas)} g</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between px-0 small">
                                    Carboidratos <span className="fw-bold">{num(dia.carboidratos)} g</span>
                                </li>
                            </ul>
                            <small className="text-secondary" style={{ fontSize: 11 }}>
                                Valores calculados com a tabela TBCA.
                            </small>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
