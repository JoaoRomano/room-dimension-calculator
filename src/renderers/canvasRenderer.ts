import type { Corner, RoomData } from '../types/room'
import type { Line } from '../types/geometry'
import { getWallsFromRoom } from '../utils/geometry'

export interface CanvasBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface CanvasPoint {
  x: number
  y: number
}

export interface DimensionOption {
  length: Line
  width: Line
  lengthDistance: number
  widthDistance: number
}

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D
  private canvas: HTMLCanvasElement
  private bounds: CanvasBounds
  private padding: number

  constructor(canvas: HTMLCanvasElement, padding: number = 100) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.padding = padding
    this.bounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  }

  /**
   * Calculate room bounds from corners
   */
  private calculateBounds(corners: Corner[]): CanvasBounds {
    if (corners.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 }

    const xs = corners.map((c) => c.x)
    const ys = corners.map((c) => c.y)

    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    }
  }

  /**
   * Convert world coordinates to canvas coordinates
   */
  private worldToCanvas(x: number, y: number): CanvasPoint {
    const scaleX = (this.canvas.width - 2 * this.padding) / (this.bounds.maxX - this.bounds.minX)
    const scaleY = (this.canvas.height - 2 * this.padding) / (this.bounds.maxY - this.bounds.minY)
    const scale = Math.min(scaleX, scaleY)

    const centerX = (this.bounds.maxX + this.bounds.minX) / 2
    const centerY = (this.bounds.maxY + this.bounds.minY) / 2

    const canvasX = (x - centerX) * scale + this.canvas.width / 2
    const canvasY = (y - centerY) * scale + this.canvas.height / 2

    return { x: canvasX, y: canvasY }
  }

  /**
   * Clear the canvas
   */
  private clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * Draw walls
   */
  private drawWalls(corners: Corner[]): void {
    const walls = getWallsFromRoom(corners)

    this.ctx.strokeStyle = '#333'
    this.ctx.lineWidth = 2
    this.ctx.lineCap = 'round'

    walls.forEach((wall) => {
      const start = this.worldToCanvas(wall.start.x, wall.start.y)
      const end = this.worldToCanvas(wall.end.x, wall.end.y)

      this.ctx.beginPath()
      this.ctx.moveTo(start.x, start.y)
      this.ctx.lineTo(end.x, end.y)
      this.ctx.stroke()
    })
  }

  /**
   * Draw corner points
   */
  private drawCorners(corners: Corner[]): void {
    this.ctx.fillStyle = '#e74c3c'

    corners.forEach((corner) => {
      const pos = this.worldToCanvas(corner.x, corner.y)
      this.ctx.beginPath()
      this.ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI)
      this.ctx.fill()
    })
  }

  /**
   * Draw dimension axes
   */
  private drawDimensions(dimension: DimensionOption): void {
    // Draw length axis (blue) - perpendicular to selected wall
    this.ctx.strokeStyle = '#3498db'
    this.ctx.lineWidth = 4
    this.ctx.setLineDash([10, 5])

    const lengthStart = this.worldToCanvas(dimension.length.start.x, dimension.length.start.y)
    const lengthEnd = this.worldToCanvas(dimension.length.end.x, dimension.length.end.y)

    this.ctx.beginPath()
    this.ctx.moveTo(lengthStart.x, lengthStart.y)
    this.ctx.lineTo(lengthEnd.x, lengthEnd.y)
    this.ctx.stroke()

    // Draw width axis (green) - parallel to selected wall
    this.ctx.strokeStyle = '#27ae60'
    this.ctx.lineWidth = 4
    this.ctx.setLineDash([5, 5])

    const widthStart = this.worldToCanvas(dimension.width.start.x, dimension.width.start.y)
    const widthEnd = this.worldToCanvas(dimension.width.end.x, dimension.width.end.y)

    this.ctx.beginPath()
    this.ctx.moveTo(widthStart.x, widthStart.y)
    this.ctx.lineTo(widthEnd.x, widthEnd.y)
    this.ctx.stroke()

    // Add labels
    this.ctx.fillStyle = '#3498db'
    this.ctx.font = 'bold 12px Arial'
    const lengthMidX = (lengthStart.x + lengthEnd.x) / 2
    const lengthMidY = (lengthStart.y + lengthEnd.y) / 2
    this.ctx.fillText('LENGTH', lengthMidX + 10, lengthMidY - 10)

    this.ctx.fillStyle = '#27ae60'
    const widthMidX = (widthStart.x + widthEnd.x) / 2
    const widthMidY = (widthStart.y + widthEnd.y) / 2
    this.ctx.fillText('WIDTH', widthMidX + 10, widthMidY - 10)

    // Reset line style
    this.ctx.setLineDash([])
  }

  /**
   * Draw room information
   */
  private drawRoomInfo(roomData: RoomData, dimension?: DimensionOption): void {
    this.ctx.fillStyle = '#333'
    this.ctx.font = '16px Arial'

    const cornerCount = roomData.corners.length
    const roomType = this.getRoomType(cornerCount)

    this.ctx.fillText(`Room Type: ${roomType}`, 10, 30)
    this.ctx.fillText(`Walls: ${roomData.walls.length}`, 10, 50)
    this.ctx.fillText(`Corners: ${cornerCount}`, 10, 70)

    if (dimension) {
      this.ctx.fillText(`Length: ${dimension.lengthDistance.toFixed(1)}`, 10, 90)
      this.ctx.fillText(`Width: ${dimension.widthDistance.toFixed(1)}`, 10, 110)
    }
  }

  /**
   * Get room type based on corner count
   */
  private getRoomType(cornerCount: number): string {
    if (cornerCount === 3) return 'Triangle'
    if (cornerCount === 4) return 'Trapezoid'
    return 'T Shape'
  }

  /**
   * Main render method
   */
  render(roomData: RoomData, dimension?: DimensionOption): void {
    if (!roomData.corners.length) return

    // Calculate bounds
    this.bounds = this.calculateBounds(roomData.corners)

    // Clear canvas
    this.clear()

    // Draw room elements
    this.drawWalls(roomData.corners)
    this.drawCorners(roomData.corners)

    // Draw dimensions if available
    if (dimension) {
      this.drawDimensions(dimension)
    }

    // Draw room info
    this.drawRoomInfo(roomData, dimension)
  }
}
