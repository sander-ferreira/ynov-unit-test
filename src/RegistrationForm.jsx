import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers } from "./UsersContext";
import { validateIdentity } from "../identity";
import { validateEmail } from "../email";
import { calculateAge } from "../module";
import { validatePostalCode } from "../postal-code";

/**
 * Validate a single form field using the appropriate validator.
 * @param {string} name - The field name.
 * @param {string} value - The field value.
 * @returns {string} Error message or empty string if valid.
 */
function validateField(name, value) {
  if (value === null || value === undefined) return "missing param";
  try {
    switch (name) {
      case "nom":
      case "prenom":
      case "ville":
        validateIdentity(value);
        break;
      case "email":
        validateEmail(value);
        break;
      case "dateNaissance": {
        const date = new Date(value);
        calculateAge({ birth: date });
        break;
      }
      case "cp":
        validatePostalCode(value);
        break;
    }
    return "";
  } catch (e) {
    return e.message;
  }
}

const initialValues = {
  nom: "",
  prenom: "",
  email: "",
  dateNaissance: "",
  cp: "",
  ville: "",
};

/**
 * Registration form component with real-time validation.
 * Uses validators from the business logic layer.
 * On valid submission, saves data to localStorage and shows a success message.
 * @returns {JSX.Element}
 */
export function RegistrationForm() {
  const navigate = useNavigate();
  const { addUser } = useUsers();
  const [values, setValues] = useState({ ...initialValues });
  const [errors, setErrors] = useState({ ...initialValues });
  const [touched, setTouched] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  }

  const isFormValid =
    Object.values(values).every((v) => v !== "") &&
    Object.keys(values).every((k) => validateField(k, values[k]) === "");

  function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;
    localStorage.setItem("formData", JSON.stringify(values));
    addUser(values);
    setShowSuccess(true);
    setValues({ ...initialValues });
    setErrors({ ...initialValues });
    setTouched({});
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nom">Nom</label>
        <input
          id="nom"
          name="nom"
          type="text"
          value={values.nom}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.nom && errors.nom && (
          <span style={{ color: "red" }}>{errors.nom}</span>
        )}
      </div>

      <div>
        <label htmlFor="prenom">Prénom</label>
        <input
          id="prenom"
          name="prenom"
          type="text"
          value={values.prenom}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.prenom && errors.prenom && (
          <span style={{ color: "red" }}>{errors.prenom}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="text"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.email && errors.email && (
          <span style={{ color: "red" }}>{errors.email}</span>
        )}
      </div>

      <div>
        <label htmlFor="dateNaissance">Date de naissance</label>
        <input
          id="dateNaissance"
          name="dateNaissance"
          type="date"
          value={values.dateNaissance}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.dateNaissance && errors.dateNaissance && (
          <span style={{ color: "red" }}>{errors.dateNaissance}</span>
        )}
      </div>

      <div>
        <label htmlFor="cp">Code postal</label>
        <input
          id="cp"
          name="cp"
          type="text"
          value={values.cp}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.cp && errors.cp && (
          <span style={{ color: "red" }}>{errors.cp}</span>
        )}
      </div>

      <div>
        <label htmlFor="ville">Ville</label>
        <input
          id="ville"
          name="ville"
          type="text"
          value={values.ville}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched.ville && errors.ville && (
          <span style={{ color: "red" }}>{errors.ville}</span>
        )}
      </div>

      <button type="submit" disabled={!isFormValid}>
        Envoyer
      </button>

      {showSuccess && <div role="alert">ça fonctioooonne</div>}
    </form>
  );
}
