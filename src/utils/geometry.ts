import type { Corner } from '../types/room'
import type { Point, Vector, Wall } from '../types/geometry'

// Create a vector from two points
export function createVector(from: Point, to: Point): Vector {
  return {
    x: to.x - from.x,
    y: to.y - from.y,
  }
}

// Get the length of a vector
export function vectorLength(vector: Vector): number {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y)
}

// Normalize a vector (make it unit length)
export function normalizeVector(vector: Vector): Vector {
  const length = vectorLength(vector)
  if (length === 0) return { x: 0, y: 0 }
  return {
    x: vector.x / length,
    y: vector.y / length,
  }
}

// Create a perpendicular vector (rotate 90 degrees)
export function perpendicularVector(vector: Vector): Vector {
  return {
    x: -vector.y,
    y: vector.x,
  }
}

// Project a point onto a line defined by a point and direction vector
export function projectPointOntoLine(point: Point, linePoint: Point, direction: Vector): Point {
  const pointVector = createVector(linePoint, point)
  const normalizedDirection = normalizeVector(direction)

  const projection = pointVector.x * normalizedDirection.x + pointVector.y * normalizedDirection.y

  return {
    x: linePoint.x + projection * normalizedDirection.x,
    y: linePoint.y + projection * normalizedDirection.y,
  }
}

// Calculate distance between two points
export function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx * dx + dy * dy)
}

// Calculate angle between two points (in radians)
export function angle(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x)
}

// Convert room data to wall objects
export function getWallsFromRoom(corners: Corner[]): Wall[] {
  const walls: Wall[] = []

  corners.forEach((corner) => {
    corner.wallStarts.forEach((wallRef) => {
      // Find the corner where this wall ends
      const endCorner = corners.find((c) => c.wallEnds.some((endRef) => endRef.id === wallRef.id))

      if (endCorner) {
        walls.push({
          id: wallRef.id,
          start: { x: corner.x, y: corner.y },
          end: { x: endCorner.x, y: endCorner.y },
        })
      }
    })
  })

  return walls
}

// Get unique walls (based on unique angles)
export function getUniqueWalls(corners: Corner[]): Wall[] {
  const walls = getWallsFromRoom(corners)
  const uniqueWalls: Wall[] = []
  const seenAngles = new Set<number>()
  const tolerance = 0.01 // Tolerance for angle comparison

  walls.forEach((wall) => {
    const wallAngle = angle(wall.start, wall.end)

    // Check if this angle is already seen (within tolerance)
    let isUnique = true
    for (const seenAngle of seenAngles) {
      const diff = Math.abs(wallAngle - seenAngle)
      if (diff < tolerance || Math.abs(diff - Math.PI) < tolerance) {
        isUnique = false
        break
      }
    }

    if (isUnique) {
      seenAngles.add(wallAngle)
      uniqueWalls.push(wall)
    }
  })

  return uniqueWalls
}
