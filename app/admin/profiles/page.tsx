"use client";

import { authHeaders } from "@/app/login/auth_service";
import { useEffect, useState } from "react";
import { Profile, User } from "@/app/types";
import Alert from "@/app/components/common/Alert";
import Avatar from "@/app/components/common/Avatar";
import FormCard from "@/app/components/common/FormCard";
import FormField from "@/app/components/common/FormField";
import PageHeader from "@/app/components/common/PageHeader";
import ProfileList from "@/app/components/profile/ProfileList";
import { niveisAtividade, objetivos, sexos } from "@/app/(usuario)/opcoes";

export default function Profiles() {

    const API = "http://localhost:3000/api";

    const [users, setUsers] = useState<User[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [id, setId] = useState<number | null>(null);
    const [userId, setUserId] = useState("");
    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [preview, setPreview] = useState("");
    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [sexo, setSexo] = useState("");
    const [atividade, setAtividade] = useState("");
    const [objetivo, setObjetivo] = useState("");

    async function load() {
        try {
            const respUsers = await fetch(`${API}/users`, { headers: authHeaders() });
            const respProfiles = await fetch(`${API}/profiles`, { headers: authHeaders() });
            if (!respUsers.ok || !respProfiles.ok) throw new Error();
            setUsers(await respUsers.json());
            setProfiles(await respProfiles.json());
        } catch {
            setError("Não foi possível carregar os dados. Verifique a API.");
        }
    }

    function clear() {
        setId(null);
        setUserId("");
        setFullName("");
        setBirthDate("");
        setAvatarUrl("");
        setPreview("");
        setPeso("");
        setAltura("");
        setSexo("");
        setAtividade("");
        setObjetivo("");
        setError("");
    }

    function edit(profile: Profile) {
        setId(profile.id);
        setUserId(String(profile.userId));
        setFullName(profile.fullName);
        setBirthDate(profile.birthDate ? profile.birthDate.slice(0, 10) : "");
        setAvatarUrl(profile.avatarUrl ?? "");
        setPreview(profile.avatarUrl ?? "");
        setPeso(profile.weight ? String(profile.weight) : "");
        setAltura(profile.height ? String(profile.height) : "");
        setSexo(profile.sex ?? "");
        setAtividade(profile.activityLevel ?? "");
        setObjetivo(profile.goal ?? "");
        setSuccess("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function save(event: any) {
        event.preventDefault();
        setError("");
        setSuccess("");

        const body = {
            fullName: fullName,
            birthDate: birthDate || null,
            avatarUrl: avatarUrl || null,
            weight: peso ? Number(peso) : undefined,
            height: altura ? Number(altura) : undefined,
            sex: sexo || undefined,
            activityLevel: atividade || undefined,
            goal: objetivo || undefined,
        };

        const response = await fetch(id === null ? `${API}/profiles` : `${API}/profiles/${id}`, {
            method: id === null ? "POST" : "PUT",
            headers: authHeaders(),
            body: JSON.stringify(id === null ? { ...body, userId: Number(userId) } : body),
        });

        if (!response.ok) {
            const err = await response.json();
            setError(Array.isArray(err.message) ? err.message.join(", ") : err.message);
            return;
        }
        setSuccess(id === null ? "Perfil cadastrado com sucesso." : "Perfil atualizado com sucesso.");
        clear();
        await load();
    }

    async function remove(profileId: number) {
        if (!confirm("Deseja excluir este perfil?")) return;
        await fetch(`${API}/profiles/${profileId}`, { method: "DELETE", headers: authHeaders() });
        if (profileId === id) clear();
        await load();
    }

    useEffect(() => {
        void load();
    }, []);

    const idsWithProfile = profiles.map((p) => p.userId);
    const availableUsers = users.filter(
        (u) => !idsWithProfile.includes(u.id) || u.id === Number(userId)
    );

    return (
        <main>
            <PageHeader
                title="Perfis"
                subtitle="Cadastre, visualize e edite os perfis dos usuários do sistema."
            />

            <Alert type="danger" message={error} onClose={() => setError("")} />
            <Alert type="success" message={success} onClose={() => setSuccess("")} />

            <div className="row g-4">
                <div className="col-lg-4">
                    <FormCard
                        title={id === null ? "Novo perfil" : "Editando perfil"}
                        submitLabel={id === null ? "Cadastrar perfil" : "Salvar alterações"}
                        clearLabel={id === null ? "Limpar campos" : "Cancelar edição"}
                        onSubmit={save}
                        onClear={clear}
                    >
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <Avatar url={preview} name={fullName} size={72} />
                            <div>
                                <div className="small text-secondary mb-2">Foto do perfil</div>
                                <button
                                    type="button"
                                    className="btn btn-outline-dark btn-sm"
                                    onClick={() => setPreview(avatarUrl)}
                                >
                                    Pré-visualizar
                                </button>
                            </div>
                        </div>

                        <FormField label="Usuário" htmlFor="userId" required help="Cada usuário pode ter apenas um perfil.">
                            <select
                                id="userId"
                                className="form-select"
                                value={userId}
                                onChange={(event) => setUserId(event.target.value)}
                                disabled={id !== null}
                                required
                            >
                                <option value="">Selecione um usuário</option>
                                {availableUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="Nome completo" htmlFor="fullName" required>
                            <input
                                id="fullName"
                                className="form-control"
                                placeholder="Informe o nome completo"
                                value={fullName}
                                onChange={(event) => setFullName(event.target.value)}
                                minLength={2}
                                required
                            />
                        </FormField>

                        <FormField label="Data de nascimento" htmlFor="birthDate">
                            <input
                                id="birthDate"
                                type="date"
                                className="form-control"
                                value={birthDate}
                                onChange={(event) => setBirthDate(event.target.value)}
                            />
                        </FormField>

                        <div className="row">
                            <div className="col">
                                <FormField label="Peso (kg)" htmlFor="peso">
                                    <input id="peso" type="number" step="0.1" min={1} max={500} className="form-control"
                                        placeholder="68" value={peso} onChange={(event) => setPeso(event.target.value)} />
                                </FormField>
                            </div>
                            <div className="col">
                                <FormField label="Altura (cm)" htmlFor="altura">
                                    <input id="altura" type="number" min={30} max={300} className="form-control"
                                        placeholder="168" value={altura} onChange={(event) => setAltura(event.target.value)} />
                                </FormField>
                            </div>
                        </div>

                        <FormField label="Sexo" htmlFor="sexo">
                            <select id="sexo" className="form-select" value={sexo} onChange={(event) => setSexo(event.target.value)}>
                                <option value="">Selecione</option>
                                {sexos.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </FormField>

                        <FormField label="Nível de atividade" htmlFor="atividade">
                            <select id="atividade" className="form-select" value={atividade} onChange={(event) => setAtividade(event.target.value)}>
                                <option value="">Selecione</option>
                                {niveisAtividade.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </FormField>

                        <FormField label="Objetivo" htmlFor="objetivo">
                            <select id="objetivo" className="form-select" value={objetivo} onChange={(event) => setObjetivo(event.target.value)}>
                                <option value="">Selecione</option>
                                {objetivos.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </FormField>

                        <FormField label="URL do avatar" htmlFor="avatarUrl" help="Endereço de uma imagem na internet.">
                            <input
                                id="avatarUrl"
                                className="form-control"
                                placeholder="https://exemplo.com/avatar.jpg"
                                value={avatarUrl}
                                onChange={(event) => setAvatarUrl(event.target.value)}
                            />
                        </FormField>
                    </FormCard>
                </div>

                <div className="col-lg-8">
                    <ProfileList
                        profiles={profiles}
                        editingId={id}
                        onEdit={edit}
                        onRemove={(profileId) => void remove(profileId)}
                    />
                </div>
            </div>
        </main>
    );
}
