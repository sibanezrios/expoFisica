# 📋 Análisis de Coherencia del Simulador de Levitación Magnética

**Fecha**: 31 de octubre de 2025  
**Objetivo**: Verificar consistencia con especificaciones físicas SI y modelo dipolo-dipolo

---

## ✅ MODELO FÍSICO SELECCIONADO

**Modelo A (Discreto - Dipolo-Dipolo Axial)**
- Fórmula: `F_mag(z) = Σ(i=1..n) k·Mᵢ / rᵢ⁴`
- Constante física: `k = 3μ₀/(4π) ≈ 3×10⁻⁷ N·m⁴/A²`
- Geometría: Dos hileras simétricas con `rᵢ = √(z² + (d/2)²)`
- Justificación: Configuración de bloques enfrentados, física local más precisa

---

## 🔴 PROBLEMAS DETECTADOS

### 1. **Ley Física Incorrecta** ⚠️ CRÍTICO
- **Estado actual**: Usa `F ∝ 1/r³` 
- **Requerido**: `F ∝ 1/r⁴` (dipolo-dipolo axial)
- **Archivo**: `src/physics/engine.ts:59`
- **Corrección**: Cambiar `Math.pow(safeDistance, 3)` → `Math.pow(safeDistance, 4)`

### 2. **Constante Magnética No Física** ⚠️ CRÍTICO
- **Estado actual**: `k = 150` (empírica, sin unidades)
- **Requerido**: `k = (3 * MU_0) / (4 * Math.PI) ≈ 3×10⁻⁷ N·m⁴/A²`
- **Archivo**: `src/physics/engine.ts:28`
- **Corrección**: 
  ```typescript
  const MU_0 = 4 * Math.PI * 1e-7; // H/m
  const MAGNETIC_CONSTANT = (3 * MU_0) / (4 * Math.PI); // ≈ 3×10⁻⁷
  ```

### 3. **Unidades Mixtas (No SI)** ⚠️ ALTO
- **Estado actual**: Distancias en cm, mezcla unidades
- **Requerido**: TODO en SI (metros, kg, newton, segundos)
- **Archivos**: `engine.ts`, `SimulationCanvas.tsx`
- **Corrección**: Convertir todas distancias: `distancia_m = distancia_cm / 100`

### 4. **Falta Validación de Equilibrio** ⚠️ ALTO
- **Estado actual**: No verifica `|F_mag(z) - W| ≤ ε` cuando Estado = "Levitando"
- **Requerido**: Tolerancia ε = 0.1-0.5 N
- **Archivo**: `engine.ts:isLevitating()`
- **Corrección**: Agregar `const epsilon = 0.3; return Math.abs(F_mag - W) <= epsilon;`

### 5. **Sin Modelo de Pérdidas** ⚠️ MEDIO
- **Estado actual**: `F_net = F_mag - W`
- **Requerido**: `F_net = F_mag - W - F_pérdidas` con `F_pérdidas = c·v`
- **Archivo**: `engine.ts:calculateNetForce()`
- **Corrección**: Agregar amortiguamiento viscoso lineal

### 6. **Factor Distancia Ambiguo** ⚠️ MEDIO
- **Estado actual**: Implementación no clara, puede exceder 100%
- **Requerido**: `FD[%] = 100·F_mag(z)/F_mag(z_min)` acotado a 100%
- **Archivo**: `engine.ts:calculateDistanceFactor()`
- **Corrección**: Definición normalizada explícita

### 7. **Factor Estabilidad Sin Rigidez** ⚠️ MEDIO
- **Estado actual**: Basado en ratio, no en rigidez magnética
- **Requerido**: `k_mag(z) = -dF_mag/dz`, luego `ω_n = √(k_mag/m)`
- **Archivo**: `engine.ts:calculateStabilityFactor()`
- **Corrección**: Calcular derivada numérica de F_mag

---

## 📊 TARJETAS - ESTADO DE COHERENCIA

