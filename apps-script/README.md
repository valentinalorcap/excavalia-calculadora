# Backend de Apps Script

Estos pasos hay que hacerlos manualmente desde el navegador, con la cuenta de Google que va a alojar la calculadora (por ahora la personal de Valentina; más adelante se migrará a una cuenta de Excavalia — ver notas del proyecto).

## 1. Crear la Google Sheet

Crea una hoja nueva en Google Sheets con dos pestañas:

### Pestaña `TiposTransporte`

| clave       | etiqueta                  | consumoBase | factorPendiente | tarifaKm | tarifaHora | tarifaBase |
|-------------|----------------------------|-------------|------------------|----------|------------|------------|
| plancha     | Plancha porta vehículo     | 38          | 0.9              | 1.85     | 42         | 60         |
| banera      | Bañera (áridos)             | 42          | 1.1              | 1.95     | 45         | 65         |
| multilift   | Multilift (cubetas)         | 35          | 0.8              | 1.70     | 38         | 55         |
| furgo       | Furgo                       | 12          | 0.3              | 0.95     | 28         | 35         |

(`consumoBase` en L/100km, `factorPendiente` en litros extra por cada 100m de ascenso, `tarifaKm`/`tarifaHora`/`tarifaBase` en €.)

### Pestaña `Config`

| clave              | valor |
|---------------------|-------|
| tarifaMinima         | 90    |
| velocidadMediaKmh    | 45    |
| jornadaHoras         | 8     |

Estos son los mismos valores de ejemplo que trae la app por defecto (`src/config/rates.js`) — sustitúyelos por las tarifas reales cuando las tengáis.

## 2. Vincular el script

1. En la Sheet: **Extensiones → Apps Script**.
2. Borra el contenido de `Código.gs` que viene por defecto y pega el de `apps-script/Code.gs` de este repo.
3. Abre `appsscript.json` desde el icono de engranaje (⚙️ Configuración del proyecto → "Mostrar archivo appsscript.json") y sustitúyelo por el de `apps-script/appsscript.json` de este repo.

## 3. Configurar la clave de OpenRouteService

El script llama a OpenRouteService (perfil `driving-hgv`, pensado para vehículos pesados) para calcular la ruta real de cada tramo. La clave **nunca va en el código** — se guarda como propiedad del script:

1. En el editor de Apps Script: **⚙️ Configuración del proyecto** (icono de engranaje, panel izquierdo).
2. Baja hasta **Propiedades del script → Añadir propiedad de script**.
3. Propiedad: `ORS_API_KEY` — Valor: tu clave de openrouteservice.org.

## 4. Desplegar como aplicación web

1. **Desplegar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Ejecutar como: **Yo (tu cuenta)**.
4. Quién tiene acceso: **Cualquier usuario**.
5. Copia la URL que te da (termina en `/exec`).

> El endpoint de tarifas (`GET`) y el de rutas (`POST`) son públicos por URL — no exponen datos de clientes, solo tarifas y cálculos de ruta. La restricción de acceso a la calculadora en sí la hace el login por correo en el frontend, que es un paso aparte (ver más abajo). Al ser público, cualquiera con la URL podría consumir tu cuota de OpenRouteService si la URL se filtra — otra razón más para priorizar el login.

## 5. Conectar el frontend

En la raíz del repo, copia `.env.example` a `.env.local` y pega la URL:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

Reinicia `npm run dev` — el pie de página debe pasar de "tarifas de ejemplo" a "leídas de la Google Sheet en vivo", y la leyenda del mapa (tras fijar los 3 puntos) debe decir "Ruta real por carretera (OpenRouteService)" en vez de "Estimación en línea recta".

## Pendiente (no implementado todavía)

- **Login por correo**: los dos endpoints son de solo lectura y públicos. Cuando se añada el login con Google en el frontend, este script deberá validar el correo autenticado contra una lista de personal autorizado antes de responder — importante también para no dejar la cuota de OpenRouteService expuesta a cualquiera.
