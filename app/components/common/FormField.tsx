type Props = {
    label: string;
    htmlFor: string;
    required?: boolean;
    help?: string;
    children: React.ReactNode;
};

export default function FormField({ label, htmlFor, required, help, children }: Props) {
    return (
        <div className="mb-3">
            <label className="form-label small fw-semibold mb-1" htmlFor={htmlFor}>
                {label} {required && <span className="text-danger">*</span>}
            </label>
            {children}
            {help && <div className="form-text">{help}</div>}
        </div>
    );
}
