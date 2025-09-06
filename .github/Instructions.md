# Instrucciones para GitHub Copilot - Sitio Web Dr. Alejandro Viveros Domínguez

**Propósito del Proyecto**: Sitio web profesional para promocionar la práctica privada de otorrinolaringología. El objetivo principal es mantener un proceso de despliegue claro y confiable.

**Tecnologías Clave**:
- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: PHP
- Servidor: Stack LEMP (Linux, Nginx, MariaDB, PHP)
- Automatización: Scripts de Bash (`initial-server-setup.sh`, `deploy.sh`)

---

## 🚨 Prioridad Absoluta: Procesos de Despliegue

El foco principal de cualquier tarea de desarrollo o mantenimiento debe ser la claridad y fiabilidad en los despliegues. Ignora cualquier script o documento que no esté directamente relacionado con los dos flujos principales descritos a continuación.

---

### 1. Despliegue Inicial (Configurar un Servidor Nuevo desde Cero)

Este proceso se ejecuta **una sola vez** al crear un nuevo servidor.

**Archivo de Referencia**: `docs/initial-server-setup.sh`

**Instrucciones para Copilot**:
- Siempre que el usuario pregunte sobre configurar un nuevo servidor, proporciona estos pasos EXACTOS:
- **Paso 1**: Clonar el repositorio en el servidor.
  ```bash
  git clone https://github.com/[tu-usuario]/[tu-repositorio].git
  cd [tu-repositorio]