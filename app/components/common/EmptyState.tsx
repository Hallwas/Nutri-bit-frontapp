type Props = {
    message: string;
};

export default function EmptyState({ message }: Props) {
    return (
        <div className="painel text-center text-secondary p-4">
            {message}
        </div>
    );
}
