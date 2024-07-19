/**
 * The `NoteList` component is responsible for rendering a list of notes, allowing the user to filter and search notes, and providing functionality to edit tags associated with the notes.
 *
 * The component receives the following props:
 * - `availableTags`: an array of `Tag` objects representing all the available tags that can be associated with notes.
 * - `notes`: an array of `SimplifiedNote` objects representing the notes to be displayed.
 * - `onDeleteTag`: a function that is called when a tag needs to be deleted.
 * - `onUpdateTag`: a function that is called when a tag needs to be updated.
 *
 * The `NoteList` component renders a form with a title input and a multi-select dropdown for tags, which are used to filter the displayed notes. It also renders a list of `NoteCard` components, one for each note that matches the current filters.
 *
 * The `EditTagsModal` component is a modal dialog that allows the user to edit the labels of existing tags.
 */
import React, { useMemo, useState } from 'react'
import { Col, Row, Stack, Button, Form, Card, Badge, Modal, ModalTitle } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import { Tag } from './App';
import styles from "./NoteList.module.css";

type SimplifiedNote = {
  tags: Tag[],
  title: string,
  id: string
}

type NoteListProps = {
  availableTags: Tag[],
  notes: SimplifiedNote[],
  onDeleteTag: (id: string) => void,
  onUpdateTag: (id: string, label: string) => void
}

type EditTagsModalProps = {
  availableTags: Tag[],
  show: boolean,
  handleClose: () => void,
  onDeleteTag: (id: string) => void,
  onUpdateTag: (id: string, label: string) => void
}

function NoteList({availableTags, notes, onUpdateTag, onDeleteTag }: NoteListProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [title, setTitle] = useState<string>("");
  const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState<boolean>(false)

  const filteredNotes = useMemo(() => {
 return notes.filter(note => {
  return (title === "" || note.title.toLowerCase().includes(title.toLowerCase())) && (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
 })
  }, [title, selectedTags, notes])
  return (
    <>
    <Row className='align-items-center mb-4'>
    <Col>
    <h1>Notes</h1>
    </Col>
    <Col xs="auto">
    <Stack gap={2} direction="horizontal">
      <Link to="/new">
      <Button variant="primary">
        Create
      </Button>
      </Link>
      <Button 
      onClick={() => {
        setEditTagsModalIsOpen(true)
      }}
      variant="outline-secondary">Edit Tags</Button>
    </Stack>
    </Col>
    </Row>
    <Form>
      <Row className="mb-4">
        <Col>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control 
          type="text" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          />
        </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="tags">
            <Form.Label>Tags</Form.Label>
            <ReactSelect
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
    </Form>
    <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
            {filteredNotes.map(note => (
              <Col key={note.id}>
                <NoteCard id={note.id} title={note.title} tags={note.tags} />
              </Col>
            ))}
          
      </Row>
      <EditTagsModal show={editTagsModalIsOpen} handleClose={() => setEditTagsModalIsOpen(false)}
      onUpdateTag={onUpdateTag}
      onDeleteTag={onDeleteTag}
      availableTags={availableTags}/>
    </>
  )
}

function NoteCard({ id, title, tags}: SimplifiedNote) {

  return (
    <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.css}`}>
      <Card.Body>
        <Stack 
          gap={2} 
          className="align-items-center justify-content-center h-100"
        >
          <span className='fs-5'>{title}</span>
          {tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="justify-content-center flex-wrap">
              {tags.map(tag => (
                <Badge className="text-truncate" key={tag.id}>
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  )
}
 
  function EditTagsModal(
    {availableTags,
     handleClose, 
     show,
    onDeleteTag,
    onUpdateTag
  }: EditTagsModalProps) {
    return <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
    <Modal.Title>
        Edit Tags
    </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
      <Stack gap={2}>
        {availableTags.map(tag => {
          return (<Row key={tag.id}>
            <Col>
            <Form.Control
            onChange={e => onUpdateTag(tag.id, e.target.value)}
            value={tag.label} />
            </Col>
            <Col xs="auto">
            <Button 
            onClick={() => onDeleteTag(tag.id)}
            variant="outline-danger">&times;</Button>
            </Col>
          </Row>)
        })}
      </Stack>
      </Form>
    </Modal.Body>
    </Modal>
  }
export default NoteList