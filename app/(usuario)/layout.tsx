"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearToken, isAuthenticated } from "../login/auth_service";
import SiteHeader from "../components/common/SiteHeader";

const menu = [
    { href: "/perfil", label: "Meu perfil" },
    { href: "/planos", label: "Planos alimentares" },
];

export default function UsuarioLayout({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const [autenticado, setAutenticado] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace("/login");
            return;
        }
        setAutenticado(true);
    }, [router]);

    function sair() {
        clearToken();
        router.replace("/login");
    }

    if (!autenticado) return null;

    return (
        <>
            <SiteHeader links={menu}>
                <button type="button" className="btn btn-outline-dark btn-sm" onClick={sair}>
                    Sair
                </button>
            </SiteHeader>

            <div className="container py-5">
                {children}
            </div>
        </>
    );
}
