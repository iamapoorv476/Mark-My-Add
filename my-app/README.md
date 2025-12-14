# Sneaker Studio - Custom Sneaker Designer

A powerful web application that lets you design your dream sneakers with real-time customization tools, AI-powered suggestions, and design management.

## Features

- **User Authentication**: Secure JWT-based authentication with email/password
- **Product Customization**: Choose from multiple sneaker models and customize colors, materials, and text
- **Live Preview**: Real-time 2D preview with zoom controls
- **Design Gallery**: Save, view, edit, and delete your custom designs
- **AI Suggestions**: Get AI-powered design recommendations based on natural language prompts
- **Search & Filter**: Find designs quickly with search and tag filtering

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript
- **State Management**: Zustand
- **UI Components**: Shadcn UI with Tailwind CSS v4
- **AI Integration**: Vercel AI SDK with OpenAI
- **Authentication**: JWT with bcrypt (mock implementation)

## Getting Started

### Test Credentials

- Email: `test@sneakerstudio.com`
- Password: `Password123!`

### Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Run the development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to start designing!

## How It Works

### For Kids (50 words)

Imagine you could color and decorate your own sneakers on a computer! Sneaker Studio lets you pick a shoe, choose colors for different parts, add cool materials like leather or canvas, and even write your name on it. You can save all your designs and make new ones anytime!

## Features Walkthrough

1. **Login/Signup**: Create an account or login with existing credentials
2. **Select a Sneaker**: Choose from Air Max 90, Air Jordan 1, or Nike Dunk Low
3. **Customize**: Pick colors for each part, select materials, and add custom text
4. **Get AI Help**: Ask the AI assistant for design suggestions like "summer vibes" or "sporty look"
5. **Preview**: See your design in real-time with zoom controls
6. **Save**: Store your designs in the gallery
7. **Gallery**: View, search, filter, edit, or delete your saved designs

## Project Structure

\`\`\`
├── app/
│   ├── api/suggestions/      # AI suggestion API route
│   ├── gallery/              # Design gallery page
│   ├── studio/               # Main customizer page
│   └── page.tsx              # Login/Signup page
├── components/
│   ├── auth/                 # Authentication forms
│   ├── gallery/              # Gallery components
│   ├── studio/               # Customizer components
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── store.ts              # Zustand stores
│   ├── types.ts              # TypeScript types
│   └── mock-data.ts          # Mock product data
└── public/                   # Static assets
\`\`\`

## Future Enhancements

- Real backend with PostgreSQL/Supabase
- High-resolution image export
- 3D sneaker preview
- Social sharing features
- Admin dashboard for product management
- Payment integration for ordering real sneakers

## License

MIT

---

Built with v0 by Vercel
