# 🏎️ OxiCar Competition - Sistema de Gestión Integral (Frontend)

> **Plataforma de Gestión Operativa & Dashboard Financiero** - Interfaz moderna diseñada para la transformación digital de **OxiCar Competition**. Una solución SPA (Single Page Application) robusta que centraliza la administración de clientes, vehículos, inventario y servicios mecánicos con una experiencia de usuario fluida y reactiva.

## 🎯 Propuesta de Valor

Este sistema reemplaza los flujos de trabajo manuales y en papel, ofreciendo una "Torre de Control" digital que permite:

* 📊 **Inteligencia de Negocio:** Dashboards en tiempo real con métricas financieras y operativas.
* 🔍 **Trazabilidad Total (Auditoría):** Sistema avanzado de logs que registra quién, cuándo y qué cambió en el sistema, con visualización de diferencias (*Old Value vs. New Value*).
* 🛠️ **Gestión de Taller:** Ciclo de vida completo de órdenes de servicio.
* 📦 **Inventario Inteligente:** Control de stock con alertas visuales automáticas para insumos críticos.
* 🛡️ **Seguridad y Roles:** Control de acceso basado en roles (Admin/Empleado) con manejo seguro de sesiones.

---

## 🏗️ Arquitectura Técnica

El proyecto sigue una arquitectura modular y escalable, priorizando la **seguridad de tipos** y la **reutilización de componentes**.

### 🛠 Stack Tecnológico

* **Core:** React 18 + TypeScript + Vite.
* **Estilos:** Tailwind CSS.
* **Estado Global:** **Zustand** (Store ligero y persistente para sesión y UI).
* **Networking:** Axios con patrón de **Interceptores** (Manejo automático de Tokens y Errores 401/403).
* **Validaciones:** React Hook Form + Zod.

### 🧩 Patrones y Decisiones de Diseño

* Manejo Centralizado de Errores (errorHandler.ts): Implementación de un diccionario técnico que intercepta códigos de estado del servidor y errores de la base de datos MySQL, transformándolos en mensajes claros y amigables para el usuario del taller.

* Seguridad por Capas (Guards & Permission Gate): Uso de Higher-Order Components (HOC) y Guards de navegación para proteger rutas y elementos de la UI basándose en roles de usuario, asegurando que solo el administrador acceda a métricas sensibles.

* Arquitectura de Networking Robusta: Configuración de instancias de Axios con interceptores de respuesta para gestionar automáticamente la expiración de tokens y errores de red, garantizando una sesión segura y sin "estados zombis".

* Gestión de Estado Persistente: Utilización de Zustand con middleware de persistencia, permitiendo que la sesión y las preferencias de la interfaz se mantengan tras recargar la página, mejorando la agilidad operativa.

* Sistema de Auditoría Visual (AuditDetailsModal.tsx): Lógica de comparación de objetos (diffing) para mostrar de forma legible los cambios históricos en el sistema, diferenciando visualmente entre creación, modificación y borrado lógico.

* Control de Flujo Asíncrono (Abort Controller): Implementación de utilidades para cancelar peticiones pendientes cuando un componente se desmonta, evitando fugas de memoria y actualizaciones de estado en componentes inexistentes.

* Sistema de Componentes Reutilizables: Implementación de una arquitectura de componentes atómicos (Table, Toggle, ActionButton, Button) que asegura la consistencia visual en toda la SPA y facilita la escalabilidad del sistema ante nuevos módulos operativos.

---

## 🚀 Instalación y Despliegue

### Pasos para Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/facucastellano19/OxiCar-Frontend.git
cd OxiCar-Frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (.env)
VITE_API_BASE_URL=http://localhost:3000/api

# 4. Iniciar servidor de desarrollo
npm run dev

```

---

## 👤 Autor y Contacto

**Facundo Castellano** - *Full Stack Developer & Técnico Analista de Sistemas*

* [LinkedIn](https://www.linkedin.com/in/facundocastellano/)
* **Email:** castellanofacundo05@gmail.com
