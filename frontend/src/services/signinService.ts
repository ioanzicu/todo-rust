import apiRequest from "./apiClient";

export const signIn = (username: string, email: string, password: string) => apiRequest<any>("/v1/user/create", 'POST', {
    "name": username,
    email,
    password
});
