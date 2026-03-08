// Drink types with their hydration factors
export const DRINK_TYPES = {
  WATER: 'Water',
  LEMON_WATER: 'Lemon Water',
  COCONUT_WATER: 'Coconut Water',
  MILK_TEA: 'Milk Tea (Cha)',
  BLACK_TEA: 'Black Tea',
  COFFEE: 'Coffee',
  LASSI: 'Lassi',
  BORHANI: 'Borhani',
  SUGARCANE_JUICE: 'Sugarcane Juice',
  FRESH_FRUIT_JUICE: 'Fresh Fruit Juice',
  SOFT_DRINK: 'Soft Drink',
  ENERGY_DRINK: 'Energy Drink',
} as const

export type DrinkType = (typeof DRINK_TYPES)[keyof typeof DRINK_TYPES]

// Hydration factors for each drink type
export const HYDRATION_FACTORS: Record<DrinkType, number> = {
  [DRINK_TYPES.WATER]: 1.0,
  [DRINK_TYPES.COCONUT_WATER]: 1.0,
  [DRINK_TYPES.LEMON_WATER]: 0.95,
  [DRINK_TYPES.FRESH_FRUIT_JUICE]: 0.85,
  [DRINK_TYPES.LASSI]: 0.80,
  [DRINK_TYPES.BORHANI]: 0.75,
  [DRINK_TYPES.BLACK_TEA]: 0.75,
  [DRINK_TYPES.MILK_TEA]: 0.70,
  [DRINK_TYPES.COFFEE]: 0.65,
  [DRINK_TYPES.ENERGY_DRINK]: 0.55,
  [DRINK_TYPES.SOFT_DRINK]: 0.50,
  [DRINK_TYPES.SUGARCANE_JUICE]: 0.85,
}

// Quick drink sizes
export const DRINK_SIZES = {
  SMALL: { label: 'Small Glass', ml: 150 },
  MEDIUM: { label: 'Medium Glass', ml: 250 },
  LARGE: { label: 'Large Glass', ml: 350 },
  BOTTLE: { label: 'Bottle', ml: 500 },
} as const

export type DrinkSize = keyof typeof DRINK_SIZES

// Quick drink options for home screen
export const QUICK_DRINKS = [
  { type: DRINK_TYPES.WATER, icon: '💧', defaultMl: 250 },
  { type: DRINK_TYPES.MILK_TEA, icon: '🧋', defaultMl: 250 },
  { type: DRINK_TYPES.COFFEE, icon: '☕', defaultMl: 150 },
  { type: DRINK_TYPES.FRESH_FRUIT_JUICE, icon: '🧃', defaultMl: 250 },
] as const

// Drink log entry
export interface DrinkLogEntry {
  id: string
  drinkType: string
  quantityMl: number
  hydrationAmount: number
  icon?: string
  createdAt: Date
}

// User profile
export interface UserProfile {
  id: string
  email: string
  name?: string
  weight?: number
  weightUnit?: 'kg' | 'lbs'
  height?: number
  heightUnit?: 'cm' | 'ft'
  avatarColor?: string
  avatarImage?: string
  dateOfBirth?: Date | string
  dailyGoal: number
  createdAt?: Date
  updatedAt?: Date
  remindersEnabled?: boolean
  reminderStart?: string
  reminderEnd?: string
  reminderInterval?: number
}

// Daily goal options
export const DAILY_GOAL_OPTIONS = [2000, 2500, 3000] as const

// Hydration status messages
export function getHydrationMessage(percentage: number): string {
  if (percentage <= 30) return "You need to drink more water today"
  if (percentage <= 70) return "Good progress. Keep sipping!"
  if (percentage <= 100) return "You're close to your hydration goal"
  return "Great job staying hydrated!"
}

// Calculate hydration amount
export function calculateHydration(quantityMl: number, drinkType: DrinkType): number {
  const factor = HYDRATION_FACTORS[drinkType] || 1.0
  return Math.round(quantityMl * factor)
}
