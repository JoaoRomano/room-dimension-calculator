import type { Corner } from '../types/room'
import type { Point, Line } from '../types/geometry'
import { distance, createVector, normalizeVector } from './geometry'

export interface TriangleResult {
  thirdCorner: Point
  distance: number
}

export interface DimensionResult {
  start: Point
  end: Point
  distance: number
}

export class TriangleCalculator {
  private static readonly TOLERANCE = 0.01

  /**
   * Create a right triangle with right angle at the third corner
   * @param wallPoint - One vertex of the triangle (A)
   * @param cornerPoint - Another vertex of the triangle (C)
   * @param wallLine - The line that the third corner should lie on
   * @returns The third corner (X) where the right angle is located
   */
  static createRightTriangle(
    wallPoint: Point,
    cornerPoint: Point,
    wallLine: Line,
  ): TriangleResult | null {
    // Calculate the wall vector
    const wallVector = createVector(wallLine.start, wallLine.end)
    const cornerWallVector = createVector(wallPoint, cornerPoint)

    // The third corner (X) is on the wall line
    // We need to find the point X on the wall line such that:
    // - A-X is perpendicular to X-C
    // - This forms a right triangle with right angle at X

    // Project the corner point onto the wall line
    const wallUnitVector = normalizeVector(wallVector)
    const projection = cornerWallVector.x * wallUnitVector.x + cornerWallVector.y * wallUnitVector.y

    // The third corner is the projection point on the wall line
    const thirdCorner = {
      x: wallPoint.x + projection * wallUnitVector.x,
      y: wallPoint.y + projection * wallUnitVector.y,
    }

    const dist = distance(wallPoint, thirdCorner)
    return { thirdCorner, distance: dist }
  }

  /**
   * Calculate width using right triangle trigonometry
   * Creates two triangles per corner: A-C-X and B-C-Y
   * @param wall - The wall line to calculate width for
   * @param corners - All room corners
   * @returns The extended wall line representing the width
   */
  static calculateWidth(wall: Line, corners: Corner[]): DimensionResult {
    const result = { start: wall.start, end: wall.end }
    let maxWidth = distance(wall.start, wall.end)

    // Filter out corners that are wall endpoints
    const validCorners = corners.filter((corner) => {
      return !this.isSamePoint(corner, wall.start) && !this.isSamePoint(corner, wall.end)
    })

    // For each corner, create two right triangles
    validCorners.forEach((corner) => {
      const cornerPoint = { x: corner.x, y: corner.y }

      // Create two right triangles: A-C-X and B-C-Y
      const triangle1 = this.createRightTriangle(wall.start, cornerPoint, wall) // A-C-X
      const triangle2 = this.createRightTriangle(wall.end, cornerPoint, wall) // B-C-Y

      if (triangle1 && triangle2) {
        // Use the larger distance as potential new width
        const newWidth = Math.max(triangle1.distance, triangle2.distance)

        // If this creates a bigger width, update maxWidth
        if (newWidth > maxWidth) {
          maxWidth = newWidth
          if (triangle1.distance > triangle2.distance) {
            result.end = triangle1.thirdCorner
          } else {
            result.start = triangle2.thirdCorner
          }
        }
      }
    })

    return {
      start: result.start,
      end: result.end,
      distance: maxWidth,
    }
  }

  /**
   * Calculate length using right triangle trigonometry
   * Creates one triangle per corner using perpendicular direction
   * @param wall - The wall line to calculate length for
   * @param corners - All room corners
   * @returns The length axis spanning the full perpendicular extent
   */
  static calculateLength(wall: Line, corners: Corner[]): DimensionResult {
    // Calculate the perpendicular direction to the wall
    const wallVector = createVector(wall.start, wall.end)
    const perpVector = {
      x: -wallVector.y,
      y: wallVector.x,
    }

    // Create a perpendicular line from the wall start point
    const perpLine: Line = {
      start: wall.start,
      end: {
        x: wall.start.x + perpVector.x,
        y: wall.start.y + perpVector.y,
      },
    }

    // Filter out corners that are the same as wall start point
    const validCorners = corners.filter((corner) => {
      return !this.isSamePoint(corner, wall.start)
    })

    let minDistance = 0
    let maxDistance = 0
    let minThirdCorner = wall.start
    let maxThirdCorner = wall.start

    validCorners.forEach((corner) => {
      const cornerPoint = { x: corner.x, y: corner.y }

      // Create one right triangle: A-C-X where A is wall.start, C is corner, X is third corner
      const triangle = this.createRightTriangle(wall.start, cornerPoint, perpLine)

      if (triangle) {
        // Calculate the signed distance along the perpendicular axis
        const thirdCornerVector = createVector(wall.start, triangle.thirdCorner)

        // Project onto the perpendicular vector to get signed distance
        const perpLength = Math.sqrt(perpVector.x * perpVector.x + perpVector.y * perpVector.y)
        const perpUnitVector = {
          x: perpVector.x / perpLength,
          y: perpVector.y / perpLength,
        }

        const signedDistance =
          thirdCornerVector.x * perpUnitVector.x + thirdCornerVector.y * perpUnitVector.y

        // Track both minimum and maximum distances
        if (signedDistance < minDistance) {
          minDistance = signedDistance
          minThirdCorner = triangle.thirdCorner
        }
        if (signedDistance > maxDistance) {
          maxDistance = signedDistance
          maxThirdCorner = triangle.thirdCorner
        }
      }
    })

    const totalDistance = distance(minThirdCorner, maxThirdCorner)
    return {
      start: minThirdCorner,
      end: maxThirdCorner,
      distance: totalDistance,
    }
  }

  /**
   * Check if two points are the same (within tolerance)
   */
  private static isSamePoint(point1: Point, point2: Point): boolean {
    return distance(point1, point2) < this.TOLERANCE
  }
}
