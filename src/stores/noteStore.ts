import { observable } from 'mobx';
import Note from '../models/Note';
import localStorage from './LocalStorage';

export class NoteStore {
    @observable notes: Note[] = [];
    @observable activeNoteId: string|null = null;

    initializeNotes(notes: Note[]) {
        if (this.notes.length > 0) {
            this.notes.splice(0, this.notes.length);
        }
        this.notes.push(...notes);
    }

    saveNote(note: Note) {
        console.log(`NoteStore:saveNote(${note.noteId})`);
        const idx = this.notes.findIndex((n) => note.noteId === n.noteId);
        if (idx < 0) {
            this.notes.push(note);
        } else {
            this.notes[idx] = note;
        }
        localStorage.setItem(note);
    }

    deleteNote(note: Note) {
        console.log(`NoteStore:deleteNote(${note.noteId})`);
        const idx = this.notes.findIndex((n) => n.noteId === note.noteId);
        if (idx < 0) {
            throw new Error(`Note ${note.noteId} not found`);
        } else {
            this.notes.splice(idx, 1);
            localStorage.deleteItem(note.noteId);
            if (note.noteId === this.activeNoteId) {
                this.activeNoteId = null;
            }
        }
    }

    getNote(): Note {
        console.log(`NoteStore.getNote()`);
        const idx = this.notes.findIndex((n) => n.noteId === this.activeNoteId);
        if (idx < 0) {
            return null;
        } else {
            return this.notes[idx];
        }
    }

    setActiveNote(note: Note) {
        console.log(`NoteStore.setActiveNote(${note.noteId})`);
        this.activeNoteId = note.noteId;
    }

    clearActiveNote() {
        console.log(`NoteStore.clearActiveNote()`);
        this.activeNoteId = null;
    }
}

const observableNoteStore = new NoteStore();
localStorage.getAllItems().then(items => observableNoteStore.initializeNotes(items));

export default observableNoteStore;
