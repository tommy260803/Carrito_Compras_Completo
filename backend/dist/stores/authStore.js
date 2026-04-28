"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuthStore = void 0;
const zustand_1 = require("zustand");
const middleware_1 = require("zustand/middleware");
const auth_service_1 = require("../services/auth.service");
exports.useAuthStore = (0, zustand_1.create)()((0, middleware_1.persist)((set, get) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    login: async (email, password) => {
        const res = await auth_service_1.authService.login(email, password);
        set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken, isAuthenticated: true });
    },
    logout: () => {
        auth_service_1.authService.logout(get().refreshToken);
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    },
    refresh: async () => {
        const newTokens = await auth_service_1.authService.refreshToken(get().refreshToken);
        set({ accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken });
    },
}), { name: 'auth-storage' }));
//# sourceMappingURL=authStore.js.map