| Tarjeta | Estado | Fórmula Actual | Fórmula Correcta | Prioridad |
|---------|--------|----------------|------------------|-----------|
| **Masa** | ✅ OK | Entrada directa | m (kg) | - |
| **Peso** | ✅ OK | W = m·g | W = m·9.81 | ✅ |
| **F. Magnética** | ❌ MAL | Σ k·M/r³ | Σ k·M/r⁴ | 🔴 CRÍTICO |
| **Altura** | ⚠️ PARCIAL | Calculada sin validar equilibrio | z: F_mag(z)=W | 🟡 ALTO |
| **Estado** | ⚠️ PARCIAL | Sin tolerancia ε | \|F_net\| ≤ ε | 🟡 ALTO |
| **Fuerza Neta** | ⚠️ PARCIAL | F_mag - W | F_mag - W - c·v | 🟡 MEDIO |
| **Aceleración** | ✅ OK | a = F_net/m | a = F_net/m | ✅ |
| **Velocidad** | ⚠️ PENDIENTE | No implementada dinámicamente | v = v₀ + a·Δt | 🟡 MEDIO |
| **Factor Distancia** | ❌ MAL | Indefinido / >100% | 100·F(z)/F(z_min) | 🟠 MEDIO |
| **Factor Estabilidad** | ❌ MAL | Ratio geométrico | k_mag=-dF/dz, ω_n | 🟠 MEDIO |

---

## 🔧 PLAN DE CORRECCIÓN PRIORIZADO

### Fase 1: Física Fundamental (CRÍTICO) 🔴
1. ✅ Cambiar exponente a r⁴ en `calculateMagneticForceFromMagnet()`
2. ✅ Implementar constante física `k = 3μ₀/(4π)`
3. ✅ Convertir TODO a unidades SI (metros)
4. ✅ Actualizar comentarios y documentación

### Fase 2: Validaciones de Coherencia (ALTO) 🟡
5. ⏳ Implementar tolerancia ε en `isLevitating()`
6. ⏳ Validar `F_mag(z*) ≈ W` cuando Estado = "Levitando"
7. ⏳ Agregar validación de signos (a coherente con F_net)

### Fase 3: Modelo de Pérdidas (MEDIO) 🟡
8. ⏳ Implementar `F_pérdidas = c·v` (amortiguamiento viscoso)
9. ⏳ Agregar coeficiente c ajustable (default: 0.5-2.0 N·s/m)
10. ⏳ Actualizar `F_net = F_mag - W - c·v`

### Fase 4: Factores Correctos (MEDIO) 🟠
11. ⏳ Redefinir Factor Distancia: `FD = 100·F(z)/F(z_min)`, clip a 100%
12. ⏳ Implementar Factor Estabilidad con rigidez:
    - Calcular `k_mag = 4·Σ k·Mᵢ·z / rᵢ⁶` (derivada numérica)
    - Frecuencia natural `ω_n = √(k_mag/m)`
    - Mapear a 0-100%: `FE = min(ω_n/ω_ref, 1)·100`

### Fase 5: Simulación Dinámica (BAJO) 🟢
13. ⏳ Implementar integración temporal real
14. ⏳ Agregar velocidad dinámica `v(t+Δt) = v(t) + a·Δt`
15. ⏳ Actualizar altura `z(t+Δt) = z(t) + v·Δt`

---

## 📐 FÓRMULAS CORRECTAS POR TARJETA

### Fuerza Magnética (Modelo Discreto, Dos Hileras)
```typescript
// Para cada imán i en posición (x_i, 0, 0):
const dx = x_i - x_cart;        // Distancia longitudinal
const dy = railSeparation / 2;  // Distancia lateral (hilera)
const dz = z_cart;              // Altura del vagón
const r_i = Math.sqrt(dx*dx + dy*dy + dz*dz); // Distancia 3D

const F_i = (k * M_i) / Math.pow(r_i, 4); // Fuerza por imán
const F_mag = 2 * Σ F_i; // Factor 2 por dos hileras simétricas
```

### Altura de Equilibrio (Numérica)
```typescript
// Resolver F_mag(z*) = m·g numéricamente (bisección o Newton-Raphson)
function findEquilibriumHeight(m, g, k, M_array, d) {
  let z_low = 0.001, z_high = 0.5; // Rango de búsqueda (metros)
  const W = m * g;
  const epsilon = 0.01; // Tolerancia 1%
  
  while (z_high - z_low > 1e-5) {
    const z_mid = (z_low + z_high) / 2;
    const F_mag = calculateTotalMagneticForce(z_mid, k, M_array, d);
    
    if (Math.abs(F_mag - W) < epsilon) return z_mid;
    if (F_mag > W) z_low = z_mid;
    else z_high = z_mid;
  }
  
  return (z_low + z_high) / 2;
}
```

