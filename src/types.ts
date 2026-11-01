export interface Exercise {
  id: string
  name: string
  category: string
  body_part: string
  equipment: string
  target: string
  muscle_group: string
  secondary_muscles: string[]
  instructions: Record<string, string>
  instruction_steps: Record<string, string[]>
  image: string
  gif_url: string
  attribution: string
}

export interface Plan {
  id: string
  name: string
  exerciseIds: string[]
  createdAt: number
}
