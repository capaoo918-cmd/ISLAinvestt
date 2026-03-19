# Guía de Despliegue: IsllaInvest en la Nube

Sigue estos pasos para que tus socios puedan acceder a la plataforma desde cualquier lugar.

## Paso 1: Preparar el Repositorio (GitHub)
1. Crea un repositorio **Privado** en tu cuenta de GitHub llamado `IsllaInvest-Web`.
2. En tu terminal local (aquí mismo), ejecuta:
   ```bash
   git add .
   git commit -m "Preparación para despliegue en la nube"
   git remote add origin https://github.com/TU_USUARIO/IsllaInvest-Web.git
   git push -u origin main
   ```

## Paso 2: Desplegar el Backend (Railway)
1. Entra en [Railway.app](https://railway.app/) y crea un nuevo proyecto.
2. Selecciona **"Deploy from GitHub repo"** y elige tu repositorio.
3. En la configuración del servicio, establece el **Root Directory** como `backend`.
4. Añade las siguientes **Variables (Variables)**:
   - `DATABASE_URL`: (Cópiala de tu .env local)
   - `JWT_SECRET`: (Cópiala de tu .env local)
   - `OPENAI_API_KEY`: (Cópiala de tu .env local)
   - `RESEND_API_KEY`: (Cópiala de tu .env local)
   - `NODE_ENV`: `production`

## Paso 3: Desplegar el Frontend (Vercel)
1. Entra en [Vercel.com](https://vercel.com/) y crea un nuevo proyecto.
2. Importa el mismo repositorio de GitHub.
3. En la configuración:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
4. Añade la **Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: `https://TU_URL_DE_RAILWAY.up.railway.app/api`

## Paso 4: Resolución de errores (Si ves "Load Failed")
Si tu socio sigue viendo el recuadro rojo, revisa lo siguiente:

1. **¿Has subido mis últimos cambios?**: Ejecuta estos comandos para asegurar que la nube tenga mis arreglos de seguridad:
   ```bash
   git add .
   git commit -m "fix: flexibilidad CORS para socios"
   git push origin main
   ```
2. **Variable en Vercel**: Entra al panel de Vercel -> Settings -> Environment Variables. Asegúrate de que `NEXT_PUBLIC_API_URL` apunte a tu link de Railway (terminado en `/api`). **¡Muy importante!** Si no la pusiste, el sistema buscará el servidor en "localhost" por defecto y fallará.
3. **Link correcto**: Asegúrate de que tu socio esté usando el link que termina en `.vercel.app`, no `localhost:3000`.

Una vez que Vercel termine de actualizarse con el nuevo código, el error debería desaparecer.
