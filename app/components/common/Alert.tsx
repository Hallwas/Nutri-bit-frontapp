type Props = {
    type: "success" | "danger";
    message: string;
    onClose: () => void;
};

export default function Alert({ type, message, onClose }: Props) {
    if (!message) return null;

    return (
        <div className={`alert alert-${type} alert-dismissible`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
    );
}
