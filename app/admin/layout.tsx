"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearToken, isAdmin, isAuthenticated } from "../login/auth_service";
import SiteHeader from "../components/common/SiteHeader";

const menu = [
    { href: "/admin", label: "Início" },
    { href: "/admin/users", label: "Usuários" },
    { href: "/admin/profiles", label: "Perfis" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {

    const router = useRouter();
    const [autenticado, setAutenticado] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.replace("/login");
            return;
        }
        if (!isAdmin()) {
            router.replace("/perfil");
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
