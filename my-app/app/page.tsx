"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-balance">Sneaker Studio</h1>
          <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
            Design your dream sneakers with our powerful customization tools. Choose colors, materials, and add personal
            touches to create unique footwear.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-2 rounded-full bg-accent" />
              <span>Real-time preview</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-2 rounded-full bg-primary" />
              <span>Save designs</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-2 rounded-full bg-chart-3" />
              <span>AI suggestions</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {showLogin ? <LoginForm /> : <SignupForm />}
          <div className="text-center">
            <Button variant="ghost" onClick={() => setShowLogin(!showLogin)} className="text-sm">
              {showLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium mb-1">Test Credentials:</p>
            <p>Email: test@sneakerstudio.com</p>
            <p>Password: Password123!</p>
          </div>
        </div>
      </div>
    </main>
  )
}
