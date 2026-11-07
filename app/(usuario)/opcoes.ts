
export const sexos = [
    { value: "F", label: "Feminino" },
    { value: "M", label: "Masculino" },
];

export const niveisAtividade = [
    { value: "sedentary", label: "Sedentário" },
    { value: "light", label: "Leve, 1 a 2 treinos por semana" },
    { value: "moderate", label: "Moderado, 3 a 5 treinos por semana" },
    { value: "intense", label: "Intenso, 6 ou mais treinos por semana" },
];

export const objetivos = [
    { value: "lose", label: "Perder peso", descricao: "Déficit calórico moderado, sem cortar nutrientes." },
    { value: "maintain", label: "Manter o peso", descricao: "Calorias no nível do seu gasto diário." },
    { value: "gain", label: "Ganhar massa", descricao: "Mais calorias e proteína para treinar e crescer." },
    { value: "eat_better", label: "Comer melhor", descricao: "Refeições equilibradas, sem foco em peso." },
];

export const camposDoPerfil = [
    { value: "weight", label: "Peso" },
    { value: "height", label: "Altura" },
    { value: "birthDate", label: "Data de nascimento" },
    { value: "sex", label: "Sexo" },
    { value: "activityLevel", label: "Nível de atividade" },
    { value: "goal", label: "Objetivo" },
];

export const tiposRefeicao = [
    { value: "breakfast", label: "Café da manhã" },
    { value: "lunch", label: "Almoço" },
    { value: "snack", label: "Lanche" },
    { value: "dinner", label: "Jantar" },
];

export function rotulo(opcoes: { value: string; label: string }[], value?: string | null) {
    return opcoes.find((o) => o.value === value)?.label ?? value ?? "";
}

// Unidades que a API já entende como gramas (as outras precisam do campo "gramas")
export function unidadeEmGramas(unidade: string) {
    return ["g", "ml"].includes(unidade.trim().toLowerCase());
}

export function nomeDoDia(weekday: string) {
    return weekday === "Sábado" || weekday === "Domingo" ? weekday : `${weekday}-feira`;
}
