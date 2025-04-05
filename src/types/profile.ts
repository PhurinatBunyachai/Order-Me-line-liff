export interface Profile {
  userId: string
  displayName: string | ''
  pictureUrl: string | ''
  statusMessage: string | ''
  building?: string
  roomId?: string
  tel?: string
}
