import { faker } from "@faker-js/faker";

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
    cy.visit("/");
  });

  it("should fill the form with valid data and submit successfully", () => {
    cy.get("#nom").type(user.nom);
    cy.get("#prenom").type(user.prenom);
    cy.get("#email").type(user.email);
    cy.get("#dateNaissance").type(user.dateNaissance);
    cy.get("#cp").type(user.cp);
    cy.get("#ville").type(user.ville);

    cy.get('button[type="submit"]').should("not.be.disabled");
    cy.get('button[type="submit"]').click();

    cy.get('[role="alert"]').should("be.visible");
    cy.get("#nom").should("have.value", "");
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

  it("should save data to localStorage on submit", () => {
    cy.get("#nom").type(user.nom);
    cy.get("#prenom").type(user.prenom);
    cy.get("#email").type(user.email);
    cy.get("#dateNaissance").type(user.dateNaissance);
    cy.get("#cp").type(user.cp);
    cy.get("#ville").type(user.ville);

    cy.get('button[type="submit"]').click();

    cy.window().then((win) => {
      const data = JSON.parse(win.localStorage.getItem("formData"));
      expect(data.nom).to.equal(user.nom);
      expect(data.email).to.equal(user.email);
    });
  });
});
