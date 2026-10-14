export type Participant = {
  id: string
  kind: 'agent' | 'person'
  name: string
  role: string
}
export type PersonDraft = { name: string; role: string }
