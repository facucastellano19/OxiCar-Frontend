const ERROR_DICTIONARY: Record<string, string> = {
  // --- CLIENTS MODULE ---
  "client with this email or phone already exists":
    "El email o el teléfono ya pertenecen a otro cliente.",
  "vehicles with license plates already assigned":
    "Una o más patentes ya están registradas en el sistema.",
  "phone can only contain numbers and the '+' sign":
    "El teléfono solo puede tener números y el signo +.",
  "license plate is required": "La patente del vehículo es obligatoria.",
  "email is not valid": "El formato del correo electrónico no es válido.",

  // --- SERVICES AND CATEGORIES MODULE ---
  "cannot delete category because it is being used by one or more services":
    "No se puede eliminar la categoría porque tiene servicios asociados.",

  // --- EMPLOYEES AND USERS MODULE ---
  "password must be at least 8 characters long":
    "La contraseña debe tener al menos 8 caracteres.",
  "username must be alphanumeric":
    "El usuario solo puede contener letras y números.",
  "username already exists": "El nombre de usuario ya está en uso.",
  "role id is required": "El rol de usuario es obligatorio.",

  // --- PRODUCTS MODULE (Stock & Validations) ---
  "stock must be a number": "El stock debe ser un número.",
  "stock must be an integer": "El stock debe ser un número entero.",
  "stock cannot be negative": "El stock no puede ser negativo.",
  "stock is required": "El stock es obligatorio.",
  "min stock must be a number": "El stock mínimo debe ser un número.",
  "min stock must be an integer": "El stock mínimo debe ser un número entero.",
  "min stock cannot be negative": "El stock mínimo no puede ser negativo.",
  "min stock is required": "El stock mínimo es obligatorio.",

  // Backend Validations (Joi)
  "category id is required": "Debes seleccionar una categoría.",
  "category id must be a number": "Categoría inválida.",
  "category id must be an integer": "Categoría inválida.",
  "category id must be a positive number": "Categoría inválida.",

  "price is required": "El precio es obligatorio.",
  "price must be a number": "El precio debe ser un número válido.",
  "price must be a positive number": "El precio debe ser mayor a 0.",

  "description must be text": "La descripción debe ser texto.",
  "description cannot exceed 500 characters":
    "La descripción es demasiado larga.",

  // --- COMMON / GENERAL VALIDATIONS ---
  "name is required": "El nombre es obligatorio.",
  "name must be text": "El nombre debe ser texto.",
  "name cannot exceed 100 characters":
    "El nombre es demasiado largo (máx 100).",
  "name cannot exceed 50 characters": "El nombre es demasiado largo (máx 50).",

  "id is required": "Identificador obligatorio.",
  "id must be a number": "ID inválido.",
  "id must be an integer": "ID inválido.",
  "id must be a positive number": "ID inválido.",

  "status must be one of": "Estado inválido.",
  "status must be a string": "Estado inválido.",

  // --- SYSTEM AND AUTHENTICATION ---
  "cannot send created_by field": "No puedes enviar el campo created_by.",
  "cannot send updated_by field": "No puedes enviar el campo updated_by.",
  "cannot send deleted_by field": "No puedes enviar el campo deleted_by.",

  "401": "Sesión expirada. Por favor, vuelve a iniciar sesión.",
  "403": "No tienes permisos suficientes para esta acción.",
  "500": "Error interno del servidor. Intenta de nuevo más tarde.",
};

export const handleBackendError = (error: any): string => {
  const backendData = error.response?.data;
  const status = error.response?.status;

  const rawMessage = (
    backendData?.mensaje ||
    backendData?.message ||
    ""
  ).toLowerCase();

  for (const [key, value] of Object.entries(ERROR_DICTIONARY)) {
    if (rawMessage.includes(key.toLowerCase())) {
      return value;
    }
  }

  if (status && ERROR_DICTIONARY[status.toString()]) {
    return ERROR_DICTIONARY[status.toString()];
  }
  return rawMessage || "Ocurrió un error inesperado.";
};
