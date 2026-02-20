/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "./Home";

// Mock axios so no real network calls leave the tests
jest.mock("axios");
import axios from "axios";

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  axios.get.mockClear();
});

describe("Home Integration Tests", () => {
  it("Succès (200) : should display users fetched from API", async () => {
    axios.get.mockResolvedValue({
      data: [
        { id: 1, nom: "Ferreira", prenom: "Sander" },
        { id: 2, nom: "Dupont", prenom: "Marie" },
      ],
    });

    renderHome();

    await waitFor(() => {
      expect(
        screen.getByText("2 utilisateur(s) inscrit(s)"),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Ferreira Sander/i)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users",
    );
  });

  it("Succès (200) : should show 0 users when API returns empty list", async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderHome();

    await waitFor(() => {
      expect(
        screen.getByText("0 utilisateur(s) inscrit(s)"),
      ).toBeInTheDocument();
    });
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("Crash serveur (500) : should display error alert, app must not crash", async () => {
    axios.get.mockRejectedValue({ response: { status: 500 } });

    renderHome();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        /impossible de charger/i,
      );
    });
  });
});
