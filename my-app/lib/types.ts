export interface User {
  id: string
  email: string
  password: string
}

export interface Product {
  id: string
  name: string
  baseImage: string
  customizableParts: string[]
  options: {
    colors: string[]
    materials: string[]
  }
}

export interface Customization {
  [key: string]: {
    color?: string
    material?: string
    value?: string // Added this to support text customization
  } | undefined
}

export interface Design {
  id: string
  userId: string
  productId: string
  customizations: Customization
  previewImage: string
  tags: string[]
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  setHasHydrated: () => void  
  hasHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
}