// src/api.js
// Cliente HTTP para o backend fluxo.
// Coloque a URL do seu backend em .env: VITE_API_URL=https://seu-backend.railway.app

const BASE = "https://monitoramento-financeiro-production-8bca.up.railway.app/api";

async function req(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || `Erro ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  login:    (email, password)       => req("POST", "/login",    { email, password }),
  register: (email, password, name) => req("POST", "/register", { email, password, name }),
  get:      (path, token)           => req("GET",  path, null, token),
  post:     (path, body, token)     => req("POST", path, body, token),
  put:      (path, body, token)     => req("PUT",  path, body, token),
  del:      (path, token)           => req("DELETE", path, null, token),
};
