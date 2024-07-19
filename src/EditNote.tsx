/**
 * A React component that renders a form for editing an existing note.
 * 
 * @param onSubmit - A function that is called when the note form is submitted, with the updated note data.
 * @param onAddTag - A function that is called when a new tag is added, with the new tag.
 * @param availableTags - An array of available tags that can be selected for the note.
 */
import { NoteData, Tag } from "./App";
import  NoteForm  from "./NoteForm";
import { useNote } from "./NoteLayout";
import React from "react";

type EditNoteProps = {
  onSubmit: (id: string, data: NoteData) => void,
  onAddTag: (tag: Tag) => void,
  availableTags: Tag[] 
}

function EditNote({onSubmit, onAddTag, availableTags}:
     EditNoteProps) {
    const note = useNote()
  return (
    <>
      <h1 className="mb-4">Edit Note</h1>
      <NoteForm
       title={note.title}
       markdown={note.markdown}
       tags={note.tags}
       onSubmit={data => onSubmit(note.id, data)}
       onAddTag={onAddTag}
       availableTags={availableTags} />
    </>
  )
}

export default EditNote;