"use client";

import { apiError, apiFetch, getLoggedUser } from "@/app/login/auth_service";
import { useEffect, useState } from "react";
import { Profile } from "@/app/types";
import Alert from "@/app/components/common/Alert";
import Avatar from "@/app/components/common/Avatar";
import FormCard from "@/app/components/common/FormCard";
import FormField from "@/app/components/common/FormField";
import PageHeader from "@/app/components/common/PageHeader";
import { camposDoPerfil, niveisAtividade, objetivos, rotulo, sexos } from "../opcoes";

export default function MeuPerfil() {

    const usuario = getLoggedUser();

    const [perfil, setPerfil] = useState<Profile | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [preview, setPreview] = useState("");
    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [sexo, setSexo] = useState("");
    const [atividade, setAtividade] = useState("");
    const [objetivo, setObjetivo] = useState("");

    function fillForm(profile: Profile | null) {
        setFullName(profile?.fullName ?? usuario?.name ?? "");
        setBirthDate(profile?.birthDate ? profile.birthDate.slice(0, 10) : "");
        setAvatarUrl(profile?.avatarUrl ?? "");
        setPreview(profile?.avatarUrl ?? "");
        setPeso(profile?.weight ? String(profile.weight) : "");
        setAltura(profile?.height ? String(profile.height) : "");
        setSexo(profile?.sex ?? "");
        setAtividade(profile?.activityLevel ?? "");
        setObjetivo(profile?.goal ?? "");
    }

    async function load() {
        try {
            const resp = await apiFetch("/profiles/me");
            // usuário ainda sem perfil: mostra o formulário vazio
            if (resp.status === 404) {
                setPerfil(null);
                fillForm(null);
                return;
            }
            if (!resp.ok) throw new Error();
            const meu: Profile = await resp.json();
            setPerfil(meu);
            fillForm(meu);
        } catch {
            setError("Não foi possível carregar o perfil. Verifique a API.");
        }
    }

    async function save(event: any) {
        event.preventDefault();
        setError("");
        setSuccess("");

        // campos vazios vão como undefined (o JSON não envia)
        const body = {
            fullName: fullName,
            birthDate: birthDate || undefined,
            avatarUrl: avatarUrl,
            weight: peso ? Number(peso) : undefined,
            height: altura ? Number(altura) : undefined,
            sex: sexo || undefined,
            activityLevel: atividade || undefined,
            goal: objetivo || undefined,
        };

        const response = await apiFetch("/profiles/me", { method: "PUT", body: JSON.stringify(body) });
        if (!response.ok) {
            setError(await apiError(response));
            return;
        }
        setSuccess("Perfil salvo com sucesso.");
        await load();
    }

    useEffect(() => {
        void load();
    }, []);

    // data em UTC para não "voltar um dia" por causa do fuso
    const dataFormatada = perfil?.birthDate
        ? new Date(perfil.birthDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })
        : "—";

    const dados = [
        { label: "Nome completo", valor: perfil?.fullName ?? "—" },
        { label: "E-mail", valor: usuario?.email ?? "—" },
        { label: "Data de nascimento", valor: dataFormatada },
        { label: "Peso", valor: perfil?.weight ? `${perfil.weight.toLocaleString("pt-BR")} kg` : "—" },
        { label: "Altura", valor: perfil?.height ? `${perfil.height} cm` : "—" },
        { label: "Sexo", valor: rotulo(sexos, perfil?.sex) || "—" },
        { label: "Nível de atividade", valor: rotulo(niveisAtividade, perfil?.activityLevel).split(",")[0] || "—" },
        { label: "Objetivo", valor: rotulo(objetivos, perfil?.goal) || "—" },
    ];

    const faltando = (perfil?.missing ?? []).map((campo) => rotulo(camposDoPerfil, campo));

    return (
        <main>
            <PageHeader title="Meu perfil" />

            <Alert type="danger" message={error} onClose={() => setError("")} />
            <Alert type="success" message={success} onClose={() => setSuccess("")} />

            {perfil === null && !error && (
                <div className="alert alert-warning">
                    Você ainda não tem perfil. Preencha os dados abaixo para começar a montar seus planos.
                </div>
            )}

            <div className="row g-4 align-items-start">
                <div className="col-lg-4">
                    <FormCard
                        title="Editar meus dados"
                        submitLabel="Salvar alterações"
                        clearLabel="Cancelar"
                        onSubmit={save}
                        onClear={() => fillForm(perfil)}
                    >
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <Avatar url={preview} name={fullName} size={56} />
                            <div>
                                <div className="small text-secondary mb-1">Foto do perfil</div>
                                <button
                                    type="button"
                                    className="btn btn-outline-dark btn-sm"
                                    onClick={() => setPreview(avatarUrl)}
                                >
                                    Pré-visualizar
                                </button>
                            </div>
                        </div>

                        <FormField label="Nome completo" htmlFor="fullName">
                            <input id="fullName" className="form-control" value={fullName}
                                onChange={(e) => setFullName(e.target.value)} minLength={2} required />
                        </FormField>

                        <FormField label="Data de nascimento" htmlFor="birthDate">
                            <input id="birthDate" type="date" className="form-control" value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)} />
                        </FormField>

                        <div className="row">
                            <div className="col">
                                <FormField label="Peso (kg)" htmlFor="peso">
                                    <input id="peso" type="number" step="0.1" min={1} max={500} className="form-control"
                                        placeholder="68" value={peso} onChange={(e) => setPeso(e.target.value)} />
                                </FormField>
                            </div>
                            <div className="col">
                                <FormField label="Altura (cm)" htmlFor="altura">
                                    <input id="altura" type="number" min={30} max={300} className="form-control"
                                        placeholder="168" value={altura} onChange={(e) => setAltura(e.target.value)} />
                                </FormField>
                            </div>
                        </div>

                        <FormField label="Sexo" htmlFor="sexo">
                            <select id="sexo" className="form-select" value={sexo} onChange={(e) => setSexo(e.target.value)}>
                                <option value="">Selecione</option>
                                {sexos.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </FormField>

                        <FormField label="Nível de atividade" htmlFor="atividade">
                            <select id="atividade" className="form-select" value={atividade} onChange={(e) => setAtividade(e.target.value)}>
                                <option value="">Selecione</option>
                                {niveisAtividade.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </FormField>

                        <FormField
                            label="Objetivo"
                            htmlFor="objetivo"
                            help="Usamos esses dados para calcular quanto você deve ingerir por dia e sugerir planos para o seu objetivo."
                        >
                            <select id="objetivo" className="form-select" value={objetivo} onChange={(e) => setObjetivo(e.target.value)}>
                                <option value="">Selecione</option>
                                {objetivos.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </FormField>

                        <FormField label="URL do avatar" htmlFor="avatarUrl">
                            <input id="avatarUrl" className="form-control" placeholder="https://exemplo.com/avatar.jpg"
                                value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
                        </FormField>
                    </FormCard>
                </div>

                <div className="col-lg-8">
                    <div className="painel p-3">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <Avatar url={perfil?.avatarUrl} name={perfil?.fullName ?? usuario?.name} size={64} />
                            <div>
                                <h2 className="h4 mb-0">{perfil?.fullName ?? usuario?.name}</h2>
                                <small className="text-secondary">{usuario?.email}</small>
                            </div>
                        </div>

                        <ul className="list-group list-group-flush filete">
                            {dados.map((d) => (
                                <li key={d.label} className="list-group-item d-flex justify-content-between px-0 small">
                                    {d.label} <span className="fw-bold">{d.valor}</span>
                                </li>
                            ))}
                        </ul>

                        {perfil?.dailyCalories ? (
                            <div className="destaque filete d-flex justify-content-between fw-bolder fs-5 px-2 py-1">
                                Meta diária <span>{perfil.dailyCalories.toLocaleString("pt-BR")} kcal</span>
                            </div>
                        ) : perfil && faltando.length > 0 && (
                            <p className="filete pt-2 small text-secondary mb-0">
                                Para calcular a sua meta diária, preencha: {faltando.join(", ")}.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
