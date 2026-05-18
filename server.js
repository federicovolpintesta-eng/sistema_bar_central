require('dotenv').config();
const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize LibSQL / Turso Database Client
// If TURSO_DATABASE_URL is not set in env, defaults to local SQLite file
const dbUrl = process.env.TURSO_DATABASE_URL || 'file:bar_central.db';
const dbToken = process.env.TURSO_AUTH_TOKEN;

const db = createClient({
    url: dbUrl,
    authToken: dbToken
});

console.log(`🔌 Initializing Database Connection to: ${dbUrl.startsWith('file:') ? 'Local SQLite (file:bar_central.db)' : 'Turso Cloud DB'}`);

async function initDb() {
    try {
        // Create catalog table
        await db.execute(`CREATE TABLE IF NOT EXISTS catalog (
            id TEXT PRIMARY KEY,
            cat TEXT,
            nombre TEXT,
            unidad TEXT,
            stock INTEGER,
            min INTEGER,
            badge TEXT,
            precio REAL
        )`);

        // Create movements table
        await db.execute(`CREATE TABLE IF NOT EXISTS movements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user TEXT,
            role TEXT,
            shift TEXT,
            mov_type TEXT,
            cat TEXT,
            product TEXT,
            qty INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log('✅ Tables validated in database.');
        await seedCatalog();
    } catch (err) {
        console.error('❌ Error initializing database tables:', err);
    }
}

async function seedCatalog() {
    try {
        const res = await db.execute("SELECT COUNT(*) AS count FROM catalog");
        const count = res.rows[0].count;

        if (count === 0 || count === 0n) {
            console.log('🌱 Seeding initial Bar Central premium catalog...');
            const initialCatalog = [
                { id: 'BC_ALC_001', cat: 'Bebidas con Alcohol', nombre: 'LICOR BAILEYS', unidad: 'Botella', stock: 8, min: 2, badge: 'Alcohol', precio: 18500 },
                { id: 'BC_ALC_002', cat: 'Bebidas con Alcohol', nombre: 'FERNET BRANCA', unidad: 'Botella', stock: 18, min: 5, badge: 'Alcohol', precio: 12000 },
                { id: 'BC_ALC_003', cat: 'Bebidas con Alcohol', nombre: 'APEROL', unidad: 'Botella', stock: 2, min: 3, badge: 'Alcohol', precio: 14500 },
                { id: 'BC_ALC_004', cat: 'Bebidas con Alcohol', nombre: 'RON HAVANA', unidad: 'Botella', stock: 12, min: 2, badge: 'Alcohol', precio: 16000 },
                { id: 'BC_ALC_005', cat: 'Bebidas con Alcohol', nombre: 'RON BACARDÍ', unidad: 'Botella', stock: 9, min: 2, badge: 'Alcohol', precio: 15500 },
                { id: 'BC_ALC_006', cat: 'Bebidas con Alcohol', nombre: 'ESPUMANTE', unidad: 'Botella', stock: 15, min: 6, badge: 'Alcohol', precio: 9500 },
                { id: 'BC_CER_001', cat: 'Cervezas', nombre: 'LAGER', unidad: 'Botella', stock: 45, min: 24, badge: 'Cervezas', precio: 3200 },
                { id: 'BC_CER_002', cat: 'Cervezas', nombre: 'GOLDEN', unidad: 'Botella', stock: 36, min: 24, badge: 'Cervezas', precio: 3200 },
                { id: 'BC_CER_003', cat: 'Cervezas', nombre: 'STOUT', unidad: 'Botella', stock: 14, min: 12, badge: 'Cervezas', precio: 3500 },
                { id: 'BC_CER_004', cat: 'Cervezas', nombre: 'IPA', unidad: 'Botella', stock: 28, min: 24, badge: 'Cervezas', precio: 3800 },
                { id: 'BC_CER_005', cat: 'Cervezas', nombre: 'APA', unidad: 'Botella', stock: 18, min: 12, badge: 'Cervezas', precio: 3800 },
                { id: 'BC_CER_006', cat: 'Cervezas', nombre: 'AMBER LAGER', unidad: 'Botella', stock: 22, min: 12, badge: 'Cervezas', precio: 3500 },
                { id: 'BC_SAL_001', cat: 'Bebidas Sin Alcohol', nombre: 'AGUA SIN GAS (FARDO)', unidad: 'Fardo x12', stock: 12, min: 5, badge: 'Sin Alc', precio: 8000 },
                { id: 'BC_SAL_002', cat: 'Bebidas Sin Alcohol', nombre: 'AGUA CON GAS (FARDO)', unidad: 'Fardo x12', stock: 8, min: 5, badge: 'Sin Alc', precio: 8000 },
                { id: 'BC_SAL_003', cat: 'Bebidas Sin Alcohol', nombre: 'AGUA SABORIZADA (FARDO)', unidad: 'Fardo x12', stock: 6, min: 4, badge: 'Sin Alc', precio: 9500 },
                { id: 'BC_SAL_004', cat: 'Bebidas Sin Alcohol', nombre: 'BOTELLA AQUA GENERAL', unidad: 'Botella', stock: 32, min: 10, badge: 'Sin Alc', precio: 1500 },
                { id: 'BC_SAL_005', cat: 'Bebidas Sin Alcohol', nombre: 'GASEOSA PERSONAL', unidad: 'Unidad', stock: 40, min: 24, badge: 'Sin Alc', precio: 2200 },
                { id: 'BC_CAF_001', cat: 'Cafetería y Desayuno', nombre: 'CAFE EN GRANO', unidad: 'Kg', stock: 5, min: 3, badge: 'Cafetería', precio: 28000 },
                { id: 'BC_CAF_002', cat: 'Cafetería y Desayuno', nombre: 'JUGO DE NARANJA', unidad: 'Kg', stock: 12, min: 10, badge: 'Cafetería', precio: 4500 },
                { id: 'BC_ROT_001', cat: 'Cristalería y Vajilla', nombre: 'COPAS DE VINO', unidad: 'Unidad', stock: 3, min: 5, badge: 'Vajilla', precio: 6500 },
                { id: 'BC_ROT_002', cat: 'Cristalería y Vajilla', nombre: 'COPAS DE ESPUMANTE', unidad: 'Unidad', stock: 18, min: 5, badge: 'Vajilla', precio: 6500 },
                { id: 'BC_ROT_003', cat: 'Cristalería y Vajilla', nombre: 'VASOS TRAGO LARGO', unidad: 'Unidad', stock: 24, min: 5, badge: 'Vajilla', precio: 4000 },
                { id: 'BC_ROT_004', cat: 'Cristalería y Vajilla', nombre: 'VASOS TRAGO CORTO', unidad: 'Unidad', stock: 20, min: 5, badge: 'Vajilla', precio: 4000 },
                { id: 'BC_ROT_005', cat: 'Cristalería y Vajilla', nombre: 'TAZAS DE CAFÉ', unidad: 'Unidad', stock: 15, min: 5, badge: 'Vajilla', precio: 5000 },
                { id: 'BC_ROT_006', cat: 'Cristalería y Vajilla', nombre: 'OTROS', unidad: 'Unidad', stock: 4, min: 1, badge: 'Vajilla', precio: 3000 }
            ];

            for (const p of initialCatalog) {
                await db.execute({
                    sql: "INSERT INTO catalog (id, cat, nombre, unidad, stock, min, badge, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    args: [p.id, p.cat, p.nombre, p.unidad, p.stock, p.min, p.badge, p.precio]
                });
            }

            // Insert sample initial activity
            await db.execute({
                sql: "INSERT INTO movements (user, role, shift, mov_type, cat, product, qty) VALUES (?, ?, ?, ?, ?, ?, ?)",
                args: ['Manager', 'Manager AYB', 'MAÑANA', 'Rotura', 'Cristalería y Vajilla', 'COPAS DE VINO', 1]
            });
            await db.execute({
                sql: "INSERT INTO movements (user, role, shift, mov_type, cat, product, qty) VALUES (?, ?, ?, ?, ?, ?, ?)",
                args: ['Almacén', 'Logística', 'MAÑANA', 'Reposicion', 'Bebidas con Alcohol', 'FERNET BRANCA', 12]
            });
            console.log('✅ Initial catalog seeded successfully.');
        }
    } catch (err) {
        console.error('❌ Error seeding database:', err);
    }
}

// Run DB Initialization
initDb();

// --- REST API ENDPOINTS ---

// 1. Get Catalog
app.get('/api/catalog', async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM catalog ORDER BY id");
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /api/catalog:', err);
        res.status(500).json({ error: 'Error al consultar el catálogo.' });
    }
});

// 2. Get Recent Movements
app.get('/api/movements', async (req, res) => {
    try {
        const result = await db.execute("SELECT * FROM movements ORDER BY id DESC LIMIT 15");
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /api/movements:', err);
        res.status(500).json({ error: 'Error al consultar movimientos.' });
    }
});

// 3. Create Movement
app.post('/api/movements', async (req, res) => {
    const { user, role, shift, mov_type, cat, product, qty } = req.body;
    if (!product || !mov_type || isNaN(qty)) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
    }

    const quantity = parseInt(qty);

    try {
        // Fetch current stock
        const catRes = await db.execute({
            sql: "SELECT stock FROM catalog WHERE nombre = ?",
            args: [product]
        });

        if (catRes.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        let currentStock = Number(catRes.rows[0].stock);
        let newStock = currentStock;

        if (mov_type === 'Reposicion') newStock += quantity;
        else if (mov_type === 'Consumo') newStock = Math.max(0, newStock - quantity);
        else if (mov_type === 'Rotura') newStock = Math.max(0, newStock - quantity);
        else if (mov_type === 'Apertura' || mov_type === 'Cierre') newStock = quantity;

        // Update catalog table
        await db.execute({
            sql: "UPDATE catalog SET stock = ? WHERE nombre = ?",
            args: [newStock, product]
        });

        // Record movement
        await db.execute({
            sql: "INSERT INTO movements (user, role, shift, mov_type, cat, product, qty) VALUES (?, ?, ?, ?, ?, ?, ?)",
            args: [user, role, shift, mov_type, cat, product, quantity]
        });

        res.json({ success: true, message: 'Movimiento registrado correctamente', newStock });
    } catch (err) {
        console.error('Error in POST /api/movements:', err);
        res.status(500).json({ error: 'Error al registrar el movimiento.' });
    }
});

// 4. Sync Simulation
app.post('/api/sync', async (req, res) => {
    res.json({ success: true, message: 'Sincronización exitosa con Turso Cloud DB & Google Sheets.' });
});

// Fallback all routes to index.html for SPA consistency
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Premium Bar Central Server running on http://localhost:${PORT}`);
});
