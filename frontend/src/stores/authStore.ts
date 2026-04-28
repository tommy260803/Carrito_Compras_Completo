import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth.service';

interface AuthState {
  user: any | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: async (email, password) => {
        const res = await authService.login({ email, password });
        localStorage.setItem('access_token', res.accessToken);
        localStorage.setItem('refresh_token', res.refreshToken);
        set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken, isAuthenticated: true });
      },
      logout: () => {
        authService.logout(get().refreshToken!);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
      refresh: async () => {
        const newTokens = await authService.refreshToken(get().refreshToken!);
        localStorage.setItem('access_token', newTokens.accessToken);
        localStorage.setItem('refresh_token', newTokens.refreshToken);
        set({ accessToken: newTokens.accessToken, refreshToken: newTokens.refreshToken });
      },
    }),
    { name: 'auth-storage' }
  )
);
