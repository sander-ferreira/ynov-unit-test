# Plan de Test

## Tests unitaires (UT)

Les fonctions de validation sont testées une par une :

- **calculateAge** (`module.test.js`) : age valide, param manquant, mauvais type, date invalide, mineur, date future
- **validateEmail** (`email.test.js`) : email valide, param manquant, mauvais type, formats invalides
- **validateIdentity** (`identity.test.js`) : nom valide, accents, tirets, param manquant, mauvais type, XSS
- **validatePostalCode** (`postal-code.test.js`) : code valide, param manquant, mauvais type, mauvais format

## Tests d'intégration (IT)

Le composant React `RegistrationForm` est testé avec React Testing Library :

- Tous les champs sont affichés
- Le bouton est désactivé quand le formulaire est invalide
- Les erreurs s'affichent en rouge quand on tape une valeur invalide
- Les erreurs disparaissent quand on corrige
- Scénario utilisateur chaotique : saisies invalides, corrections, re-erreurs, corrections, soumission
- Au submit : données sauvegardées dans localStorage (vérifié avec un spy)
- Au submit : message de succès affiché
- Au submit : champs vidés et bouton re-désactivé

## Ce que couvrent les UT mais pas les IT

- Tous les cas limites de chaque validateur (types incorrects, null, undefined...)

## Ce que couvrent les IT mais pas les UT

- Le comportement du DOM (erreurs visibles, bouton disabled/enabled)
- Le localStorage
- Le parcours complet d'un utilisateur
