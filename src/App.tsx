/**
 * The main React component for the application. It handles the routing and management of notes and tags.
 *
 * - Manages the state of notes and tags using the `useLocalStorage` hook.
 * - Provides functions to create, update, and delete notes and tags.
 * - Renders the appropriate components based on the current route, including the `NoteList`, `NewNote`, `Note`, and `EditNote` components.
 */
import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import { NewNote } from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import { NoteLayout } from "./NoteLayout";
import { Note } from "./Note";
import  EditNote from "./EditNote";
import NoteList from "./NoteList";
import "bootstrap/dist/css/bootstrap.min.css";

export type NoteWithId = {
  id: string;
} & NoteData;

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string,
  markdown: string,
  tagIds: string[]
}

export type Tag = {
  id: string
  label: string;
};

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])


  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  }, [notes, tags])


  function onCreateNote({tags, ...data}: NoteData){
    setNotes(prevNotes => {
      return [...prevNotes, {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}]
    })
  }
 

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }

  function onUpdateNote(id: string, {tags, ...data}: NoteData) {
    setNotes(prevNotes => {
      return prevNotes.map(note => {
        if(note.id === id){
          return {...note,...data, tagIds: tags.map(tag => tag.id)}
        } else {
          return note
        }
      })
    })
  }
 
  function onDeleteNote(id: string) {
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function updateTag(id: string, label: string){
      setTags(prevTags => {
        return prevTags.map(tag => {
          if(tag.id === id){
            return {...tag, label}
          } else {
            return tag
          }
        })
      })
  }

  function deleteTag(id: string){
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }
  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList notes={notesWithTags} availableTags={tags} onUpdateTag={updateTag} onDeleteTag={deleteTag} />} />
        <Route path="/new" element={<NewNote 
        onSubmit={onCreateNote}
        onAddTag={addTag}
        availableTags={tags}
        />} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} /> }>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route path="edit" element={
            <EditNote 
            onSubmit={onUpdateNote}
            onAddTag={addTag}
            availableTags={tags}
            />
            } />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
