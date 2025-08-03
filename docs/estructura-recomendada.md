## Estructura Recomendada del Repositorio

sitio-web/
├── index.html                    # Página principal (SOLO UNA)
├── agendar-cita.html
├── contacto.html
├── aviso-privacidad.html
├── politica-cookies.html
├── terminos-condiciones.html
├── css/
│   ├── styles.css               # CSS principal
│   ├── social-media.css
│   └── cookie-banner.css
├── js/
│   ├── content-protection.js
│   └── cookie-banner.js
├── images/                      # Todas las imágenes
├── robots.txt
├── sitemap.xml
├── .htaccess
├── LICENSE
├── README.md
├── .gitignore
├── deploy.sh                    # Script de despliegue
└── docs/                        # Documentación y configuraciones
    ├── nginx-config.conf
    └── setup-instructions.md

## Archivos a ELIMINAR:
- /frontend/ (mover contenido a raíz)
- /backend/ (no se usa)
- nginx.conf (duplicado)
- nginx-config-complete.conf (mover a docs/)
- comandos-servidor.md (mover a docs/)
- diagnostico-servidor.md (temporal)
- fix-nginx-https.sh (temporal)
