import type { Corner } from '../types/room'
import type { Line } from '../types/geometry'
import { getUniqueWalls } from './geometry'
import { TriangleCalculator } from './triangleCalculator'

export interface Dimension {
  id: string
  length: Line
  width: Line
  lengthDistance: number
  widthDistance: number
}

export interface DimensionOption {
  id: string
  length: Line
  width: Line
  lengthDistance: number
  widthDistance: number
  description: string
}

// Generate all possible dimension combinations with triangle-based calculations
export function generateAllDimensionCombinations(corners: Corner[]): DimensionOption[] {
  const walls = getUniqueWalls(corners)
  const options: DimensionOption[] = []

  // For each wall, create a dimension with width and length axes
  walls.forEach((wall, index) => {
    const wallLine: Line = { start: wall.start, end: wall.end }

    // Calculate width and length using triangle method
    const widthResult = TriangleCalculator.calculateWidth(wallLine, corners)
    const lengthResult = TriangleCalculator.calculateLength(wallLine, corners)

    const option: DimensionOption = {
      id: `dim_${wall.id}_${index}`,
      length: { start: lengthResult.start, end: lengthResult.end },
      width: { start: widthResult.start, end: widthResult.end },
      lengthDistance: lengthResult.distance,
      widthDistance: widthResult.distance,
      description: `Length: ${lengthResult.distance.toFixed(1)} units, Width: ${widthResult.distance.toFixed(1)} units`,
    }

    options.push(option)
  })

  return options
}
