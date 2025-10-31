# Simulación de Levitación Magnética

Proyecto React + TypeScript para simular la levitación magnética de un vagón con **interdependencias dinámicas** entre variables físicas.

## 🎯 Características Principales

- ✅ **Simulación física realista** con segunda ley de Newton (F = m·a)
- ✅ **Interdependencias automáticas** entre variables
- ✅ **Sistema lineal** con dos hileras de imanes enfrentados
- ✅ **Movimiento infinito** (el vagón permanece fijo, el fondo se mueve)
- ✅ **Paleta de colores profesional** para uso académico
- ✅ **Actualización en tiempo real** de todos los parámetros

---

## 🔄 Interdependencias Dinámicas

### 1. **Masa del Vagón** ↔️ **Peso** ↔️ **Velocidad**
- Si **↑ masa** → **↑ peso** → **↓ velocidad** (más carga, menos velocidad)
- Si **peso > fuerza magnética** → **NO LEVITA** → **velocidad = 0**

### 2. **Distancia entre Imanes** ↔️ **Fuerza Magnética Efectiva**
- Si **↑ distancia** → **↓ fuerza efectiva** (ley del cuadrado inverso)
- Fórmula: `F_efectiva = F_base × (d₀/d_actual)^1.5`
- Si la fuerza efectiva baja demasiado → **pierde levitación**

### 3. **Separación entre Hileras** ↔️ **Estabilidad** ↔️ **Altura**
- Si **↑ separación** → **↓ estabilidad** → **↓ altura máxima**
- Factor de estabilidad: `min(1.0, 6cm / separación_actual)`
- Mayor inestabilidad también reduce la velocidad

### 4. **Fuerza Magnética Total** ↔️ **Estado de Levitación**
- `F_mag_total = F_efectiva × cantidad_imanes × 2` (dos hileras)
- Si `F_mag_total > peso` → **LEVITANDO** ✓
- Si `F_mag_total ≤ peso` → **SIN LEVITACIÓN** ✗

### 5. **Fuerza Neta** ↔️ **Aceleración** ↔️ **Velocidad Real**
- `Fuerza_neta = F_mag_total - peso`
- `Aceleración = Fuerza_neta / masa`
- `Velocidad_real = velocidad_motor × factor_aceleración × factor_estabilidad × factor_carga`

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm

### Instalación

\`\`\`bash
npm install
\`\`\`

### Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build para Producción

\`\`\`bash
npm run build
\`\`\`

---

## 📊 Variables del Sistema

| Variable | Rango | Efecto Principal |
|----------|-------|------------------|
| **Masa del vagón** | 0.1 - 5.0 kg | Afecta peso, velocidad y levitación |
| **Fuerza magnética/imán** | 0.5 - 10.0 N | Determina capacidad de levitación |
| **Cantidad de imanes** | 5 - 20 | Fuerza magnética total |
| **Distancia entre imanes** | 2 - 10 cm | Reduce fuerza efectiva |
| **Separación hileras** | 3 - 12 cm | Afecta estabilidad y altura |
| **Velocidad del motor** | 5 - 50 cm/s | Velocidad base (modulada por física) |
| **Dirección** | ← / → | Sentido del movimiento |

---

## 🧪 Ejemplos de Coherencia Física

### Ejemplo 1: Aumentar la masa
1. Usuario aumenta `masa` de 0.5 kg a 2.0 kg
2. Sistema recalcula:
   - ✓ `peso` aumenta de 4.9 N a 19.6 N
   - ✓ `fuerza_neta` disminuye
   - ✓ `velocidad_real` disminuye (más carga)
   - ⚠️ Si `peso > F_mag_total` → estado cambia a **NO LEVITANDO**

### Ejemplo 2: Aumentar distancia entre imanes
1. Usuario aumenta `distancia` de 4 cm a 8 cm
2. Sistema recalcula:
   - ✓ `F_efectiva` disminuye ~35% (ley cuadrado inverso)
   - ✓ `fuerza_neta` disminuye
   - ✓ `altura_levitación` disminuye
   - ⚠️ Si `F_efectiva × cantidad < peso` → **pierde levitación**

### Ejemplo 3: Aumentar separación entre hileras
1. Usuario aumenta `separación` de 6 cm a 10 cm
2. Sistema recalcula:
   - ✓ `factor_estabilidad` baja de 100% a 60%
   - ✓ `altura_máxima` reducida
   - ✓ `velocidad_real` disminuye (menos estable)

---

## 🎨 Paleta de Colores Profesional

- **Fondo**: `#0F172A` (azul-gris oscuro)
- **Polo Norte**: `#3B82F6` (azul sobrio)
- **Polo Sur**: `#EF4444` (rojo desaturado)
- **Vagón levitando**: `#9CA3AF` (gris metálico)
- **Vagón sin levitar**: `#DC2626` (rojo advertencia)
- **Líneas de fuerza**: `#10B981` (verde ingenieril)

---

## 📚 Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite 5** - Bundler rápido
- **HTML5 Canvas** - Renderizado 2D

---

## 📖 Licencia

MIT
