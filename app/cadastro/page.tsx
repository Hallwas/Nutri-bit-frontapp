"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveToken } from "../login/auth_service";
import AuthLayout from "../components/common/AuthLayout";
import FormField from "../components/common/FormField";

export default function CadastroPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");

    async function submitForm(event: any) {
        event.preventDefault();
        setErro("");

        // o DTO do back-end espera a senha no campo "passwordHash"
        const resp = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, email: email, passwordHash: password }),
        });
        if (!resp.ok) {
            const error = await resp.json();
            setErro(Array.isArray(error.message) ? error.message.join(", ") : error.message);
            return;
        }
        const dados = await resp.json();
        saveToken(dados.access_token);
        router.replace("/objetivo");
    }

    return (
        <AuthLayout
            title="Criar conta"
            subtitle="Leva menos de um minuto. Depois do cadastro, você já pode preencher o seu perfil."
        >
            <form onSubmit={submitForm} className="painel p-3">
                {erro != "" && (
                    <div className="alert alert-danger py-2 small">{erro}</div>
                )}

                <FormField label="Nome" htmlFor="nome">
                    <input id="nome" className="form-control" placeholder="Informe o seu nome"
                        minLength={3} required onChange={(e) => setName(e.target.value)} />
                </FormField>

                <FormField label="E-mail" htmlFor="email">
                    <input id="email" type="email" className="form-control" placeholder="nome@exemplo.com"
                        required onChange={(e) => setEmail(e.target.value)} />
                </FormField>

                <FormField label="Senha" htmlFor="senha">
                    <input id="senha" type="password" className="form-control" placeholder="Mínimo de 6 caracteres"
                        minLength={6} required onChange={(e) => setPassword(e.target.value)} />
                </FormField>

                <button className="btn btn-primary w-100" type="submit">Criar conta</button>

                <p className="small text-secondary mt-3 mb-0">
                    Já tem conta? <Link href="/login" className="fw-bold">Entrar</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
