export interface AdminNoteOwner {
  _id: string;
  name: string;
  email: string;
}

export interface AdminNote {
  _id: string;
  title: string;
  content: string;
  owner: AdminNoteOwner;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminNotesResponse {
  success: boolean;
  message: string;
  data: AdminNote[];
  pagination: AdminNotesPagination;
}