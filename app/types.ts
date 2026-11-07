export type User = {
    id: number;
    name: string;
    email: string;
};

export type Profile = {
    id: number;
    userId: number;
    fullName: string;
    birthDate: string | null;
    avatarUrl: string | null;
    weight?: number | null;        // kg
    height?: number | null;        // cm
    sex?: string | null;
    activityLevel?: string | null;
    goal?: string | null;
    dailyCalories?: number | null;
    missing?: string[];
    user: User;
};

export type Totais = {
    calorias: number;
    proteinas: number;
    carboidratos: number;
};

// Alimento da tabela TBCA (valores por 100 g, podem vir nulos)
export type Food = {
    id: number;
    name: string;
    calorias: number | null;
    proteinas: number | null;
    carboidratosDisponiveis: number | null;
};

export type Ingredient = Totais & {
    id: number;
    quantity: number;
    unit: string;
    grams: number | null;
    note: string | null;
    food: { id: number; name: string };
};

export type Meal = Totais & {
    id: number;
    name: string;
    type: string;
    time: string | null;
    ingredients: Ingredient[];
};

export type Day = Totais & {
    id: number;
    weekday: string;
    order: number;
    meals: Meal[];
};

export type Week = {
    id: number;
    number: number;
    label: string | null;
    days: Day[];
};

export type MealPlan = {
    id: number;
    name: string;
    goal: string;
    description: string | null;
    active: boolean;
    weeks: Week[];
};

export type MealPlanSummary = {
    id: number;
    name: string;
    goal: string;
    active: boolean;
    weeksCount: number;
};

export type MealPlanTemplate = {
    id: number;
    name: string;
    goal: string;
    description: string | null;
    calories: number;
    weeksCount: number;
    bestMatch: boolean;
};
