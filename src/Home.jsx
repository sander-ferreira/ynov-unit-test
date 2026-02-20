import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "./api";

export function Home() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setError("Impossible de charger les utilisateurs."));
  }, []);

  return (
    <div>
      <h1>Bienvenue</h1>
      <p data-cy="counter">{users.length} utilisateur(s) inscrit(s)</p>
      <Link to="/register">S'inscrire</Link>
      {error && <div role="alert">{error}</div>}
      {users.length > 0 && (
        <ul data-cy="user-list">
          {users.map((u, i) => (
            <li key={i}>
              {u.nom || u.name} {u.prenom}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
