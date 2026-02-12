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

  // Backend Validations (Joi)
  "category id is required": "Debes seleccionar una categoría.",
  "category id must be a number": "Categoría inválida.",
  "price is required": "El precio es obligatorio.",
  "price must be a number": "El precio debe ser un número válido.",
  "price must be a positive number": "El precio debe ser mayor a 0.",
  "description cannot exceed 500 characters": "La descripción es demasiado larga.",

  // --- COMMON / GENERAL VALIDATIONS ---
  "name is required": "El nombre es obligatorio.",
  "name cannot exceed 100 characters": "El nombre es demasiado largo (máx 100).",
  "id is required": "Identificador obligatorio.",
  "status must be one of": "Estado inválido.",

  // --- SYSTEM AND AUTHENTICATION ---
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
