import {useEffect, useState} from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import {useNotify} from "./hooks/NotificationProvider.tsx";
import NoteDialog, { type Note} from "./NoteDialog.tsx";

const BASE_URL = "http://localhost:3000/api";

function Notes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { notifySuccess, notifyError, notifyLoading, closeNotification } = useNotify();

    const fetchData = async () => {
        try {
            notifyLoading("Loading notes...")
            const response = await fetch(`${BASE_URL}/notes`);
            const data: Note[] = await response.json();
            setNotes(data);
            closeNotification()
            notifySuccess("Nodes fetched successfully.");
        } catch (e) {
            closeNotification()
            notifyError("Could not fetch data")
        }
    }

    useEffect(() => {
        void fetchData()
    }, [])

    const handleOpenDialog = (note?: Note) => {
        if (note) {
            setSelectedNote(note);
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedNote(null);
    };

    const handleSave = async (noteForm: Note) => {
        if (noteForm.id) {
            notifyLoading("Updating note...");
            try {
                const response = await fetch(`${BASE_URL}/notes/${noteForm.id}`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(noteForm)});
                await response.json();
                await fetchData();
                closeNotification();
                notifySuccess("Note updated successfully");
            } catch (e) {
                closeNotification()
                notifyError("Could not update note")
            }
        } else {
            notifyLoading("Saving note...");
            try {
                const response = await fetch(`${BASE_URL}/notes/`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(noteForm)});
                await response.json();
                await fetchData();
                closeNotification();
                notifySuccess("Note saved successfully.");
            } catch (e) {
                closeNotification()
                notifyError("Could not save note")
            }
        }
        handleCloseDialog();
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        notifyLoading("Deleting note...");
        try {
            const response = await fetch(`${BASE_URL}/notes/${id}`, {method: 'DELETE' });
            await response.json();
            await fetchData();
            closeNotification();
            notifySuccess("Note deleted successfully.");
        } catch (e) {
            closeNotification()
            notifyError("Could not delete note")
        }
    };

    return (
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={() => handleOpenDialog()} style={{ marginBottom: 16 }}>
                New Note
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {notes.map((note, index) => (
                            <TableRow key={note.id} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{note.title}</TableCell>
                                <TableCell>{note.description}</TableCell>
                                <TableCell>{note.status}</TableCell>
                                <TableCell>{note.created}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => {handleOpenDialog(note)}}><Edit /></IconButton>
                                    <IconButton onClick={() => handleDelete(note.id)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <NoteDialog
                selectedNote={selectedNote}
                onSaveNote={handleSave} isDialogOpen={isDialogOpen}
                onDialogClose={handleCloseDialog}
            />
        </div>
    );
}

export default Notes;