# Mi Sitio Web

Sitio estático en HTML, CSS y JavaScript para presentar servicios de diseño web y recibir consultas por WhatsApp.

## URLs públicas

- Inicio: https://misitioweb.labweb.top/
- Servicios: https://misitioweb.labweb.top/servicios/
- Contacto: https://misitioweb.labweb.top/contacto/

Las páginas antiguas `servicios.html` y `contacto.html` conservan una redirección a las rutas limpias.

## Publicación con GitHub Pages

En el repositorio, abre **Settings → Pages**, selecciona **Deploy from a branch**, la rama `main` y la carpeta `/(root)`. Configura `misitioweb.labweb.top` como dominio personalizado y activa HTTPS cuando GitHub lo habilite.

En Spaceship, dentro del DNS de `labweb.top`, crea este registro:

| Tipo | Host | Valor | TTL |
| --- | --- | --- | --- |
| CNAME | `misitioweb` | `contruyotuproyecto.github.io` | Automático |

No cambies los registros `@` ni `www`; el dominio raíz `labweb.top` no se modifica.

Cuando el CNAME ya resuelva y HTTPS esté disponible, agrega la propiedad con prefijo de URL `https://misitioweb.labweb.top/` en Google Search Console. Completa el método de verificación que indique Google, envía `https://misitioweb.labweb.top/sitemap.xml` y solicita la indexación de la página principal. El envío ayuda a Google a descubrir el sitio, pero no garantiza cuándo aparecerá en resultados.
