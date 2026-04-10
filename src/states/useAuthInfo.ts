import { create } from 'zustand'

export interface AuthInfo {
  status: string | null
  exp_date: string | null
}

export interface AuthInfoState {
  authInfo: AuthInfo
  updateAuthInfo: (authInfo: AuthInfo) => void
  reset: () => void
}

const initialState: AuthInfo = {
  status: null,
  exp_date: null
}

export const useAuthInfo = create<AuthInfoState>((set) => ({
  authInfo: initialState,
  updateAuthInfo: (authInfo: AuthInfo) => set({ authInfo }),
  reset: () => set({ authInfo: initialState })
}))
