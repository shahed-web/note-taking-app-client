import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../api/admin";

import type {
  AdminUser,
  AdminUsersPagination,
  CreateAdminUserInput,
  UpdateAdminUserInput,
} from "../../types/admin";

function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] =
    useState<AdminUsersPagination | null>(null);

  const [page, setPage] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] =
    useState<CreateAdminUserInput["role"]>("user");
  const [interests, setInterests] = useState("");

  const [editingUserId, setEditingUserId] =
    useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] =
    useState<UpdateAdminUserInput["role"]>();
  const [editInterests, setEditInterests] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingUserId, setDeletingUserId] =
    useState<string | null>(null);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [editError, setEditError] = useState("");

  const loadUsers = async (currentPage: number) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getUsers(currentPage, 10);

      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(page);
  }, [page]);


  const handleCreateUser = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setIsCreating(true);
      setFormError("");

      const interestsArray = interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      await createUser({
        name,
        email,
        password,
        role,
        interests: interestsArray,
      });

      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setInterests("");

      if (page === 1) {
        await loadUsers(1);
      } else {
        setPage(1);
      }
    } catch (error: any) {
      setFormError(
        error.response?.data?.message ||
          "Failed to create user."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const startEditing = (user: AdminUser) => {
    setEditingUserId(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword("");
    setEditRole(user.role);
    setEditInterests(user.interests.join(", "));
    setEditError("");
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditName("");
    setEditEmail("");
    setEditPassword("");
    setEditRole(undefined);
    setEditInterests("");
    setEditError("");
  };

  const handleUpdateUser = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingUserId) {
      return;
    }

    try {
      setIsUpdating(true);
      setEditError("");

      const data: UpdateAdminUserInput = {
        name: editName,
        email: editEmail,
        role: editRole,
        interests: editInterests
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (editPassword.trim()) {
        data.password = editPassword;
      }

      await updateUser(editingUserId, data);

      cancelEditing();

      await loadUsers(page);
    } catch (error: any) {
      setEditError(
        error.response?.data?.message ||
          "Failed to update user."
      );
    } finally {
      setIsUpdating(false);
    }
  };


  const handleDeleteUser = async (
    userId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUserId(userId);
      setError("");

      await deleteUser(userId);

      if (users.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        await loadUsers(page);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  const handlePrevious = () => {
    setPage((currentPage) =>
      Math.max(currentPage - 1, 1)
    );
  };

  const handleNext = () => {
    setPage((currentPage) =>
      pagination
        ? Math.min(
            currentPage + 1,
            pagination.totalPages
          )
        : currentPage
    );
  };

  return (
    <main>
      <h1>Admin - Users</h1>

      <section>
        <h2>Create User</h2>

        <form onSubmit={handleCreateUser}>
          <div>
            <label htmlFor="name">Name</label>

            <input
              id="name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="role">Role</label>

            <select
              id="role"
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value as
                    | "user"
                    | "admin"
                )
              }
            >
              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="interests">
              Interests
            </label>

            <input
              id="interests"
              value={interests}
              onChange={(event) =>
                setInterests(event.target.value)
              }
              placeholder="coding, music, sports"
            />
          </div>

          {formError && <p>{formError}</p>}

          <button
            type="submit"
            disabled={isCreating}
          >
            {isCreating
              ? "Creating..."
              : "Create User"}
          </button>
        </form>
      </section>

      <hr />

      <section>
        <h2>Users</h2>

        {error && <p>{error}</p>}

        {isLoading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map((user) => (
            <article key={user._id}>
              {editingUserId === user._id ? (
                <form onSubmit={handleUpdateUser}>
                  <div>
                    <label>
                      Name
                    </label>

                    <input
                      value={editName}
                      onChange={(event) =>
                        setEditName(
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div>
                    <label>
                      Email
                    </label>

                    <input
                      type="email"
                      value={editEmail}
                      onChange={(event) =>
                        setEditEmail(
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div>
                    <label>
                      New Password
                    </label>

                    <input
                      type="password"
                      value={editPassword}
                      onChange={(event) =>
                        setEditPassword(
                          event.target.value
                        )
                      }
                      minLength={8}
                      placeholder="Leave empty to keep current password"
                    />
                  </div>

                  <div>
                    <label>
                      Role
                    </label>

                    <select
                      value={editRole}
                      onChange={(event) =>
                        setEditRole(
                          event.target.value as
                            | "user"
                            | "admin"
                        )
                      }
                    >
                      <option value="user">
                        User
                      </option>

                      <option value="admin">
                        Admin
                      </option>
                    </select>
                  </div>

                  <div>
                    <label>
                      Interests
                    </label>

                    <input
                      value={editInterests}
                      onChange={(event) =>
                        setEditInterests(
                          event.target.value
                        )
                      }
                      placeholder="coding, music, sports"
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
                  <h3>{user.name}</h3>

                  <p>
                    Email: {user.email}
                  </p>

                  <p>
                    Role: {user.role}
                  </p>

                  <p>
                    Interests:{" "}
                    {user.interests.length
                      ? user.interests.join(", ")
                      : "None"}
                  </p>

                  <button
                    onClick={() =>
                      startEditing(user)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteUser(
                        user._id
                      )
                    }
                    disabled={
                      deletingUserId === user._id
                    }
                  >
                    {deletingUserId === user._id
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

export default AdminUsers;