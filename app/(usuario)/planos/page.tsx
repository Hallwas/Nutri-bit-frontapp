"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MealPlanSummary, MealPlanTemplate, Profile } from "@/app/types";
import { apiError, apiFetch } from "@/app/login/auth_service";
import PageHeader from "@/app/components/common/PageHeader";
import EmptyState from "@/app/components/common/EmptyState";
import Alert from "@/app/components/common/Alert";
import PlanForm, { PlanFormData } from "@/app/components/plan/PlanForm";
import { camposDoPerfil, objetivos, rotulo } from "../opcoes";

export default function Planos() {
    const router = useRouter();

    const [planos, setPlanos] = useState<MealPlanSummary[]>([]);
    const [sugeridos, setSugeridos] = useState<MealPlanTemplate[]>([]);
    const [perfil, setPerfil] = useState<Profile | null>(null);
    const [faltando, setFaltando] = useState<string[]>([]);
    const [criando, setCriando] = useState(false);
    const [error, setError] = useState("");

    async function loadPlanos() {
        const resp = await apiFetch("/meal-plans");
        // sem perfil: a lista fica vazia e o aviso de perfil aparece
        if (resp.status === 404) return;
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        setPlanos(await resp.json());
    }

    async function loadSugeridos() {
        const respPerfil = await apiFetch("/profiles/me");
        if (respPerfil.status === 404) {
            setFaltando(camposDoPerfil.map((c) => c.value));
            return;
        }
        if (respPerfil.ok) setPerfil(await respPerfil.json());

        const resp = await apiFetch("/meal-plans/templates");
        // perfil incompleto, a API diz o que falta em "missing"
        if (resp.status === 400) {
            const erro = await resp.json();
            setFaltando(erro.missing ?? []);
            return;
        }
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        setSugeridos(await resp.json());
    }

    async function usar(templateId: number) {
        setError("");
        const resp = await apiFetch(`/meal-plans/templates/${templateId}/use`, { method: "POST" });
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        const plano = await resp.json();
        router.push(`/planos/${plano.id}`);
    }

    async function create(dados: PlanFormData) {
        setError("");
        const resp = await apiFetch("/meal-plans", { method: "POST", body: JSON.stringify(dados) });
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        const plano = await resp.json();
        router.push(`/planos/${plano.id}`);
    }

    async function remove(id: number) {
        if (!confirm("Deseja excluir este plano?")) return;
        const resp = await apiFetch(`/meal-plans/${id}`, { method: "DELETE" });
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        await loadPlanos();
    }

    useEffect(() => {
        void loadPlanos();
        void loadSugeridos();
    }, []);

    return (
        <main>
            <PageHeader title="Planos alimentares" subtitle="Escolha um plano pronto para o seu objetivo ou crie o seu do zero.">
                <button type="button" className="btn btn-outline-dark" onClick={() => setCriando(true)}>
                    Criar do zero
                </button>
            </PageHeader>

            <Alert type="danger" message={error} onClose={() => setError("")} />

            {criando && (
                <div className="mb-4">
                    <PlanForm title="Novo plano" submitLabel="Criar plano" onSave={create} onCancel={() => setCriando(false)} />
                </div>
            )}

            {faltando.length > 0 && (
                <div className="painel p-4 mb-5">
                    <h2 className="h4">Preencha o seu perfil para ver planos sugeridos</h2>
                    <p className="small text-secondary">
                        Precisamos de peso, altura, idade, sexo, nível de atividade e objetivo para calcular
                        a sua meta diária e escolher planos que combinam com você.
                    </p>
                    <ul className="list-group list-group-flush mb-3">
                        {faltando.map((campo) => (
                            <li key={campo} className="list-group-item d-flex justify-content-between px-0 small">
                                {rotulo(camposDoPerfil, campo)} <span className="fw-bold">Não informado</span>
                            </li>
                        ))}
                    </ul>
                    <Link href="/perfil" className="btn btn-primary">Ir para o meu perfil</Link>
                </div>
            )}

            {sugeridos.length > 0 && (
                <section className="mb-5">
                    <h2 className="h3 mb-1">Sugeridos para você</h2>
                    <p className="small text-secondary">
                        Com base no seu objetivo ({rotulo(objetivos, perfil?.goal).toLowerCase()})
                        {perfil?.dailyCalories ? ` e na sua meta de ${perfil.dailyCalories.toLocaleString("pt-BR")} kcal por dia` : ""}.
                    </p>

                    <div className="row g-4">
                        {sugeridos.slice(0, 3).map((t) => (
                            <div key={t.id} className="col-md-4">
                                <div className="painel p-3 h-100 d-flex flex-column">
                                    {t.bestMatch
                                        ? <span className="badge destaque align-self-start mb-1">Melhor combinação</span>
                                        : <small className="text-secondary">Combina com o seu objetivo</small>}
                                    <h3 className="h5 mb-2">{t.name}</h3>
                                    <ul className="list-group list-group-flush small">
                                        <li className="list-group-item d-flex justify-content-between px-0">
                                            Objetivo <span className="fw-bold">{rotulo(objetivos, t.goal)}</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between px-0">
                                            Calorias <span className="fw-bold">{t.calories.toLocaleString("pt-BR")} kcal por dia</span>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between px-0">
                                            Duração <span className="fw-bold">{t.weeksCount} semanas</span>
                                        </li>
                                    </ul>
                                    <p className="small text-secondary my-2">{t.description}</p>
                                    <button type="button" className="btn btn-primary w-100 mt-auto" onClick={() => usar(t.id)}>
                                        Usar este plano
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <small className="text-secondary d-block mt-2" style={{ fontSize: 11 }}>
                        Sugestões de exemplo, não substituem um nutricionista.
                    </small>
                </section>
            )}

            <h2 className="h3 mb-3">Meus planos</h2>
            {planos.length === 0 ? (
                <EmptyState message="Você ainda não tem planos alimentares." />
            ) : (
                <div className="painel table-responsive">
                    <table className="table align-middle mb-0">
                        <thead>
                            <tr className="small">
                                <th className="fw-semibold">Plano</th>
                                <th className="fw-semibold">Objetivo</th>
                                <th className="fw-semibold">Semanas</th>
                                <th className="fw-semibold">Situação</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {planos.map((plano) => (
                                <tr key={plano.id}>
                                    <td className="fw-bold">{plano.name}</td>
                                    <td className="small">{rotulo(objetivos, plano.goal)}</td>
                                    <td className="small">{plano.weeksCount}</td>
                                    <td>
                                        {plano.active
                                            ? <span className="badge destaque">Ativo</span>
                                            : <span className="small text-secondary">Inativo</span>}
                                    </td>
                                    <td className="text-end text-nowrap">
                                        <Link href={`/planos/${plano.id}`} className="fw-bold small me-3">Abrir</Link>
                                        <button type="button" className="btn btn-link btn-sm p-0 fw-bold link-danger text-decoration-none"
                                            onClick={() => remove(plano.id)}>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
