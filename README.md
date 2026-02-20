# Projet Unit Test

[![CI](https://github.com/sander-ferreira/ynov-unit-test/actions/workflows/ci.yml/badge.svg)](https://github.com/sander-ferreira/ynov-unit-test/actions/workflows/ci.yml)

Formulaire d'inscription React avec validation, tests et intégration API.

## Scripts

- `npm test` - Tests unitaires et d'intégration
- `npm run lint` - Linting ESLint
- `npm run dev` - Serveur de développement
- `npm run test:e2e` - Tests E2E Cypress
- `npm run test:coverage` - Tests avec couverture

## Architecture des mocks

### Pourquoi des mocks ?

L'application communique avec [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) (POST pour inscrire un utilisateur, GET pour lister les inscrits). Pour que les tests soient **stables**, **rapides** et **sans dépendance réseau**, tous les appels HTTP sont simulés.

### Tests d'intégration (Jest) — `jest.mock('axios')`

Le module `axios` est entièrement remplacé par un mock Jest. Aucun appel réseau réel ne sort des tests.

Trois scénarios sont couverts dans `RegistrationForm.test.jsx` :

| Scénario | Mock | Comportement attendu |
| --- | --- | --- |
| **Succès (201)** | `axios.post.mockResolvedValue({ status: 201 })` | Navigation vers `/`, API appelée avec les bonnes données |
| **Erreur métier (400)** | `axios.post.mockRejectedValue({ response: { status: 400, data: { message: "..." } } })` | Message d'erreur du serveur affiché, pas de navigation |
| **Crash serveur (500)** | `axios.post.mockRejectedValue({ response: { status: 500 } })` | Message d'erreur générique affiché, application stable |

`Home.test.jsx` couvre GET avec succès et erreur serveur.

### Tests E2E (Cypress) — `cy.intercept`

`cy.intercept` bouchonne les routes API pour que les tests passent sans backend réel.

```js
// Exemple — succès
cy.intercept("POST", "https://jsonplaceholder.typicode.com/users", {
  statusCode: 201,
  body: { id: 1 },
}).as("postUser");

// Exemple — erreur métier
cy.intercept("POST", "https://jsonplaceholder.typicode.com/users", {
  statusCode: 400,
  body: { message: "Email déjà existant" },
}).as("postUser400");
```
