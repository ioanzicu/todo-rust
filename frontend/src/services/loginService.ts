import apiRequest from "./apiClient";

export const logIn = (username: string, password: string) => apiRequest<any>("/v1/auth/login", 'POST', {
    username,
    password
});
