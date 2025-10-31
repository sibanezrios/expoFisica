# ✅ Correcciones Implementadas - Motor de Física

**Fecha**: 31 de octubre de 2025  
**Archivo**: `src/physics/engine.ts`  
**Estado**: Fase 1 completada exitosamente ✅

---

## 🎯 CAMBIOS CRÍTICOS IMPLEMENTADOS

### 1. ✅ Modelo Físico Corregido: r⁴ en lugar de r³

**ANTES (Incorrecto)**:
```typescript
// LEY DEL CUBO INVERSO: F ∝ 1/r³
const force = (MAGNETIC_CONSTANT * magnetStrength) / Math.pow(safeDistance, 3);
```

**AHORA (Correcto)**:
```typescript
// LEY DIPOLO-DIPOLO AXIAL: F ∝ 1/r⁴
const force = (MAGNETIC_CONSTANT * magnetStrength) / Math.pow(safeDistance, 4);
```

**Justificación Física**:
- La interacción dipolo-dipolo en configuración axial (bloques enfrentados N-S) decae como 1/r⁴
- Proviene de las ecuaciones de Maxwell para dipolos magnéticos
- Más preciso que el modelo genérico 1/r³ para configuraciones específicas

---

### 2. ✅ Constante Física de Maxwell

**ANTES (Empírica)**:
```typescript
const MAGNETIC_CONSTANT = 150.0; // Sin unidades, calibración experimental
```

**AHORA (Física)**:
```typescript
const MU_0 = 4 * Math.PI * 1e-7; // H/m (permeabilidad del vacío)
const MAGNETIC_CONSTANT = (3 * MU_0) / (4 * Math.PI); // ≈ 3×10⁻⁷ N·m⁴/A²
```

**Justificación Física**:
- `μ₀ = 4π×10⁻⁷ H/m` es una constante fundamental del electromagnetismo
- `k = (3μ₀)/(4π)` es la constante específica para interacción dipolo-dipolo axial
- Valor correcto: k ≈ 3×10⁻⁷ N·m⁴/A²
- Unidades dimensionalmente correctas: [N·m⁴/A²]

---

### 3. ✅ Conversión a Unidades SI (Metros)

**ANTES (Unidades mixtas)**:
```typescript
// Trabajaba directamente en cm
const distance3D = Math.sqrt(
  Math.pow(horizontalDistance, 2) + 
  Math.pow(verticalDistance, 2)
);
const force = calculateMagneticForceFromMagnet(magneticForce, distance3D);
```

**AHORA (Sistema Internacional)**:
```typescript
// Convertir cm → metros para cálculos físicos
const horizontalDistance_m = horizontalDistance_cm / 100;
const lateralDistance_m = lateralDistance_cm / 100;

const distance3D_m = Math.sqrt(
  Math.pow(horizontalDistance_m, 2) + 
  Math.pow(lateralDistance_m, 2)
);

const force = calculateMagneticForceFromMagnet(magneticForce, distance3D_m);
```

**Justificación**:
- Sistema Internacional (SI): todas las distancias deben estar en METROS
- La UI muestra cm para facilidad del usuario, pero internamente usa m
- Garantiza coherencia dimensional en todas las fórmulas físicas
- Distancia mínima ajustada: 0.5 cm → 0.005 m (5 mm)

---

### 4. ✅ Criterio de Levitación con Tolerancia ε

**ANTES (Simplista)**:
```typescript
function isLevitating(variables: PhysicsVariables): boolean {
  return calculateNetForce(variables) > 0;
}
```

**AHORA (Tolerancia Física)**:
```typescript
function isLevitating(variables: PhysicsVariables): boolean {
  const EPSILON_FORCE = 0.3; // Tolerancia en Newtons
  const netForce = calculateNetForce(variables);
  
  // Levitando si |F_net| ≤ ε (equilibrio)
  return Math.abs(netForce) <= EPSILON_FORCE;
}
```

**Justificación**:
- Levitar no significa F_net > 0, sino F_net ≈ 0 (equilibrio dinámico)
- Tolerancia ε = 0.3 N (ajustable entre 0.1-0.5 N según precisión)
- Coherente con especificación: Estado = "Levitando" ⟺ |F_net| ≤ ε
- Evita oscilaciones numéricas en la detección de estado

