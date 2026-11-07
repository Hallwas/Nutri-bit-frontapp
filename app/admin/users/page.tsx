"use client";

import { authHeaders } from "@/app/login/auth_service";
import { useEffect, useState } from "react";
import { User } from "@/app/types";
import Alert from "@/app/components/common/Alert";
import FormCard from "@/app/components/common/FormCard";
import FormField from "@/app/components/common/FormField";
import PageHeader from "@/app/components/common/PageHeader";
import UserList from "@/app/components/user/UserList";

export default function Users() {

    const API = "http://localhost:3000/api/users";

    const [id, setId] = useState<number | string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");

    function edit(user: User) {
        setId(user.id);
        setName(user.name);
        setEmail(user.email);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function clear() {
        setId(null);
        setName("");
        setEmail("");
        setError("");
    }

    async function remove(userId: User["id"]) {
        const response = await fetch(`${API}/${userId}`, {
            method: "DELETE",
            headers: authHeaders(),
        });
        if (!response.ok) throw new Error();
        await load();
    }

    async function load() {
        try {
            const response = await fetch(API, { headers: authHeaders() });
            if (!response.ok)
                throw new Error("Não foi possível carregar os usuários.");
            setUsers(await response.json());
        } catch {
            setError("Não foi possível carregar os usuários. Verifique a API.");
        }
    }

    async function save(event: any) {
        event.preventDefault();
        const response = await fetch(id === null ? API : `${API}/${id}`, {
            method: id === null ? "POST" : "PUT",
            headers: authHeaders(),
            body: JSON.stringify({
                name: name,
                email: email,
                passwordHash: "123456",
            }),
        })
        clear();
        await load();
    }

    useEffect(() => {
        void load();
    }, []);

    return (
        <main>
            <PageHeader
                title="Usuários"
                subtitle="Cadastre, visualize e edite os usuários do sistema."
            />

            <Alert type="danger" message={error} onClose={() => setError("")} />

            <div className="row g-4">
                <div className="col-lg-4">
                    <FormCard
                        title={id === null ? "Novo usuário" : "Editando usuário"}
                        submitLabel={id === null ? "Cadastrar" : "Salvar alterações"}
                        clearLabel={id === null ? "Limpar campos" : "Cancelar edição"}
                        onSubmit={save}
                        onClear={clear}
                    >
                        <FormField label="Nome" htmlFor="name" required>
                            <input
                                id="name"
                                className="form-control"
                                placeholder="Informe o nome"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                required
                            />
                        </FormField>
                        <FormField label="E-mail" htmlFor="email" required>
                            <input
                                id="email"
                                className="form-control"
                                type="email"
                                placeholder="nome@exemplo.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </FormField>
                    </FormCard>
                </div>

                <div className="col-lg-8">
                    <UserList
                        users={users}
                        editingId={id}
                        onEdit={edit}
                        onRemove={(userId) => void remove(userId)}
                    />
                </div>
            </div>
        </main>
    );
}
