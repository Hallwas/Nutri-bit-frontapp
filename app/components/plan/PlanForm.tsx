"use client";

import { useState } from "react";
import FormCard from "../common/FormCard";
import FormField from "../common/FormField";
import { objetivos } from "@/app/(usuario)/opcoes";

export type PlanFormData = {
    name: string;
    goal: string;
    description: string;
    active: boolean;
};

type Props = {
    title: string;
    submitLabel: string;
    initial?: PlanFormData;
    onSave: (dados: PlanFormData) => void;
    onCancel: () => void;
};

export default function PlanForm({ title, submitLabel, initial, onSave, onCancel }: Props) {
    const [name, setName] = useState(initial?.name ?? "");
    const [goal, setGoal] = useState(initial?.goal ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [active, setActive] = useState(initial?.active ?? false);

    function submit(event: any) {
        event.preventDefault();
        onSave({ name, goal, description, active });
    }

    return (
        <FormCard title={title} submitLabel={submitLabel} clearLabel="Cancelar" onSubmit={submit} onClear={onCancel}>
            <div className="row">
                <div className="col-md-6">
                    <FormField label="Nome do plano" htmlFor="planName">
                        <input id="planName" className="form-control" placeholder="Ganho de massa"
                            value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={120} required />
                    </FormField>
                </div>
                <div className="col-md-6">
                    <FormField label="Objetivo" htmlFor="planGoal">
                        <select id="planGoal" className="form-select" value={goal} onChange={(e) => setGoal(e.target.value)} required>
                            <option value="">Selecione</option>
                            {objetivos.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </FormField>
                </div>
            </div>

            <FormField label="Descrição" htmlFor="planDescription">
                <input id="planDescription" className="form-control" placeholder="Mais proteína e carboidrato nos treinos."
                    value={description} onChange={(e) => setDescription(e.target.value)} maxLength={1000} />
            </FormField>

            <div className="form-check">
                <input id="planActive" type="checkbox" className="form-check-input"
                    checked={active} onChange={(e) => setActive(e.target.checked)} />
                <label className="form-check-label small" htmlFor="planActive">Plano ativo</label>
            </div>
        </FormCard>
    );
}