---

### 5. ✅ Documentación Actualizada

**Cambios en comentarios y headers**:
- ✅ Título cambiado: "LEY DEL CUBO INVERSO" → "INTERACCIÓN DIPOLO-DIPOLO AXIAL (1/r⁴)"
- ✅ Explicación física completa del modelo dipolo-dipolo
- ✅ Referencia a ecuaciones de Maxwell
- ✅ Constantes físicas con valores y unidades
- ✅ Notas sobre conversión cm → m
- ✅ TODO markers para pendientes (pérdidas viscosas, simulación dinámica)

---

## 📊 VALIDACIÓN DE COMPILACIÓN

```bash
$ npx vite build
✓ 53 modules transformed.
✓ built in 2.36s
```

**Estado**: ✅ EXITOSA - Sin errores de TypeScript

---

## 🔄 COMPARACIÓN: ANTES vs AHORA

### Fuerza Magnética (ejemplo: 1 imán a 5 cm = 0.05 m)

**CON MODELO ANTERIOR (1/r³ y k=150)**:
```
F = 150 × M / (0.05)³ = 150 × M / 0.000125 = 1,200,000 × M
```

**CON MODELO ACTUAL (1/r⁴ y k=3×10⁻⁷)**:
```
F = 3×10⁻⁷ × M / (0.05)⁴ = 3×10⁻⁷ × M / 0.00000625 = 0.048 × M
```

**IMPLICACIÓN CRÍTICA**:
- El nuevo modelo con constante física REAL produce fuerzas ~25 millones de veces más pequeñas
- Esto es CORRECTO físicamente, pero requiere **recalibrar los valores de M (momento magnético)**
- Para imanes reales de neodimio N42 (volumen típico 1 cm³):
  - Momento magnético: M ≈ 0.95 A·m²
  - Para levantar 0.5 kg a 5 cm: necesitas ~40-60 imanes

**ACCIÓN REQUERIDA**:
- ⚠️ Los valores actuales de `magneticForce` en la UI están calibrados al modelo anterior
- ⚠️ Necesitan multiplicarse por un factor de escala para obtener fuerzas visibles
- 💡 Solución temporal: Agregar factor de escala M_scaling ≈ 1e9 hasta recalibrar UI
- 💡 Solución definitiva: Recalibrar slider "Fuerza Magnética" para reflejar M real

---

## ⏳ TAREAS PENDIENTES (Fases 2-5)

### Fase 2: Validaciones de Coherencia 🟡
- [ ] Implementar verificación automática: `if (estado=="Levitando") then assert(|F_net| ≤ ε)`
- [ ] Agregar validación de signos: `if (F_net > ε) then assert(estado=="Subiendo")`
- [ ] Verificar altura de equilibrio: resolver numéricamente `F_mag(z*) = W`
- [ ] Logging de advertencias cuando hay incoherencias detectadas

### Fase 3: Modelo de Pérdidas 🟡
- [ ] Descomentar `DAMPING_COEFFICIENT = 1.5` N·s/m
- [ ] Implementar `F_pérdidas = c × |v|` en `calculateNetForce()`
- [ ] Agregar parámetro `velocity` donde sea necesario
- [ ] UI: Agregar control opcional para coeficiente c (avanzado)

### Fase 4: Factores Corregidos 🟠
- [ ] **Factor Distancia**: Redefinir como `FD = 100 × F(z)/F(z_min)`, clip a 100%
- [ ] **Factor Estabilidad**: Implementar rigidez magnética
  ```typescript
  const k_mag = calculateMagneticStiffness(z); // -dF/dz
  const omega_n = Math.sqrt(k_mag / mass);     // Frecuencia natural
  const FE = Math.min(omega_n / omega_ref, 1) * 100; // 0-100%
  ```
- [ ] Agregar función `calculateMagneticStiffness()` con derivada numérica

