import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthState, Design, Customization } from "./types"

// Mock user data
const MOCK_USERS = [
  {
    id: "user-1",
    email: "test@sneakerstudio.com",
    password: "Password123!",
  },
]

// Auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: async (email: string, password: string) => {
        const user = MOCK_USERS.find((u) => u.email === email && u.password === password)
        if (!user) {
          throw new Error("Invalid email or password")
        }
        const token = btoa(`${user.id}:${Date.now()}`)
        set({ user, token })
      },
      signup: async (email: string, password: string) => {
        const existingUser = MOCK_USERS.find((u) => u.email === email)
        if (existingUser) {
          throw new Error("User already exists")
        }
        const newUser = {
          id: `user-${Date.now()}`,
          email,
          password,
        }
        MOCK_USERS.push(newUser)
        const token = btoa(`${newUser.id}:${Date.now()}`)
        set({ user: newUser, token })
      },
      logout: () => {
        set({ user: null, token: null })
      },
      isAuthenticated: () => {
        return !!get().token
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

// Customizer store
interface CustomizerState {
  selectedProduct: string | null
  customizations: Customization
  setSelectedProduct: (productId: string) => void
  updateCustomization: (part: string, changes: any) => void
  resetCustomizations: () => void
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
  selectedProduct: null,
  customizations: {},
  setSelectedProduct: (productId) => set({ selectedProduct: productId, customizations: {} }),
  updateCustomization: (part, changes) =>
    set((state) => ({
      customizations: {
        ...state.customizations,
        [part]: { ...state.customizations[part], ...changes },
      },
    })),
  resetCustomizations: () => set({ customizations: {} }),
}))

// Gallery store
interface GalleryState {
  designs: Design[]
  addDesign: (design: Design) => void
  updateDesign: (id: string, design: Partial<Design>) => void
  deleteDesign: (id: string) => void
  getDesignById: (id: string) => Design | undefined
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      designs: [],
      addDesign: (design) => set((state) => ({ designs: [...state.designs, design] })),
      updateDesign: (id, updates) =>
        set((state) => ({
          designs: state.designs.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),
      deleteDesign: (id) =>
        set((state) => ({
          designs: state.designs.filter((d) => d.id !== id),
        })),
      getDesignById: (id) => get().designs.find((d) => d.id === id),
    }),
    {
      name: "gallery-storage",
    },
  ),
)
