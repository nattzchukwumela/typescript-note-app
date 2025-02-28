/**
 * A React component that renders a form for creating or editing a note.
 * 
 * The `NoteForm` component takes in several props:
 * - `onSubmit`: a function that is called when the form is submitted, with the note data as an argument
 * - `onAddTag`: a function that is called when a new tag is created, with the new tag as an argument
 * - `availableTags`: an array of existing tags that can be selected
 * - `title`: the initial title of the note
 * - `markdown`: the initial markdown content of the note
 * - `tags`: the initial tags associated with the note
 * 
 * The component renders a form with fields for the note title, markdown content, and tags. The tags field uses a creatable React Select component that allows the user to create new tags. When the form is submitted, the `onSubmit` function is called with the note data.
 */
import { FormEvent, useRef, useState } from "react";
import { Form, Stack, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "./App";
import { v4 as uuidV4 } from "uuid";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void,
  onAddTag: (tag: Tag) => void,
  availableTags: Tag[] 
} & NoteData

function NoteForm({ onSubmit, onAddTag, availableTags, title = "", markdown = "", tags = [] }: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)
  const navigate = useNavigate()
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  
    // Create an object with the note data
    const newNote = {
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    };
  
    // Pass the note data to the onSubmit function
    onSubmit(newNote);

    navigate("..")
  }
  
  return (
  <Form onSubmit={handleSubmit}>
    <Stack gap={4}>
      <Row>
        <Col>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control ref={titleRef} required defaultValue={title}/>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="tags">
            <Form.Label>Tags</Form.Label>
            <CreatableReactSelect 
            onCreateOption={label => {
              const newTag = { id: uuidV4(), label}
              onAddTag(newTag)
              setSelectedTags(prev => [...prev, newTag])
            }}
            value={selectedTags.map(tag => {
              return {label: tag.label, value: tag.id}
            })}
            options={availableTags.map(tag => {
              return {label: tag.label, value: tag.id}
            })}
           onChange={tags => {
            setSelectedTags(tags.map(tag => {
              return {label: tag.label, id: tag.value,}
            }))
           }}
            isMulti />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group controlId="markdown">
        <Form.Label>Body</Form.Label>
        <Form.Control ref={markdownRef} required as="textarea" rows={15} defaultValue={markdown} />
      </Form.Group>
      <Stack direction="horizontal" className="justify-content-end" gap={2}>
        <Button type="submit" variant="primary">
          Save
        </Button>
        <Link to="..">
          <Button type="button" variant="outline-secondary">
            Cancel
          </Button>
        </Link>
      </Stack>
    </Stack>
  </Form>
  )
}

export default NoteForm;