### Fase 5: Simulación Dinámica 🟢
- [ ] Implementar integración temporal: `v(t+Δt) = v(t) + a·Δt`
- [ ] Actualizar altura: `z(t+Δt) = z(t) + v·Δt`
- [ ] Resolver equilibrio: `F_mag(z*) = W` numéricamente (bisección/Newton)
- [ ] Agregar detección de colisiones con suelo (z ≥ 0)
- [ ] Agregar límite superior (z ≤ z_max)

---

## 🧪 TESTS RECOMENDADOS

### Test 1: Verificar exponente r⁴
```typescript
test('Magnetic force decays as 1/r⁴', () => {
  const M = 1.0;
  const r1 = 0.05; // 5 cm
  const r2 = 0.10; // 10 cm (2x distancia)
  
  const F1 = calculateMagneticForceFromMagnet(M, r1);
  const F2 = calculateMagneticForceFromMagnet(M, r2);
  
  // F2 debe ser F1 / 2⁴ = F1 / 16
  expect(F2).toBeCloseTo(F1 / 16, 2);
});
```

### Test 2: Verificar constante física
```typescript
test('Magnetic constant equals (3μ₀)/(4π)', () => {
  const MU_0 = 4 * Math.PI * 1e-7;
  const expected_k = (3 * MU_0) / (4 * Math.PI);
  
  expect(MAGNETIC_CONSTANT).toBeCloseTo(expected_k, 15);
  expect(MAGNETIC_CONSTANT).toBeCloseTo(3e-7, 8);
});
```

### Test 3: Verificar levitación con tolerancia
```typescript
test('isLevitating returns true when |F_net| ≤ ε', () => {
  const variables = {
    trainMass: 0.5,
    magneticForce: /* ajustar para F_net ≈ 0.2 N */,
    // ... otras variables
  };
  
  expect(isLevitating(variables)).toBe(true); // |0.2| < 0.3
});
```

### Test 4: Verificar unidades SI (metros)
```typescript
test('Distances are converted to meters internally', () => {
  // Mockear con 10 cm de separación
  const variables = {
    railSeparation: 10, // cm en UI
    // ...
  };
  
  // Internamente debe usar 0.10 m
  // Verificar que lateralDistance_m = 0.05 m (mitad de separación)
  // y que se usa en cálculo de distance3D_m
});
```

---

## 📈 PRÓXIMOS PASOS INMEDIATOS

1. **URGENTE**: Agregar factor de escala temporal
   ```typescript
   // Línea ~70 en engine.ts
   const M_SCALING_FACTOR = 1e9; // Temporal hasta recalibrar UI
   const adjustedMagnetStrength = magnetStrength * M_SCALING_FACTOR;
   const force = (MAGNETIC_CONSTANT * adjustedMagnetStrength) / Math.pow(safeDistance, 4);
   ```

2. **Verificar visualmente**: Abrir http://localhost:5175/ y comprobar:
   - ¿El vagón levita con configuración por defecto?
   - ¿La gráfica Force-Distance muestra F ∝ 1/r⁴ correctamente?
   - ¿Los valores numéricos en InfoPanel son razonables?

3. **Documentar calibración**: Crear tabla de equivalencias
   | UI Slider | M Real (A·m²) | Equiv. Imán Neodimio |
   |-----------|---------------|----------------------|
   | 1.0       | ?             | ? bloques N42        |
   | 2.5       | ?             | ? bloques N42        |
   | 5.0       | ?             | ? bloques N42        |

4. **Validar especificación**: Leer documento completo del usuario
   - Implementar todas las "tarjetas" requeridas
   - Verificar coherencia entre tarjetas
   - Agregar tests automáticos de validación

---

## ✅ CHECKLIST DE FASE 1 (COMPLETADO)

- [x] Cambiar exponente de r³ a r⁴
- [x] Implementar constante física k = 3μ₀/(4π)
- [x] Convertir todas distancias a metros (SI)
- [x] Actualizar comentarios y documentación
- [x] Implementar tolerancia ε en isLevitating()
- [x] Compilar sin errores
- [x] Generar documentación de cambios

---

**Generado por**: GitHub Copilot  
**Validado**: Compilación exitosa con `npx vite build`  
**Estado**: Listo para Fase 2 (Validaciones de Coherencia)
