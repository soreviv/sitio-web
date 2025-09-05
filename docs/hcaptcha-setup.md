# hCaptcha - configuración rápida

1. Regístrate o inicia sesión en https://www.hcaptcha.com/
2. Añade un nuevo Site (dominio). Al crearlo obtendrás:
   - Site Key (clave pública) — se usa en el frontend
   - Secret Key (clave secreta) — se usa en el backend

3. En el proyecto, configura la secret de forma segura:

- Local (temporal):
```bash
export HCAPTCHA_SECRET="ES_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

- En producción (ejemplos):
  - Docker: variable de entorno en `docker run -e HCAPTCHA_SECRET=...` o en `docker-compose.yml`.
  - Systemd: `Environment=HCAPTCHA_SECRET=...` en el unit file.
  - Apache: `SetEnv HCAPTCHA_SECRET "..."` en el vhost.

4. No subas la secret al repositorio. Usa `.env` en .gitignore o variables de entorno.

5. Verifica que `procesar-formulario.php` use `getenv('HCAPTCHA_SECRET')` (ya está implementado).
