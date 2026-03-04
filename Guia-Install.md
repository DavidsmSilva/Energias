# GUIA-INSTALACION (PowerShell) — Empresa Energía

Este documento está pensado para una persona de otro equipo que necesita clonar, instalar y ejecutar el proyecto en su PC desde cero.

---

## 1) Requisitos previos

Instalar en Windows:

- **Git** (para clonar y versionar).
- **Node.js LTS** (incluye npm).
- **Angular CLI** (opcional pero recomendado para comandos `ng`).

Verificar instalación en **PowerShell**:

```powershell
git --version
node -v
npm -v
```

Si falta Angular CLI:

```powershell
npm install -g @angular/cli
ng version
```

---

## 2) Clonar el repositorio

```powershell
git clone https://github.com/DavidsmSilva/Energias.git
cd Energias
```

Si la carpeta ya existe, entrar a ella:

```powershell
cd "C:\ruta\a\Energias"
```

---

## 3) Instalar dependencias

Desde la raíz del proyecto:

```powershell
npm install
```

Esto descargará todas las librerías definidas en `package.json`.

---

## 4) Ejecutar en local

Opciones válidas:

```powershell
npm run start
```

ó

```powershell
ng serve --open
```

Luego abrir en navegador (si no abrió automáticamente):

- `http://localhost:4200`

---

## 5) Validación rápida

Para validar compilación:

```powershell
npm run build
```

Si compila sin errores, el entorno está correcto.

---

## 6) Errores comunes y solución

### Error A: `remote origin already exists`

Significa que el remoto `origin` ya está configurado.

Ver lo actual:

```powershell
git remote -v
```

Reemplazar URL de `origin`:

```powershell
git remote set-url origin https://github.com/DavidsmSilva/Energias.git
```

O eliminar y volver a agregar:

```powershell
git remote remove origin
git remote add origin https://github.com/DavidsmSilva/Energias.git
```

---

### Error B: `npm : File cannot be loaded because running scripts is disabled on this system`

PowerShell tiene políticas de ejecución restrictivas.

Abrir PowerShell **como administrador** y ejecutar:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Cerrar y abrir PowerShell nuevamente.

---

### Error C: `ng` no se reconoce como comando

Instalar Angular CLI global:

```powershell
npm install -g @angular/cli
```

Si sigue fallando, cerrar/reabrir terminal y validar:

```powershell
ng version
```

---

### Error D: Versiones incompatibles de Node/Angular

Ver versiones:

```powershell
node -v
ng version
```

Recomendación:

- Usar **Node LTS reciente** (idealmente 18+ para Angular 16).
- Reinstalar dependencias luego de cambiar Node:

```powershell
rm -r node_modules
Remove-Item package-lock.json
npm install
```

> Nota: en PowerShell, si `rm -r` no funciona como esperas, usa:
>
> ```powershell
> Remove-Item -Recurse -Force node_modules
> Remove-Item -Force package-lock.json
> ```

---

### Error E: Puerto 4200 ocupado

Ejecutar en otro puerto:

```powershell
ng serve --port 4300 --open
```

---

### Error F: Fallo al hacer `git push` por autenticación

GitHub por HTTPS requiere token (PAT) o SSH.

Opciones:

1. Configurar credenciales con Git Credential Manager.
2. Usar **Personal Access Token** como contraseña al hacer push.
3. Configurar remoto SSH, por ejemplo:

```powershell
git remote set-url origin git@github.com:DavidsmSilva/Energias.git
```

---

## 7) Flujo sugerido para contribuciones

```powershell
git checkout -b feature/mi-cambio
# realizar cambios
git add .
git commit -m "feat: descripción breve"
git push -u origin feature/mi-cambio
```

Luego abrir Pull Request en GitHub.

---

## 8) Checklist de arranque para nuevos miembros

- [ ] Instalé Git, Node.js y npm.
- [ ] Cloné el repo.
- [ ] Ejecuté `npm install` sin errores.
- [ ] Ejecuté `npm run start` y abrió la app.
- [ ] Probé `npm run build` exitosamente.

---

## 9) Contacto de soporte interno

Si después de esta guía persiste el problema, compartir en el canal del equipo:

- Captura del error completo.
- Comandos ejecutados.
- Salida de:

```powershell
node -v
npm -v
git --version
ng version
```

Con eso el diagnóstico será más rápido.
