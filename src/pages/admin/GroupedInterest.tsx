import { useEffect, useState } from "react";

import { getUsersGroupedByInterest } from "../../api/admin";
import type { InterestGroup } from "../../types/interest";

function GroupedInterests() {
  const [groups, setGroups] = useState<InterestGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUsersGroupedByInterest();

      setGroups(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load users grouped by interest.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  if (loading) {
    return <p>Loading interests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Users by Interest</h1>

      {groups.length === 0 ? (
        <p>No interests found.</p>
      ) : (
        groups.map((group) => (
          <section key={group._id}>
            <h2>{group._id}</h2>

            {group.users.length === 0 ? (
              <p>No users.</p>
            ) : (
              <ul>
                {group.users.map((user) => (
                  <li key={user.id}>
                    <strong>{user.name}</strong> — {user.email}
                  </li>
                ))}
              </ul>
            )}

            <hr />
          </section>
        ))
      )}
    </div>
  );
}

export default GroupedInterests;