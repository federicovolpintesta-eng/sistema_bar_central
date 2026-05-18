# Estructura y Fórmulas para Google Sheets — Bar Central

Para unificar tus inventarios y dejar atrás los 10 archivos Excel separados, creá un nuevo Google Sheet llamado **`Sistema_Inventario_BarCentral`** con las siguientes 3 pestañas:

---

## Pestaña 1: `Catálogo`
Podés importar directamente el archivo `catalogo_productos.csv` que acabo de generar en tu carpeta.

**Columnas:**
- `A`: `ID_PRODUCTO`
- `B`: `CATEGORIA`
- `C`: `NOMBRE_PRODUCTO`
- `D`: `UNIDAD_MEDIDA`
- `E`: `STOCK_MINIMO_ALERTA`

---

## Pestaña 2: `Movimientos`
Esta hoja es donde n8n guardará automáticamente cada formulario que se envíe desde Tally. Nadie debe tocar esta hoja manualmente.

**Columnas:**
- `A`: `FECHA_HORA` (Ej: 17/05/2026 14:30:00)
- `B`: `TURNO` (Mañana / Tarde / Noche)
- `C`: `RESPONSABLE` (Nombre de quien hizo la carga)
- `D`: `TIPO_MOVIMIENTO` (`Apertura` / `Reposicion` / `Consumo` / `Rotura` / `Cierre`)
- `E`: `CATEGORIA`
- `F`: `PRODUCTO`
- `G`: `CANTIDAD` (Número)
- `H`: `OBSERVACIONES` (Texto opcional)

---

## Pestaña 3: `Stock_Actual` (Hoja Dinámica de Saldos)

En esta hoja verás el inventario en tiempo real. Configurala así:

**Columnas estáticas (A, B, C copiadas del Catálogo):**
- `A`: `PRODUCTO`
- `B`: `CATEGORIA`
- `C`: `STOCK_MINIMO`

**Columnas automáticas (Fórmulas para poner en la fila 2 y arrastrar hacia abajo):**

- `D`: `ULTIMA_APERTURA` (Lo que había al empezar el día/turno)
  ```excel
  =IFNA(INDEX(Movimientos!$G$2:$G$10000, MATCH(1, (Movimientos!$F$2:$F$10000=A2)*(Movimientos!$D$2:$D$10000="Apertura"), 0)), 0)
  ```

- `E`: `REPOSICIONES_HOY` (Mercadería recibida en el día)
  ```excel
  =SUMIFS(Movimientos!$G$2:$G$10000, Movimientos!$F$2:$F$10000, A2, Movimientos!$D$2:$D$10000, "Reposicion", Movimientos!$A$2:$A$10000, ">=" & TODAY())
  ```

- `F`: `CONSUMOS_HOY` (Bajas por venta o despacho)
  ```excel
  =SUMIFS(Movimientos!$G$2:$G$10000, Movimientos!$F$2:$F$10000, A2, Movimientos!$D$2:$D$10000, "Consumo", Movimientos!$A$2:$A$10000, ">=" & TODAY())
  ```

- `G`: `ROTURAS_HOY` (Bajas por cristalería o merma)
  ```excel
  =SUMIFS(Movimientos!$G$2:$G$10000, Movimientos!$F$2:$F$10000, A2, Movimientos!$D$2:$D$10000, "Rotura", Movimientos!$A$2:$A$10000, ">=" & TODAY())
  ```

- `H`: `STOCK_CALCULADO` (Fórmula de saldo)
  ```excel
  =D2 + E2 - F2 - G2
  ```

- `I`: `ESTADO_ALERTA`
  ```excel
  =IF(H2 <= C2, "⚠️ STOCK CRÍTICO", "✅ NORMAL")
  ```

> [!TIP]
> **Formato Condicional**: En la columna I, aplicá formato condicional para que se ponga en color Rojo brillante automáticamente cuando el texto sea "⚠️ STOCK CRÍTICO". Así, al abrir la planilla, salta a la vista al instante qué hay que comprar o pedir a depósito.
