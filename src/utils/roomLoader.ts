import { ROOM_TYPES, type RoomData, type RoomType } from '../types/room'

// Import room data
import simpleRoom from '../assets/json_assets/simple.json'
import triangleRoom from '../assets/json_assets/triangle.json'
import tShapeRoom from '../assets/json_assets/t_shape.json'

const roomData: Record<RoomType, RoomData> = {
  simple: simpleRoom as RoomData,
  triangle: triangleRoom as RoomData,
  t_shape: tShapeRoom as RoomData,
}

export function getRandomRoom(): { type: RoomType; data: RoomData } {
  const roomTypes: RoomType[] = getAllRoomTypes()
  const randomType = roomTypes[Math.floor(Math.random() * roomTypes.length)]

  return {
    type: randomType,
    data: roomData[randomType],
  }
}

export function getRoomData(type: RoomType): RoomData {
  return roomData[type]
}

export function getAllRoomTypes(): RoomType[] {
  return ROOM_TYPES as RoomType[]
}
