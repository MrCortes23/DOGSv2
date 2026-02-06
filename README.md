DOGS

DOGS es una aplicación web desarrollada con Next.js 15 orientada a la gestión integral de una guardería y hotel para mascotas. El sistema permite administrar usuarios, mascotas, citas, facturación y comunicación con clientes de manera centralizada, segura y escalable.

El proyecto está diseñado bajo una arquitectura moderna, con separación clara entre frontend, backend y base de datos, aplicando reglas de negocio que garantizan la integridad de la información y el correcto flujo de las operaciones.

---

## Características principales

- Registro y autenticación de usuarios  
- Control de acceso basado en roles (administrador y cliente)  
- Gestión de mascotas (raza, tamaño, enfermedades y observaciones)  
- Programación de citas con validación de conflictos de horario  
- Cálculo automático de costos según el tamaño de la mascota y el servicio  
- Generación y exportación de facturas en formato PDF  
- Bloqueo de edición en facturas ya pagadas  
- Recuperación de contraseña mediante correo electrónico con tokens temporales  
- Envío de notificaciones por email  
- Interfaz responsiva y moderna  

---

## Tecnologías utilizadas

### Frontend
- Next.js 15  
- React  
- Tailwind CSS  
- Material UI (@mui/material)  

### Backend
- API Routes de Next.js  
- NextAuth para autenticación y manejo de sesiones  
- Nodemailer para envío de correos electrónicos  

### Base de datos
- PostgreSQL  
- Cliente `pg` para conexión directa mediante SQL  

---

## Arquitectura

El proyecto sigue una arquitectura de tres capas:

1. **Presentación**  
   - Interfaz de usuario desarrollada en Next.js  
   - Renderizado del lado del servidor (SSR)  

2. **Lógica de negocio**  
   - API Routes para manejo de usuarios, citas, facturas y mascotas  
   - Validaciones de reglas de negocio (citas superpuestas, facturas pagadas, permisos por rol)  

3. **Persistencia**  
   - Base de datos PostgreSQL  
   - Consultas SQL directas para mayor control y rendimiento  

---

## Reglas de negocio

- No se permiten citas superpuestas en el mismo horario  
- Las facturas marcadas como pagadas no pueden ser modificadas  
- El costo del servicio se calcula según el tamaño de la mascota  
- Solo los administradores pueden gestionar facturación y servicios  
- Los clientes solo pueden acceder a su información y la de sus mascotas  

---

## Instalación


1. Clonar el repositorio:

```bash
git clone https://github.com/MrCortes23/DOGSv2.git
cd DOGSv2
```

2. Instalar dependencias:

```
npm install
```

3. Configurar variables de entorno creando un archivo .env.local:

```
DATABASE_URL=postgresql://usuario:password@host:puerto/database
NEXTAUTH_SECRET=tu_secreto
NEXTAUTH_URL=http://localhost:3000
EMAIL_USER=correo@ejemplo.com
EMAIL_PASS=contraseña
```

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/MrCortes23/DOGSv2)
