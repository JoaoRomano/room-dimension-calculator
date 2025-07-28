export interface Wall {
  id: string
}

export interface WallReference {
  id: string
}

export interface Corner {
  id: string
  x: number
  y: number
  wallStarts: WallReference[]
  wallEnds: WallReference[]
}

export interface RoomData {
  walls: Wall[]
  corners: Corner[]
}

export type RoomType = 'simple' | 'triangle' | 't_shape'

export const ROOM_TYPES = ['simple', 'triangle', 't_shape']
