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

## 3. Desplegar como aplicación web

1. **Desplegar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. Ejecutar como: **Yo (tu cuenta)**.
4. Quién tiene acceso: **Cualquier usuario**.
5. Copia la URL que te da (termina en `/exec`).

> El endpoint solo expone las tarifas de la Sheet (no datos de clientes), por eso el acceso público al endpoint no es un problema — la restricción de acceso a la calculadora en sí la hace el login por correo en el frontend, que es un paso aparte.

## 4. Conectar el frontend

En la raíz del repo, copia `.env.example` a `.env.local` y pega la URL:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
```

Reinicia `npm run dev` — el pie de página de la app debe pasar de "tarifas de ejemplo" a "leídas de la Google Sheet en vivo".

## Pendiente (no implementado todavía)

- **OpenRouteService**: hoy la distancia se calcula en línea recta con un factor de corrección (`src/lib/geo.js`). Falta añadir un `doPost` en `Code.gs` que reciba los 3 puntos del mapa y llame a la API de OpenRouteService (guardando la API key en Propiedades del script, no en el código) para devolver distancia, tiempo y desnivel reales.
- **Login por correo**: el endpoint actual es de solo lectura y público. Cuando se añada el login con Google en el frontend, este script deberá validar el correo autenticado contra una lista de personal autorizado antes de responder.
