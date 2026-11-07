const TOKEN_KEY = "auth_token";

export function saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    return typeof window !== "undefined" 
    ? localStorage.getItem(TOKEN_KEY) 
    : null;
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

// Lê os dados do usuário que estão dentro do token JWT (parte do meio)
export function getLoggedUser(): { id: number; name: string; email: string; role: string } | null {
    const token = getToken();
    if (!token) return null;
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const texto = new TextDecoder().decode(Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)));
    const payload = JSON.parse(texto);
    return { id: payload.sub, name: payload.name, email: payload.email, role: payload.role ?? "user" };
}

export function isAdmin(): boolean {
    return getLoggedUser()?.role === "admin";
}

export function authHeaders() {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    };
}

export const API = "http://localhost:3000/api";

// fetch para a API já com o token. Se o token não vale mais (401), volta ao login.
export async function apiFetch(path: string, options: RequestInit = {}) {
    const resp = await fetch(`${API}${path}`, { ...options, headers: authHeaders() });
    if (resp.status === 401) {
        clearToken();
        window.location.href = "/login";
    }
    return resp;
}

// Mensagem de erro da API (no erro 400 o "message" vem como lista)
export async function apiError(resp: Response): Promise<string> {
    try {
        const err = await resp.json();
        return Array.isArray(err.message) ? err.message.join(", ") : err.message;
    } catch {
        return "Não foi possível falar com a API.";
    }
}
