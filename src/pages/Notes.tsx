import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../api/note";

import type { Note, NotePagination } from "../types/note";
import { useAuth } from "../context/AuthContext";

function Notes() {
  const { user, logout } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [pagination, setPagination] = useState<NotePagination | null>(null);

  const [page, setPage] = useState(1);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [createError, setCreateError] = useState("");
  const [editError, setEditError] = useState("");

  const loadNotes = async (currentPage: number) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getNotes(currentPage, 10);

      setNotes(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to load notes."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotes(page);
  }, [page]);

  const handleCreateNote = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setIsCreating(true);
      setCreateError("");

      await createNote({
        title,
        content,
      });

      setTitle("");
      setContent("");

      if (page === 1) {
        await loadNotes(1);
      } else {
        setPage(1);
      }
    } catch (error: any) {
      setCreateError(
        error.response?.data?.message || "Failed to create note."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditError("");
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
    setEditError("");
  };

  const handleUpdateNote = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingNoteId) {
      return;
    }

    try {
      setIsUpdating(true);
      setEditError("");

      await updateNote(editingNoteId, {
        title: editTitle,
        content: editContent,
      });

      cancelEditing();

      await loadNotes(page);
    } catch (error: any) {
      setEditError(
        error.response?.data?.message || "Failed to update note."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingNoteId(noteId);
      setError("");

      await deleteNote(noteId);

      if (
        notes.length === 1 &&
        page > 1
      ) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await loadNotes(page);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to delete note."
      );
    } finally {
      setDeletingNoteId(null);
    }
  };


  const handlePrevious = () => {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  };

  const handleNext = () => {
    setPage((currentPage) =>
      pagination
        ? Math.min(currentPage + 1, pagination.totalPages)
        : currentPage
    );
  };

  return (
    <main>
      <header>
        <h1>My Notes</h1>

        <p>
          Welcome, {user?.name} ({user?.role})
        </p>

        <button onClick={logout}>
          Logout
        </button>
      </header>

      <hr />

      <section>
        <h2>Create Note</h2>

        <form onSubmit={handleCreateNote}>
          <div>
            <label htmlFor="title">
              Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="content">
              Content
            </label>

            <textarea
              id="content"
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              required
            />
          </div>

          {createError && (
            <p>{createError}</p>
          )}

          <button
            type="submit"
            disabled={isCreating}
          >
            {isCreating
              ? "Creating..."
              : "Create Note"}
          </button>
        </form>
      </section>

      <hr />

      <section>
        <h2>Your Notes</h2>

        {error && <p>{error}</p>}

        {isLoading ? (
          <p>Loading notes...</p>
        ) : notes.length === 0 ? (
          <p>
            You don't have any notes yet.
          </p>
        ) : (
          notes.map((note) => (
            <article key={note._id}>
              {editingNoteId === note._id ? (
                <form onSubmit={handleUpdateNote}>
                  <div>
                    <label htmlFor={`edit-title-${note._id}`}>
                      Title
                    </label>

                    <input
                      id={`edit-title-${note._id}`}
                      value={editTitle}
                      onChange={(event) =>
                        setEditTitle(event.target.value)
                      }
                      required
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label htmlFor={`edit-content-${note._id}`}>
                      Content
                    </label>

                    <textarea
                      id={`edit-content-${note._id}`}
                      value={editContent}
                      onChange={(event) =>
                        setEditContent(event.target.value)
                      }
                      required
                    />
                  </div>

                  {editError && (
                    <p>{editError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating
                      ? "Saving..."
                      : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3>{note.title}</h3>

                  <p>{note.content}</p>

                  <small>
                    Created:{" "}
                    {new Date(
                      note.createdAt
                    ).toLocaleString()}
                  </small>

                  <br />

                  <button
                    onClick={() =>
                      startEditing(note)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteNote(note._id)
                    }
                    disabled={
                      deletingNoteId === note._id
                    }
                  >
                    {deletingNoteId === note._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </>
              )}
            </article>
          ))
        )}
      </section>

      {pagination &&
        pagination.totalPages > 1 && (
          <nav>
            <button
              onClick={handlePrevious}
              disabled={
                page === 1 || isLoading
              }
            >
              Previous
            </button>

            <span>
              {" "}
              Page {pagination.page} of{" "}
              {pagination.totalPages}{" "}
            </span>

            <button
              onClick={handleNext}
              disabled={
                page ===
                  pagination.totalPages ||
                isLoading
              }
            >
              Next
            </button>
          </nav>
        )}
    </main>
  );
}

export default Notes;