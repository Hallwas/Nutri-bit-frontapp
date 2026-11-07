import Link from "next/link";
import SiteHeader from "./SiteHeader";

type Props = {
    title: string;
    subtitle: string;
    children: React.ReactNode;
};

export default function AuthLayout({ title, subtitle, children }: Props) {
    return (
        <>
            <SiteHeader>
                <Link href="/" className="btn btn-outline-dark btn-sm">Voltar</Link>
            </SiteHeader>

            <main className="container flex-grow-1 d-flex align-items-center py-5">
                <div className="row g-5 align-items-center w-100">
                    <div className="col-lg-6">
                        <h1 className="display-4 mb-2">{title}</h1>
                        <p className="text-secondary mb-0">{subtitle}</p>
                    </div>
                    <div className="col-lg-5 offset-lg-1">
                        {children}
                    </div>
                </div>
            </main>
        </>
    );
}
