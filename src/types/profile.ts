export interface Profile {
  userId: string
  displayName: string | ''
  pictureUrl: string | ''
  statusMessage: string | ''
}

export interface ProfileAddress {
  building?: string
  roomId?: string
  tel?: string
}
