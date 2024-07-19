import  NoteForm  from "./NoteForm";
import { NoteData, Tag } from "./App";

/**
 * Defines the props for the `NewNote` component.
 * 
 * @param onSubmit - A callback function that is called when the note form is submitted, with the note data as an argument.
 * @param onAddTag - A callback function that is called when a new tag is added, with the new tag as an argument.
 * @param availableTags - An array of available tags that can be used in the note.
 * @param title - The title of the note (optional).
 * @param markdown - The markdown content of the note (optional).
 * @param tags - The tags associated with the note (optional).
 */
type NewNoteProps = {
  onSubmit: (data: NoteData) => void,
  onAddTag: (tag: Tag) => void,
  availableTags: Tag[] 
} & Partial<NoteData>

export function NewNote({onSubmit, onAddTag, availableTags, }: NewNoteProps) {
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} title={""} markdown={""} tags={[]} />
    </>
  )
}
