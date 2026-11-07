"use client";

import { useState } from "react";
import Link from "next/link";
import { isAdmin, saveToken } from "./auth_service";
import { useRouter } from "next/navigation";
import AuthLayout from "../components/common/AuthLayout";
import FormField from "../components/common/FormField";

export default function LoginPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");

    async function submitForm(event: any) {
        console.log(event)
        event.preventDefault();
        setErro("");

       const resp = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email, password: password
            })
        })
        if (!resp.ok) {
            var error = await resp.json();
            setErro(error.message);
            return;
        }
        const dados = await resp.json();
        console.log(dados.access_token);
        saveToken(dados.access_token);
        router.replace(isAdmin() ? "/admin" : "/perfil");
    }

    return (
        <AuthLayout title="Entrar" subtitle="Acesse o seu perfil e os seus planos alimentares.">
            <form onSubmit={submitForm} className="painel p-3">
                {erro != "" && (
                    <div className="alert alert-danger py-2 small">{erro}</div>
                )}

                <FormField label="E-mail" htmlFor="email">
                    <input
                        id="email"
                        onChange={(e)=> setEmail(e.target.value)}
                        type="email"
                        className="form-control"
                        placeholder="nome@exemplo.com"
                        required />
                </FormField>

                <FormField label="Senha" htmlFor="senha">
                    <div className="input-group">
                        <input
                            id="senha"
                            onChange={(e)=> setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="••••••••"
                            required />
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            className="btn btn-link btn-sm text-secondary">
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                </FormField>

                <button className="btn btn-dark w-100" type="submit">
                    Entrar
                </button>

                <p className="small text-secondary mt-3 mb-0">
                    Não tem conta? <Link href="/cadastro" className="fw-bold">Criar conta</Link>
                </p>
            </form>
        </AuthLayout>
    );
}
