// Notion API Response Interfaces

export interface NotionResponse {
  results: Page[]
}

export interface Page {
  object: string
  id: string
  created_time: string
  last_edited_time: string
  created_by: User
  last_edited_by: User
  cover: null
  icon: null
  parent: Parent
  archived: boolean
  in_trash: boolean
  properties: Properties
  url: string
  public_url: string | null
}

export interface User {
  object: string
  id: string
}

export interface Parent {
  type: string
  database_id: string
}

export interface Properties {
  // store DB
  status: StatusProperty
  close_time: RichTextProperty
  open_time: TitleProperty

  //Product DB
  id: UniqueIDProperty
  name: RichTextProperty
  price: NumberProperty
  description: RichTextProperty
  image: FileProperty
  available: StatusProperty
}

export interface NumberProperty {
  id: string
  type: 'number'
  number: number
}

export interface FileProperty {
  id: string
  type: 'files'
  files: File[]
}

export interface StatusProperty {
  id: string
  type: 'status'
  status: Status
}
export interface UniqueIDProperty {
  id: string
  type: 'unique_id'
  unique_id: uniqueID
}

export interface Status {
  id: string
  name: string
  color: string
}

export interface RichTextProperty {
  id: string
  type: 'rich_text'
  rich_text: RichText[]
}

export interface TitleProperty {
  id: string
  type: 'title'
  title: RichText[]
}

export interface RichText {
  type: string
  text: TextContent
  annotations: Annotations
  plain_text: string
  href: string | null
}

export interface TextContent {
  content: string
  link: string | null
}

export interface FileContent {
  expiry_time: string | ''
  url: string | ''
}

export interface Annotations {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

export interface File {
  type: string
  file: FileContent
  annotations: Annotations
  plain_text: string
  href: string | null
}
export interface uniqueID {
  number: number
  prefix: string | null
}
