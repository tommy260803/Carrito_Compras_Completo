export declare const authService: {
    register(data: {
        email: string;
        password: string;
        nombre: string;
        apellido: string;
    }): Promise<{
        user: {
            id: number;
            email: string;
            nombre: string;
            rol: number;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            rol: number;
        };
    }>;
    generateAccessToken(user: any): string;
    generateRefreshToken(userId: number, rol: number): Promise<string>;
    refreshToken(oldToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    getUserById(userId: number): Promise<{
        id: number;
        email: string;
        nombre: string | null;
        apellido: string | null;
        rol: string;
        telefono?: undefined;
    } | {
        id: number;
        email: string;
        nombre: string;
        apellido: string;
        telefono: string | null;
        rol: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map