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