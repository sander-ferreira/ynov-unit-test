import { faker } from "@faker-js/faker";

const API_URL = "https://jsonplaceholder.typicode.com/users";

describe("Registration Form E2E", () => {
  const user = {
    nom: faker.person.lastName(),
    prenom: faker.person.firstName(),
    email: faker.internet.email(),
    dateNaissance: "1995-06-15",
    cp: faker.location.zipCode("#####"),
    ville: faker.location.city().replace(/[^a-zA-ZÀ-ÿ\s-]/g, ""),
  };

  beforeEach(() => {
    cy.intercept("GET", API_URL, { statusCode: 200, body: [] }).as("getUsers");
    cy.visit("/register");
  });

  it("should fill the form with valid data and submit successfully", () => {
    cy.intercept("POST", API_URL, {
      statusCode: 201,
      body: { id: 1, ...user },
    }).as("postUser");

    cy.get("#nom").type(user.nom);
    cy.get("#prenom").type(user.prenom);
    cy.get("#email").type(user.email);
    cy.get("#dateNaissance").type(user.dateNaissance);
    cy.get("#cp").type(user.cp);
    cy.get("#ville").type(user.ville);

    cy.get('button[type="submit"]').should("not.be.disabled");
    cy.get('button[type="submit"]').click();

    cy.wait("@postUser");
    cy.url().should("not.include", "/register");
  });

  it("should show error for invalid email and disable submit", () => {
    cy.get("#nom").type(user.nom);
    cy.get("#prenom").type(user.prenom);
    cy.get("#email").type("invalid-email");
    cy.get("#dateNaissance").type(user.dateNaissance);
    cy.get("#cp").type(user.cp);
    cy.get("#ville").type(user.ville);

    cy.contains("invalid email").should("be.visible");
    cy.get('button[type="submit"]').should("be.disabled");
  });

  it("should show error for underage date of birth", () => {
    cy.get("#dateNaissance").type("2015-01-01");
    cy.contains("underage").should("be.visible");
  });

  it("should display server error on 400 (email already exists)", () => {
    cy.intercept("POST", API_URL, {
      statusCode: 400,
      body: { message: "Email déjà existant" },
    }).as("postUser400");

    cy.get("#nom").type(user.nom);
    cy.get("#prenom").type(user.prenom);
    cy.get("#email").type(user.email);
    cy.get("#dateNaissance").type(user.dateNaissance);
    cy.get("#cp").type(user.cp);
    cy.get("#ville").type(user.ville);

    cy.get('button[type="submit"]').click();

    cy.wait("@postUser400");
    cy.get('[role="alert"]').should("contain", "Email déjà existant");
    cy.url().should("include", "/register");
  });

  it("should display generic error on 500 and not crash", () => {
    cy.intercept("POST", API_URL, { statusCode: 500 }).as("postUser500");

    cy.get("#nom").type(user.nom);
    cy.get("#prenom").type(user.prenom);
    cy.get("#email").type(user.email);
    cy.get("#dateNaissance").type(user.dateNaissance);
    cy.get("#cp").type(user.cp);
    cy.get("#ville").type(user.ville);

    cy.get('button[type="submit"]').click();

    cy.wait("@postUser500");
    cy.get('[role="alert"]').should("contain", "erreur serveur");
    cy.url().should("include", "/register");
  });
});
