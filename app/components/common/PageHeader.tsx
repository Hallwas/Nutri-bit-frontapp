type Props = {
    title: string;
    subtitle?: string;
    badge?: string;
    children?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, badge, children }: Props) {
    return (
        <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
                <h1 className="titulo-grande mb-1">{title}</h1>
                {subtitle && <p className="text-secondary mb-0">{subtitle}</p>}
                {badge && <span className="badge destaque">{badge}</span>}
            </div>
            {children && <div className="d-flex gap-2">{children}</div>}
        </div>
    );
}
