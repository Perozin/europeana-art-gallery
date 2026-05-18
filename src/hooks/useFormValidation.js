// src/hooks/useFormValidation.js

import { useState } from "react";
import { validateField } from "../utils/validation";

export function useFormValidation(initialValues, schema, t ) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});  

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    const error = validateField(name, fieldValue, schema[name], t);

    setValues((prev) => ({ ...prev, [name]: fieldValue }));

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (error) {
        newErrors[name] = error;
      } else {
        delete newErrors[name]; 
      }

      return newErrors;
    });
  }

  function handleBlur(e) {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }

  function validateAll() {
  const newErrors = {};
  const newTouched = {};

  Object.keys(schema).forEach((field) => {
    const error = validateField(field, values[field], schema[field], t);
    if (error) newErrors[field] = error;

    newTouched[field] = true; // 🔥 marca como touched
  });

  setErrors(newErrors);
  setTouched(newTouched); // 🔥 ESSENCIAL

  return Object.keys(newErrors).length === 0;
}

  return {
    values,
    setValues,
    errors,
    setErrors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
  };
}