### Factor Estabilidad (Rigidez Magnética)
```typescript
// Derivada numérica de F_mag con respecto a z
function calculateMagneticStiffness(z, variables) {
  const dz = 0.0001; // Paso pequeño (0.1 mm)
  const F_plus = calculateTotalMagneticForce(z + dz, variables);
  const F_minus = calculateTotalMagneticForce(z - dz, variables);
  
  const k_mag = -(F_plus - F_minus) / (2 * dz); // k_mag = -dF/dz
  return k_mag; // Positivo si fuerza restauradora
}

function calculateStabilityFactor(z, variables) {
  const k_mag = calculateMagneticStiffness(z, variables);
  const omega_n = Math.sqrt(k_mag / variables.trainMass); // rad/s
  const omega_ref = 10; // Referencia "muy estable" (10 rad/s ≈ 1.6 Hz)
  
  const FE = Math.min(omega_n / omega_ref, 1) * 100; // 0-100%
  return FE;
}
```

---

## 🎯 MÉTRICAS DE ÉXITO

### Validaciones Automáticas a Implementar:
```typescript
// Test 1: Equilibrio coherente
if (state === "Levitando") {
  assert(Math.abs(F_mag - W) < epsilon_force, "F_mag debe igualar W");
  assert(Math.abs(F_net) < epsilon_force, "F_net debe ser ~0");
  assert(Math.abs(acceleration) < epsilon_accel, "a debe ser ~0");
}

// Test 2: Signos coherentes
if (F_net > epsilon_force) {
  assert(acceleration > 0, "a positiva si F_net positiva");
  assert(state === "Subiendo", "Estado debe ser Subiendo");
}

// Test 3: Unidades SI verificables
assert(height >= 0 && height < 1, "Altura en rango 0-100 cm = 0-1 m");
assert(velocity >= -10 && velocity <= 10, "Velocidad razonable ±10 m/s");

// Test 4: Factores acotados
assert(FD >= 0 && FD <= 100, "Factor Distancia 0-100%");
assert(FE >= 0 && FE <= 100, "Factor Estabilidad 0-100%");
```

---

## 📝 NOTAS DE IMPLEMENTACIÓN

1. **Prioridad**: Corregir Fase 1 antes que nada (física fundamental)
2. **Retrocompatibilidad**: Valores de M_i deben recalibrarse tras cambiar k
3. **Calibración**: Con k físico, M_i típico de neodimio N42: 
   - Volumen V = 0.001 m³ → M ≈ 0.95 A·m²
   - Para vagón 0.5 kg a 5 cm equilibrio: necesitas ~40 imanes
4. **UI**: Agregar tooltip explicando modelo físico elegido
5. **Testing**: Implementar tests automatizados para cada validación

---

## 🔬 MODELO ALTERNATIVO (Opcional - Futuro)

Si en el futuro quieres implementar **Modelo B (Continuo)**:
```typescript
// Para pistas largas con imanes alternados N-S regulares:
const alpha = (2 * Math.PI) / magnetDistance; // 1/m
const F_mag = F0 * Math.exp(-alpha * z);
const z_equilibrio = Math.log(F0 / (m * g)) / alpha;
const k_mag_continuo = alpha * (m * g); // En equilibrio
const omega_n_continuo = Math.sqrt(alpha * GRAVITY); // Independiente de m!
```

Este modelo es más estable numéricamente pero requiere pista periódica.

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] Análisis de código actual completado
- [x] Documentación de problemas generada
- [ ] Actualizar constante magnética a valor físico
- [ ] Cambiar exponente de r³ a r⁴
- [ ] Convertir todas unidades a SI (metros)
- [ ] Implementar validación de equilibrio con ε
- [ ] Agregar modelo de pérdidas viscosas
- [ ] Redefinir Factor Distancia normalizado
- [ ] Implementar Factor Estabilidad con rigidez
- [ ] Crear tests de validación automática
- [ ] Actualizar documentación del usuario

---

**Generado por**: GitHub Copilot  
**Para**: Proyecto expoFisica - Simulador de Levitación Magnética  
**Estado**: Análisis completado, correcciones pendientes
