import {type ChangeEvent, useEffect, useState} from "react";
import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    type SelectChangeEvent
} from "@mui/material";

export type Note = {
    id?: number;
    title: string;
    description: string;
    status: 'active' | 'completed';
    created?: string;
}

export type NoteProps = {
    selectedNote?: Note | null;
    onSaveNote: (note: Note) => void;
    isDialogOpen: boolean;
    onDialogClose: () => void;
}

const initialForm: Note = {
    title: "",
    description: "",
    status: "active",
}

const NoteDialog = ({
    selectedNote,
    onSaveNote,
    isDialogOpen,
    onDialogClose,
}: NoteProps) => {
    console.log("selectedNote", selectedNote);
    const [noteForm, setNoteForm] = useState<Note>(initialForm);
    const [noteError, setNoteError] = useState<{[Property in keyof Omit<Note, 'status' | 'created' | 'id'>]: boolean}>({
        title: false,
        description: false,
    });

    useEffect(() => {
        setNoteForm(selectedNote || initialForm);
    }, [selectedNote]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNoteForm((prevState) => ({...prevState, [e.target.name]: e.target.value}));
        setNoteError((prevState) => ({...prevState, [e.target.name]: false}));
    }
    const handleSelectChange = (e: SelectChangeEvent<'active' | 'completed'>) => {
        setNoteForm((prevState) => ({...prevState, status: e.target.value}));
    }

    const handleSave = () => {
        let hasError = false;
        Object.keys(noteError).forEach((key) => {
            if (noteForm[key as keyof Note] === "") {
                hasError = true;
                setNoteError(prevState => ({...prevState, [key]: true}));
            }
        })
        if (hasError) { return }
        if (selectedNote && selectedNote.id) {
            onSaveNote({...selectedNote, ...noteForm});
        } else {
            onSaveNote({...noteForm});
        }
        setNoteForm(initialForm)
    }

    return (
        <Dialog open={isDialogOpen} onClose={onDialogClose} fullWidth maxWidth="sm">
            <DialogTitle>{selectedNote?.id ? 'Edit Note' : 'New Note'}</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Title"
                    name="title"
                    value={noteForm.title}
                    onChange={handleChange}
                    error={noteError.title}
                    helperText={ noteError.title ? "Title is required" : null }
                />
                <TextField
                    fullWidth
                    margin="dense"
                    name="description"
                    label="Description"
                    value={noteForm.description}
                    onChange={handleChange}
                    error={noteError.description}
                    helperText={ noteError.description ? "Description is required" : null }
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select
                        name="status"
                        value={noteForm.status}
                        onChange={handleSelectChange}
                        label="Status"
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDialogClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoteDialog;