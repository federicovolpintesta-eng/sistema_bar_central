# Manual de Configuración en Tally.so — Bar Central

Para que tus colaboradores hagan el inventario en segundos desde su celular sin escribir, creá un formulario en [Tally.so](https://tally.so) (es gratis y no requiere programar).

## 1. Diseño del Formulario (Campos a agregar)

Agregá los siguientes bloques en Tally:

1. **Título**: `🍸 Inventario Bar Central`
2. **Desplegable (Dropdown)** — *Key: `turno`*:
   - Opciones: `Mañana (08:00 a 16:00)`, `Tarde (16:00 a 00:00)`, `Noche (00:00 a 08:00)`.
3. **Texto corto (Short Text)** — *Key: `responsable`*:
   - Título: `Tu Nombre / Iniciales`.
4. **Elección Única (Multiple Choice / Buttons)** — *Key: `tipo_movimiento`*:
   - Opciones: `Apertura de Turno` (Conteo inicial), `Reposición de Depósito` (Llegada de mercadería), `Baja / Consumo` (Salida de barra), `Rotura / Merma` (Pérdidas), `Cierre de Turno` (Conteo final).
5. **Desplegable (Dropdown)** — *Key: `categoria`*:
   - Opciones: `Bebidas con Alcohol`, `Cervezas`, `Bebidas Sin Alcohol`, `Cafetería y Desayuno`, `Cristalería y Vajilla`.

---

## 2. Lógica Condicional (La magia de la velocidad)

Para que el colaborador no tenga que buscar en una lista de 30 productos, configurá en Tally la lógica condicional (Conditional Logic) para que aparezca un campo desplegable diferente según la categoría elegida:

- **Si Categoría es `Bebidas con Alcohol`**, mostrar Desplegable (`producto`):
  `LICOR BAILEYS`, `FERNET BRANCA`, `APEROL`, `RON HAVANA`, `RON BACARDÍ`, `ESPUMANTE`.

- **Si Categoría es `Cervezas`**, mostrar Desplegable (`producto`):
  `LAGER`, `GOLDEN`, `STOUT`, `IPA`, `APA`, `AMBER LAGER`.

- **Si Categoría es `Bebidas Sin Alcohol`**, mostrar Desplegable (`producto`):
  `AGUA SIN GAS (FARDO)`, `AGUA CON GAS (FARDO)`, `AGUA SABORIZADA (FARDO)`, `BOTELLA AQUA GENERAL`, `GASEOSA PERSONAL`.

- **Si Categoría es `Cafetería y Desayuno`**, mostrar Desplegable (`producto`):
  `CAFE EN GRANO`, `JUGO DE NARANJA`.

- **Si Categoría es `Cristalería y Vajilla`**, mostrar Desplegable (`producto`):
  `COPAS DE VINO`, `COPAS DE ESPUMANTE`, `VASOS TRAGO LARGO`, `VASOS TRAGO CORTO`, `TAZAS DE CAFÉ`, `OTROS`.

---

## 3. Cantidad y Comentarios

6. **Número (Number)** — *Key: `cantidad`*:
   - Título: `Cantidad (Botellas, Fardos, Kg o Unidades)`.
   - *Configurar teclado numérico para celular*.
7. **Texto Largo (Long Text)** opcional — *Key: `observaciones`*:
   - Título: `Observaciones / Motivo de rotura (Opcional)`.

---

## 4. Conexión Webhook con n8n

Cuando termines el diseño:
1. Andá a la pestaña **Integrations** de Tally.so.
2. Buscá **Webhooks** y hacé clic en `Connect`.
3. Pegá la URL de tu nodo Webhook de n8n (La que obtengas al importar el archivo JSON en tu servidor n8n).
4. ¡Listo! Al darle a publicar, cada vez que un bartender envíe un conteo, viajará al instante a tu Google Sheet y a tu WhatsApp.
