"use client";

import Link from "next/link";
import PageHeader from "@/app/components/common/PageHeader";

const opcoes = [
    { href: "/admin/users", titulo: "Usuários", descricao: "Cadastre e edite os usuários do sistema." },
    { href: "/admin/profiles", titulo: "Perfis", descricao: "Gerencie os perfis vinculados aos usuários." },
];

export default function Admin() {
    return (
        <main>
            <PageHeader title="Painel Administrativo" subtitle="Escolha o que deseja gerenciar." />

            <div className="painel list-group list-group-flush px-3" style={{ maxWidth: 560 }}>
                {opcoes.map((opcao) => (
                    <Link
                        key={opcao.href}
                        href={opcao.href}
                        className="list-group-item list-group-item-action px-0 d-flex justify-content-between align-items-center py-3"
                    >
                        <div>
                            <div className="fw-semibold">{opcao.titulo}</div>
                            <small className="text-secondary">{opcao.descricao}</small>
                        </div>
                        <span className="text-primary fw-bold small">Abrir</span>
                    </Link>
                ))}
            </div>
        </main>
    );
}
