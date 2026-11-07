type Props = {
    onEdit: () => void;
    onRemove: () => void;
};

export default function ActionButtons({ onEdit, onRemove }: Props) {
    return (
        <div className="d-flex gap-3 flex-shrink-0">
            <button type="button" className="btn btn-link btn-sm p-0 fw-semibold text-decoration-none" onClick={onEdit}>
                Editar
            </button>
            <button type="button" className="btn btn-link btn-sm p-0 fw-semibold text-decoration-none link-danger" onClick={onRemove}>
                Excluir
            </button>
        </div>
    );
}
