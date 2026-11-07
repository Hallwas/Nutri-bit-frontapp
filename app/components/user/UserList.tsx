"use client";

import { useState } from "react";
import { User } from "@/app/types";
import ActionButtons from "@/app/components/common/ActionButtons";
import ListSection from "@/app/components/common/ListSection";
import UserCell from "@/app/components/common/UserCell";

type Props = {
    users: User[];
    editingId: number | string | null;
    onEdit: (user: User) => void;
    onRemove: (id: number) => void;
};

export default function UserList({ users, editingId, onEdit, onRemove }: Props) {
    const [search, setSearch] = useState("");

    const filtered = users.filter((u) =>
        `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ListSection
            title="Usuários cadastrados"
            search={search}
            searchPlaceholder="Buscar por nome ou e-mail"
            onSearchChange={setSearch}
        >
            {filtered.length === 0 ? (
                <p className="text-secondary small mb-0">Nenhum usuário encontrado.</p>
            ) : (
                <ul className="list-group list-group-flush filete">
                    {filtered.map((user) => (
                        <li
                            key={user.id}
                            className={`list-group-item px-0 d-flex align-items-center justify-content-between gap-3 py-3 ${
                                user.id === editingId ? "list-group-item-primary" : ""
                            }`}
                        >
                            <UserCell name={user.name} email={user.email} />
                            <ActionButtons
                                onEdit={() => onEdit(user)}
                                onRemove={() => onRemove(user.id)}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </ListSection>
    );
}
