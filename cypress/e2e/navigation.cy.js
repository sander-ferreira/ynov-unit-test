import { faker } from "@faker-js/faker";

const API_URL = "https://jsonplaceholder.typicode.com/users";

describe("Navigation E2E", () => {
  const validUser = {
    nom: faker.person.lastName(),
    prenom: faker.person.firstName(),
    email: faker.internet.email(),
    dateNaissance: "1995-06-15",
    cp: faker.location.zipCode("#####"),
    ville: faker.location.city().replace(/[^a-zA-ZÀ-ÿ\s-]/g, ""),
  };

  function fillAndSubmit() {
    cy.get("#nom").type(validUser.nom);
    cy.get("#prenom").type(validUser.prenom);
    cy.get("#email").type(validUser.email);
    cy.get("#dateNaissance").type(validUser.dateNaissance);
    cy.get("#cp").type(validUser.cp);
    cy.get("#ville").type(validUser.ville);
    cy.get('button[type="submit"]').click();
  }

  it("Nominal: should register a user and display them on home page", () => {
    // First GET returns 0 users
    cy.intercept("GET", API_URL, { statusCode: 200, body: [] }).as("firstGet");
    cy.intercept("POST", API_URL, {
      statusCode: 201,
      body: { id: 1, ...validUser },
    }).as("postUser");

    cy.visit("/");
    cy.wait("@firstGet");
    cy.get('[data-cy="counter"]').should(
      "contain",
      "0 utilisateur(s) inscrit(s)",
    );
    cy.get('[data-cy="user-list"]').should("not.exist");

    cy.contains("S'inscrire").click();
    cy.url().should("include", "/register");

    // After submit, GET returns the new user
    cy.intercept("GET", API_URL, {
      statusCode: 200,
      body: [{ id: 1, nom: validUser.nom, prenom: validUser.prenom }],
    }).as("secondGet");

    fillAndSubmit();
    cy.wait("@postUser");
    cy.wait("@secondGet");

    cy.url().should("not.include", "/register");
    cy.get('[data-cy="counter"]').should(
      "contain",
      "1 utilisateur(s) inscrit(s)",
    );
    cy.get('[data-cy="user-list"]').should("contain", validUser.nom);
  });

  it("Error: invalid form should not add a new user", () => {
    // Setup: 1 user already registered
    cy.intercept("GET", API_URL, {
      statusCode: 200,
      body: [{ id: 1, nom: validUser.nom, prenom: validUser.prenom }],
    }).as("getUsers");

    cy.visit("/");
    cy.wait("@getUsers");
    cy.get('[data-cy="counter"]').should(
      "contain",
      "1 utilisateur(s) inscrit(s)",
    );

    // Go to register and enter invalid data
    cy.contains("S'inscrire").click();
    cy.get("#nom").type("123invalid");
    cy.contains("invalid identity").should("be.visible");
    cy.get('button[type="submit"]').should("be.disabled");

    // Go back to home
    cy.go("back");
    cy.wait("@getUsers");
    cy.get('[data-cy="counter"]').should(
      "contain",
      "1 utilisateur(s) inscrit(s)",
    );
  });
});
