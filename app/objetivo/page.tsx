"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiError, apiFetch, clearToken, getLoggedUser, isAuthenticated } from "../login/auth_service";
import SiteHeader from "../components/common/SiteHeader";
import Alert from "../components/common/Alert";
import { objetivos } from "../(usuario)/opcoes";

export default function Objetivo() {
    const router = useRouter();

    const [objetivo, setObjetivo] = useState("");
    const [temPerfil, setTemPerfil] = useState(false);
    const [error, setError] = useState("");

    async function load() {
        const resp = await apiFetch("/profiles/me");
        if (resp.ok) {
            const perfil = await resp.json();
            setTemPerfil(true);
            setObjetivo(perfil.goal ?? "");
        }
    }

    async function salvar() {
        if (!objetivo) {
            setError("Escolha um objetivo ou clique em Pular por enquanto.");
            return;
        }
        // na primeira vez o perfil ainda não existe e a API pede o nome completo
        const body = temPerfil
            ? { goal: objetivo }
            : { goal: objetivo, fullName: getLoggedUser()?.name };

        const resp = await apiFetch("/profiles/me", { method: "PUT", body: JSON.stringify(body) });
        if (!resp.ok) {
            setError(await apiError(resp));
            return;
        }
        router.push("/planos");
    }

    function sair() {
        clearToken();
        router.replace("/login");
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace("/login");
            return;
        }
        void load();
    }, []);

    return (
        <>
            <SiteHeader>
                <button type="button" className="btn btn-outline-dark btn-sm" onClick={sair}>Sair</button>
            </SiteHeader>

            <main className="container flex-grow-1 d-flex align-items-center py-5">
                <div className="row g-5 align-items-center w-100">
                    <div className="col-lg-5">
                        <h1 className="display-4 mb-3">Qual é o seu objetivo?</h1>
                        <p className="text-secondary mb-0">
                            Vamos sugerir planos alimentares de acordo com ele. Você pode mudar depois no seu perfil.
                        </p>
                    </div>

                    <div className="col-lg-6 offset-lg-1">
                        <Alert type="danger" message={error} onClose={() => setError("")} />

                        <div className="d-grid gap-3 mb-3">
                            {objetivos.map((o) => {
                                const escolhido = objetivo === o.value;
                                return (
                                    <button
                                        key={o.value}
                                        type="button"
                                        className={`btn text-start border-2 border-dark p-3 d-flex justify-content-between align-items-center ${escolhido ? "destaque" : "bg-white"}`}
                                        onClick={() => setObjetivo(o.value)}
                                    >
                                        <span>
                                            <span className="d-block h5 mb-0">{o.label}</span>
                                            <small className="fw-normal text-secondary">{o.descricao}</small>
                                        </span>
                                        {escolhido && <small>Selecionado</small>}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <button type="button" className="btn btn-primary" onClick={salvar}>Ver planos para mim</button>
                            <button type="button" className="btn btn-link fw-semibold text-decoration-none"
                                onClick={() => router.push("/planos")}>
                                Pular por enquanto
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
