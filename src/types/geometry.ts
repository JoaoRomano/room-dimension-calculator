export interface Point {
  x: number
  y: number
}

export interface Line {
  start: Point
  end: Point
}

export interface Wall {
  id: string
  start: Point
  end: Point
}

// Vector utility functions
export interface Vector {
  x: number
  y: number
}
