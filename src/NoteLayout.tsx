/**
 * A React component that renders the layout for a note page, including the note content and any related UI elements.
 * 
 * The `NoteLayout` component is responsible for finding the note based on the current URL parameter, and rendering the `Outlet` component with the note data passed as context.
 * 
 * If the note is not found, the component will redirect the user to the home page.
 * 
 * @param notes - An array of `NoteWithId` objects representing the notes in the application.
 * @returns A React element representing the note layout.
 */
import React from 'react';
import { Navigate, Outlet, useOutletContext, useParams } from 'react-router-dom';
import { NoteWithId } from "./App";

type NoteLayoutProps = {
    notes: NoteWithId[]
}

export function NoteLayout({ notes }: NoteLayoutProps) {
 const { id } = useParams();
 const note = notes.find(note => note.id === id);

 if (note == null) return <Navigate to="/" replace />
 return <Outlet context={note} />
 
}

export function useNote() {
    return useOutletContext<NoteWithId>()
}