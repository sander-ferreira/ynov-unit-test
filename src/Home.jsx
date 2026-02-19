import React from "react";
import { Link } from "react-router-dom";
import { useUsers } from "./UsersContext";

export function Home() {
  const { users } = useUsers();

  return (
    <div>
      <h1>Bienvenue</h1>
      <p data-cy="counter">
        {users.length} utilisateur(s) inscrit(s)
      </p>
      <Link to="/register">S'inscrire</Link>
      {users.length > 0 && (
        <ul data-cy="user-list">
          {users.map((u, i) => (
            <li key={i}>
              {u.nom} {u.prenom}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
