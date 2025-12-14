import type { Product } from "./types"

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "air-max-90",
    name: "Air Max 90",
    baseImage: "/nike-air-max-90-white-sneaker-side-view.jpg",
    customizableParts: ["sole", "upper", "laces", "swoosh"],
    options: {
      colors: ["#FF0000", "#0000FF", "#000000", "#FFFFFF", "#00FF00", "#FFFF00", "#FF00FF"],
      materials: ["leather", "canvas", "mesh"],
    },
  },
  {
    id: "jordan-1",
    name: "Air Jordan 1",
    baseImage: "/air-jordan-1-white-sneaker-side-view.jpg",
    customizableParts: ["sole", "upper", "laces", "swoosh", "collar"],
    options: {
      colors: ["#FF0000", "#0000FF", "#000000", "#FFFFFF", "#00FF00", "#FFFF00", "#FF00FF"],
      materials: ["leather", "suede", "patent"],
    },
  },
  {
    id: "dunk-low",
    name: "Nike Dunk Low",
    baseImage: "/nike-dunk-low-white-sneaker-side-view.jpg",
    customizableParts: ["sole", "upper", "laces", "swoosh"],
    options: {
      colors: ["#FF0000", "#0000FF", "#000000", "#FFFFFF", "#00FF00", "#FFFF00", "#FF00FF"],
      materials: ["leather", "canvas", "suede"],
    },
  },
]
