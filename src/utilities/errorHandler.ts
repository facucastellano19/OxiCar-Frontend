const ERROR_DICTIONARY: Record<string, string> = {
  "client with this email or phone already exists":
    "El email o el teléfono ya pertenecen a otro cliente.",
  "vehicles with license plates already assigned":
    "Una o más patentes ya están registradas en el sistema.",
  "phone can only contain numbers and the '+' sign":
    "El teléfono solo puede tener números y el signo +.",
  "license plate is required": "La patente del vehículo es obligatoria.",
  "email is not valid": "El formato del correo electrónico no es válido.",

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
