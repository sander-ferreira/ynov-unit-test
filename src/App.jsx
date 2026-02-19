import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UsersProvider } from "./UsersContext";
import { Home } from "./Home";
import { RegistrationForm } from "./RegistrationForm";

export function App() {
  return (
    <UsersProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegistrationForm />} />
        </Routes>
      </BrowserRouter>
    </UsersProvider>
  );
}
