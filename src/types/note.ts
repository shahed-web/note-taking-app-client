export interface Note {
  _id: string;
  title: string;
  content: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotesResponse {
  success: boolean;
  message: string;
  data: Note[];
  pagination: NotePagination;
}