/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { RegistrationForm } from "./RegistrationForm";

// Mock axios so no real network calls leave the tests
jest.mock("axios");
import axios from "axios";

// Mock useNavigate to capture navigation calls
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

function renderForm() {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <RegistrationForm />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mockNavigate.mockClear();
  axios.post.mockClear();
});

describe("RegistrationForm Integration Tests", () => {
  describe("Rendering", () => {
    it("should render all form fields", () => {
      renderForm();
      expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date de naissance/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/code postal/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ville/i)).toBeInTheDocument();
    });

    it("should render a disabled submit button initially", () => {
      renderForm();
      expect(screen.getByRole("button", { name: /envoyer/i })).toBeDisabled();
    });
  });

  describe("Field validation - immediate feedback", () => {
    it("should show error for invalid nom (numbers)", async () => {
      const user = userEvent.setup();
      renderForm();
      await user.type(screen.getByLabelText(/^nom$/i), "Jean123");
      expect(screen.getByText(/invalid identity/i)).toBeInTheDocument();
    });

    it("should show error for XSS in nom", async () => {
      const user = userEvent.setup();
      renderForm();
      await user.type(screen.getByLabelText(/^nom$/i), "<script>alert</script>");
      expect(screen.getByText(/xss detected/i)).toBeInTheDocument();
    });

    it("should clear error when nom is corrected", async () => {
      const user = userEvent.setup();
      renderForm();
      await user.type(screen.getByLabelText(/^nom$/i), "123");
      expect(screen.getByText(/invalid identity/i)).toBeInTheDocument();
      await user.clear(screen.getByLabelText(/^nom$/i));
      await user.type(screen.getByLabelText(/^nom$/i), "Dupont");
      expect(screen.queryByText(/invalid identity/i)).not.toBeInTheDocument();
    });

    it("should show error for invalid email", async () => {
      const user = userEvent.setup();
      renderForm();
      await user.type(screen.getByLabelText(/email/i), "not-an-email");
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });

    it("should show error for invalid postal code", async () => {
      const user = userEvent.setup();
      renderForm();
      await user.type(screen.getByLabelText(/code postal/i), "ABC");
      expect(screen.getByText(/invalid postal code/i)).toBeInTheDocument();
    });

    it("should show error for underage date of birth", () => {
      renderForm();
      const dateInput = screen.getByLabelText(/date de naissance/i);
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 10);
      fireEvent.change(dateInput, {
        target: { value: recentDate.toISOString().split("T")[0] },
      });
      expect(screen.getByText(/underage/i)).toBeInTheDocument();
    });

    it("should show error for XSS in ville", async () => {
      const user = userEvent.setup();
      renderForm();
      await user.type(screen.getByLabelText(/ville/i), "<img src=x>");
      expect(screen.getByText(/xss detected/i)).toBeInTheDocument();
    });

    it("should validate on blur", async () => {
      const user = userEvent.setup();
      renderForm();
      const nomInput = screen.getByLabelText(/^nom$/i);
      await user.type(nomInput, "A");
      await user.clear(nomInput);
      await user.tab();
      expect(screen.getByText(/invalid identity/i)).toBeInTheDocument();
    });
  });

  describe("Submit button state", () => {
    async function fillFormValid(user) {
      await user.type(screen.getByLabelText(/^nom$/i), "Dupont");
      await user.type(screen.getByLabelText(/prénom/i), "Marie");
      await user.type(screen.getByLabelText(/email/i), "marie@example.com");
      fireEvent.change(screen.getByLabelText(/date de naissance/i), {
        target: { value: "1990-01-15" },
      });
      await user.type(screen.getByLabelText(/code postal/i), "75001");
      await user.type(screen.getByLabelText(/ville/i), "Paris");
    }

    it("should enable button when all fields are valid", async () => {
      const user = userEvent.setup();
      renderForm();
      await fillFormValid(user);
      expect(screen.getByRole("button", { name: /envoyer/i })).toBeEnabled();
    });

    it("should disable button when a field becomes invalid", async () => {
      const user = userEvent.setup();
      renderForm();
      await fillFormValid(user);
      expect(screen.getByRole("button", { name: /envoyer/i })).toBeEnabled();
      await user.clear(screen.getByLabelText(/email/i));
      await user.type(screen.getByLabelText(/email/i), "invalid");
      expect(screen.getByRole("button", { name: /envoyer/i })).toBeDisabled();
    });
  });

  describe("Chaotic user scenario", () => {
    it("should handle invalid inputs, corrections, re-corruption, and final submission", async () => {
      const user = userEvent.setup();
      renderForm();
      const button = screen.getByRole("button", { name: /envoyer/i });

      // Types numbers in nom
      await user.type(screen.getByLabelText(/^nom$/i), "Jean123");
      expect(screen.getByText(/invalid identity/i)).toBeInTheDocument();
      expect(button).toBeDisabled();

      // Corrects nom
      await user.clear(screen.getByLabelText(/^nom$/i));
      await user.type(screen.getByLabelText(/^nom$/i), "Dupont");
      expect(screen.queryByText(/invalid identity/i)).not.toBeInTheDocument();

      // XSS in prénom
      await user.type(
        screen.getByLabelText(/prénom/i),
        "<script>alert('xss')</script>",
      );
      expect(screen.getByText(/xss detected/i)).toBeInTheDocument();

      // Corrects prénom
      await user.clear(screen.getByLabelText(/prénom/i));
      await user.type(screen.getByLabelText(/prénom/i), "Marie");

      // Incomplete email
      await user.type(screen.getByLabelText(/email/i), "jean@");
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();

      // Corrects email
      await user.clear(screen.getByLabelText(/email/i));
      await user.type(screen.getByLabelText(/email/i), "jean@example.com");
      expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();

      // Underage date
      const underageDate = new Date();
      underageDate.setFullYear(underageDate.getFullYear() - 10);
      fireEvent.change(screen.getByLabelText(/date de naissance/i), {
        target: { value: underageDate.toISOString().split("T")[0] },
      });
      expect(screen.getByText(/underage/i)).toBeInTheDocument();

      // Corrects date
      fireEvent.change(screen.getByLabelText(/date de naissance/i), {
        target: { value: "1990-05-20" },
      });
      expect(screen.queryByText(/underage/i)).not.toBeInTheDocument();

      // Invalid postal code
      await user.type(screen.getByLabelText(/code postal/i), "ABC");
      expect(screen.getByText(/invalid postal code/i)).toBeInTheDocument();

      // Corrects postal code
      await user.clear(screen.getByLabelText(/code postal/i));
      await user.type(screen.getByLabelText(/code postal/i), "75001");
      expect(
        screen.queryByText(/invalid postal code/i),
      ).not.toBeInTheDocument();

      // Fills ville
      await user.type(screen.getByLabelText(/ville/i), "Paris");

      // Button should be enabled now
      expect(button).toBeEnabled();

      // Re-corrupts email
      await user.clear(screen.getByLabelText(/email/i));
      await user.type(screen.getByLabelText(/email/i), "broken");
      expect(button).toBeDisabled();

      // Fixes email again
      await user.clear(screen.getByLabelText(/email/i));
      await user.type(screen.getByLabelText(/email/i), "jean@example.com");
      expect(button).toBeEnabled();
    });
  });

  describe("Form submission - API mocks", () => {
    async function fillFormValid(user) {
      await user.type(screen.getByLabelText(/^nom$/i), "Ferreira");
      await user.type(screen.getByLabelText(/prénom/i), "Sander");
      await user.type(screen.getByLabelText(/email/i), "sander@example.com");
      fireEvent.change(screen.getByLabelText(/date de naissance/i), {
        target: { value: "1999-07-20" },
      });
      await user.type(screen.getByLabelText(/code postal/i), "75001");
      await user.type(screen.getByLabelText(/ville/i), "Paris");
    }

    it("Succès (201) : should call API and navigate to /", async () => {
      axios.post.mockResolvedValue({ status: 201, data: { id: 1 } });

      const user = userEvent.setup();
      renderForm();
      await fillFormValid(user);
      await user.click(screen.getByRole("button", { name: /envoyer/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "https://jsonplaceholder.typicode.com/users",
          expect.objectContaining({ nom: "Ferreira", email: "sander@example.com" }),
        );
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("Erreur métier (400) : should display server error message", async () => {
      axios.post.mockRejectedValue({
        response: { status: 400, data: { message: "Email déjà existant" } },
      });

      const user = userEvent.setup();
      renderForm();
      await fillFormValid(user);
      await user.click(screen.getByRole("button", { name: /envoyer/i }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Email déjà existant",
        );
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("Crash serveur (500) : should display generic error, app must not crash", async () => {
      axios.post.mockRejectedValue({
        response: { status: 500 },
      });

      const user = userEvent.setup();
      renderForm();
      await fillFormValid(user);
      await user.click(screen.getByRole("button", { name: /envoyer/i }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          /erreur serveur/i,
        );
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
