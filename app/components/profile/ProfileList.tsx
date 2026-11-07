"use client";

import { useState } from "react";
import { Profile } from "@/app/types";
import ActionButtons from "@/app/components/common/ActionButtons";
import Avatar from "@/app/components/common/Avatar";
import ListSection from "@/app/components/common/ListSection";
import { objetivos, rotulo } from "@/app/(usuario)/opcoes";

type Props = {
    profiles: Profile[];
    editingId: number | null;
    onEdit: (profile: Profile) => void;
    onRemove: (id: number) => void;
};

function formatDate(iso: string | null) {
    return iso ? new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "não informada";
}

export default function ProfileList({ profiles, editingId, onEdit, onRemove }: Props) {
    const [search, setSearch] = useState("");

    const filtered = profiles.filter((p) =>
        `${p.user.name} ${p.user.email} ${p.fullName}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ListSection
            title="Perfis cadastrados"
            search={search}
            searchPlaceholder="Buscar por usuário ou nome"
            onSearchChange={setSearch}
        >
            {filtered.length === 0 ? (
                <p className="text-secondary small mb-0">Nenhum perfil encontrado.</p>
            ) : (
                <div className="row g-3">
                    {filtered.map((profile) => (
                        <div className="col-md-6" key={profile.id}>
                            <div
                                className={`border h-100 d-flex flex-column ${
                                    profile.id === editingId ? "bg-success-subtle" : ""
                                }`}
                            >
                                <div className="p-3 d-flex gap-3">
                                    <Avatar url={profile.avatarUrl} name={profile.fullName} size={64} />
                                    <div className="overflow-hidden">
                                        <h3 className="h6 fw-bold mb-1 text-truncate">{profile.fullName}</h3>
                                        <div className="small text-secondary">
                                            Nascimento: {formatDate(profile.birthDate)}
                                        </div>
                                        <div className="small text-secondary">
                                            Medidas: {profile.weight ? `${profile.weight.toLocaleString("pt-BR")} kg` : "—"}, {profile.height ? `${profile.height} cm` : "—"}
                                        </div>
                                        <div className="small text-secondary">
                                            Objetivo: {rotulo(objetivos, profile.goal) || "não informado"}
                                        </div>
                                        <div className="small text-truncate">
                                            <span className="text-secondary">Usuário:</span> {profile.user.name}
                                        </div>
                                        <div className="small text-secondary text-truncate">{profile.user.email}</div>
                                    </div>
                                </div>
                                <div className="mt-auto d-flex justify-content-end px-3 pb-3">
                                    <ActionButtons
                                        onEdit={() => onEdit(profile)}
                                        onRemove={() => onRemove(profile.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ListSection>
    );
}
