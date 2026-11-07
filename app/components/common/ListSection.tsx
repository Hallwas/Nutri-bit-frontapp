import FormField from "./FormField";

type Props = {
    title: string;
    search: string;
    searchPlaceholder: string;
    onSearchChange: (value: string) => void;
    children: React.ReactNode;
};

export default function ListSection({ title, search, searchPlaceholder, onSearchChange, children }: Props) {
    return (
        <section className="painel p-3">
            <h2 className="h5 mb-3">{title}</h2>
            <FormField label="Buscar" htmlFor="busca">
                <input
                    id="busca"
                    type="search"
                    className="form-control"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </FormField>

            {children}
        </section>
    );
}
