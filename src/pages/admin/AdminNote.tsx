import { useEffect, useState } from "react";

import { getAllNotes } from "../../api/admin";
import type {
  AdminNote,
  AdminNotesPagination,
} from "../../types/adminNote";

function AdminNotes() {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [pagination, setPagination] =
    useState<AdminNotesPagination | null>(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllNotes(page, limit);

      setNotes(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      setError("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [page]);

  if (loading) {
    return <p>Loading notes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>All Notes</h1>

      <p>
        Total notes: {pagination?.total ?? 0}
      </p>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <div>
          {notes.map((note) => (
            <article key={note._id}>
              <h2>{note.title}</h2>

              <p>{note.content}</p>

              <div>
                <strong>Owner:</strong>{" "}
                {note.owner.name}
              </div>

              <div>
                <strong>Email:</strong>{" "}
                {note.owner.email}
              </div>

              <div>
                <strong>Created:</strong>{" "}
                {new Date(note.createdAt).toLocaleString()}
              </div>

              <hr />
            </article>
          ))}
        </div>
      )}

      <div>
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((current) => current - 1)}
        >
          Previous
        </button>

        <span>
          {" "}
          Page {pagination?.page ?? page} of{" "}
          {pagination?.totalPages ?? 1}{" "}
        </span>

        <button
          type="button"
          disabled={
            !pagination ||
            page >= pagination.totalPages
          }
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminNotes;