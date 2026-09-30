import api from "./axios";
import type { NotesResponse } from "../types/note";


export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
}

export const getNotes = async (
  page = 1,
  limit = 10
): Promise<NotesResponse> => {
  const response = await api.get<NotesResponse>("/notes", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const createNote = async (
  data: CreateNoteInput
) => {
  const response = await api.post("/notes", data);

  return response.data;
};

export const updateNote = async (
  noteId: string,
  data: UpdateNoteInput
) => {
  const response = await api.patch(`/notes/${noteId}`, data);

  return response.data;
};

export const deleteNote = async (noteId: string) => {
  const response = await api.delete(`/notes/${noteId}`);

  return response.data;
};