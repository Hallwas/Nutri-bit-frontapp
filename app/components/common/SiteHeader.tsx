"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdmin, isAuthenticated } from "@/app/login/auth_service";

type Props = {
    links?: { href: string; label: string }[];
    children?: React.ReactNode;
};

export default function SiteHeader({ links = [], children }: Props) {
    const pathname = usePathname();

    // item ativo: o link mais comprido que combina com a URL
    // (assim em /admin/users fica ativo "Usuários", e não "Início")
    const ativo = links
        .map((l) => l.href)
        .filter((href) => pathname === href || pathname.startsWith(href + "/"))
        .sort((a, b) => b.length - a.length)[0];

    const [inicio, setInicio] = useState("/");
    useEffect(() => {
        if (isAuthenticated()) setInicio(isAdmin() ? "/admin" : "/perfil");
    }, []);

    return (
        <header className="border-bottom border-dark">
            <div className="container d-flex justify-content-between align-items-center py-3">
                <div className="d-flex align-items-center gap-4">
                    <Link href={inicio} className="h5 fw-bolder mb-0 text-body text-decoration-none">Nutri-bit</Link>
                    <ul className="nav menu-nutri gap-3">
                        {links.map((link) => (
                            <li className="nav-item" key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`nav-link small ${link.href === ativo ? "active" : ""}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="d-flex gap-2">{children}</div>
            </div>
        </header>
    );
}
