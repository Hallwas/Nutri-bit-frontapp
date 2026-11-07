type Props = {
    title: string;
    submitLabel: string;
    clearLabel: string;
    onSubmit: (event: any) => void;
    onClear: () => void;
    children: React.ReactNode;
};

export default function FormCard({ title, submitLabel, clearLabel, onSubmit, onClear, children }: Props) {
    return (
        <form onSubmit={onSubmit} className="painel p-3">
            <h2 className="h5 mb-3">{title}</h2>

            {children}

            <div className="d-flex gap-2 mt-3">
                <button className="btn btn-primary" type="submit">
                    {submitLabel}
                </button>
                <button className="btn btn-outline-dark" type="button" onClick={onClear}>
                    {clearLabel}
                </button>
            </div>
        </form>
    );
}
