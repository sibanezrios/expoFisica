# 📚 Implementación de Interfaz Educativa - Levitación Magnética

## ✅ Componentes Implementados

### 1. **MagneticForceExplanationModal** 🎓
Modal educativo que explica por qué la fuerza magnética NO es una simple multiplicación.

**Ubicación:** `/src/components/education/MagneticForceExplanationModal.tsx`

**Props dinámicas:**
- `magnetCount`: Número de imanes por riel
- `magneticForce`: Fuerza nominal por imán (N)
- `actualMagneticForce`: Fuerza real calculada por el motor físico (N)
- `weight`: Peso del vagón (kg × 9.81)
- `railCount`: Número de rieles (2)

**Características:**
- ✅ Calcula valores dinámicamente (no hardcodeados)
- ✅ Muestra comparación teórica vs real
- ✅ Tabla de decaimiento por distancia (F ∝ 1/r³)
- ✅ Balance de fuerzas (levitación sí/no)
- ✅ Explicación visual con barras de progreso
- ✅ Overlay oscuro con animación suave

**Trigger:** Botón info (ℹ️) en el tooltip del control "Fuerza Magnética por Imán"

---

### 2. **EnhancedTooltip** 💡
Tooltip mejorado que acepta valores dinámicos mediante placeholders.

**Ubicación:** `/src/components/education/EnhancedTooltip.tsx`

**Características:**
- ✅ Reemplaza placeholders `{variable}` con valores reales
- ✅ Botón "¿Por qué no es N × M?" que abre el modal
- ✅ Multilinea configurable
- ✅ Animación fade-in suave

**Ejemplo de uso:**
```tsx
<EnhancedTooltip
  text="Actualmente: {magnetCount} imanes × {magneticForce} N = {theoreticalMax} N (teórico). La fuerza REAL es {actualMagneticForce} N debido a la distancia."
  dynamicValues={{
    magnetCount: 10,
    magneticForce: 2.5,
    theoreticalMax: 50,
    actualMagneticForce: 5.89
  }}
  showMoreInfo
  onOpenExplanation={() => setShowModal(true)}
/>
```

---

### 3. **ForceAnalysisPanel** 🔬
Panel de análisis en tiempo real que muestra contribuciones individuales de cada imán.

**Ubicación:** `/src/components/education/ForceAnalysisPanel.tsx`

**Props dinámicas:**
- `magnetContributions`: Array con info de cada imán (distancia, fuerza, %)
- `totalForce`: Fuerza magnética total (N)
- `magnetCount`: Total de imanes (20 para 10×2 rieles)
- `magneticForce`: Fuerza nominal (N)

**Visualiza:**
- ✅ **Estadísticas generales:**
  - Fuerza total actual
  - Eficiencia del sistema (%)
  - Imanes activos (>1% contribución)
  - Distancia promedio a los imanes
  
- ✅ **Top 7 Contribuyentes:**
  - Ranking con medallas
  - Badge de riel (superior/inferior)
  - Distancia, fuerza y % de contribución
  - Barra de progreso visual
  
- ✅ **Insight educativo:**
  - Demuestra que pocos imanes cercanos aportan la mayoría de la fuerza
  - Explica la ley F ∝ 1/r³
  
- ✅ **Distribución de contribuciones:**
  - Grupos: >10%, 5-10%, 1-5%, <1%
  - Código de colores (verde, azul, naranja, gris)

---

### 4. **ForceDistanceGraph** 📈
Gráfico interactivo que visualiza la relación F ∝ 1/r³.

**Ubicación:** `/src/components/education/ForceDistanceGraph.tsx`

**Props dinámicas:**
- `magneticForce`: Fuerza nominal del imán (M)
- `currentDistances`: Array con distancias reales de cada imán al vagón (m)
- `currentForces`: Array con fuerzas individuales calculadas (N)

**Visualiza:**
- ✅ **Curva matemática F = k × M / r³:**
  - Rango: 1cm a 15cm
  - Línea azul continua
  - Ecuación mostrada dinámicamente
  
- ✅ **Puntos de imanes actuales:**
  - Círculos amarillos posicionados según distancia real
  - Líneas punteadas al eje X
  - Refleja configuración actual del usuario
  
- ✅ **Zonas coloreadas:**
  - Verde (1-3cm): Alta fuerza
  - Roja (10-15cm): Fuerza despreciable
  
- ✅ **Estadísticas:**
  - Distancia promedio
  - Fuerza promedio, máxima y mínima
  
- ✅ **Insight educativo:**
  - "Duplicar distancia reduce fuerza a 1/8"
  - Ejemplos concretos (2cm → 4cm = X/8)

---

## 🔧 Integración en App.tsx

### Cálculo de contribuciones:
```typescript
const magnetContributions = useMemo(() => {
  return calculateMagnetContributions(
    variables,
    { x: state.positionX, height: state.levitationHeight },
    80
  );
}, [variables, state.positionX, state.levitationHeight]);
```

### Extracción de datos para gráfico:
```typescript
const magnetDistances = useMemo(() => 
  magnetContributions.map(m => m.distance),
  [magnetContributions]
);

const magnetForces = useMemo(() => 
  magnetContributions.map(m => m.force),
  [magnetContributions]
);
```

### Layout en el render:
```tsx
<main className="app-main">
  <ControlsPanel ... />
  
  <div className="simulation-section">
    <SimulationCanvas ... />
    
    {/* Componentes Educativos */}
    <ForceDistanceGraph
      magneticForce={variables.magneticForce}
      currentDistances={magnetDistances}
      currentForces={magnetForces}
    />
    
    <ForceAnalysisPanel
      magnetContributions={magnetContributions}
      totalForce={state.netForce}
      magnetCount={variables.magnetCount * 2}
      magneticForce={variables.magneticForce}
    />
  </div>
</main>
```

---

## 🚀 Nueva función en physics/engine.ts

### `calculateMagnetContributions()`
Exporta las contribuciones individuales de cada imán para análisis educativo.

**Retorna:**
```typescript
interface MagnetContribution {
  index: number;          // Índice del imán (0-9 para 10 imanes)
  rail: 'superior' | 'inferior';
  distance: number;       // Distancia 3D al vagón (m)
  force: number;          // Fuerza individual (N)
  percentage: number;     // % de contribución al total
  position: number;       // Posición X en el carril (cm)
}
```

**Uso:**
```typescript
const contributions = calculateMagnetContributions(
  variables,
  { x: cartX, height: cartHeight },
  boardWidth
);
```

---

## 📊 Información de Distancias Reales

### Geometría del Sistema:
```
       [Riel Superior: S-N-S-N-S-N-S-N-S-N]
                     ↕ railSeparation
              [Vagón levitando a altura h]
                     ↕ railSeparation
       [Riel Inferior: N-S-N-S-N-S-N-S-N-S]
```

### Cálculo de distancia 3D:
```typescript
function calculateDistanceToCart(
  magnetX: number,        // Posición del imán en el carril
  cartX: number,          // Posición del vagón
  cartHeight: number,     // Altura de levitación
  railSeparation: number, // Separación entre rieles
  isUpperRail: boolean
): number {
  const dx = Math.abs(magnetX - cartX);
  
  const railOffset = railSeparation / 2;
  const dy = isUpperRail 
    ? railOffset - cartHeight 
    : railOffset + cartHeight;
  
  return Math.sqrt(dx * dx + dy * dy);
}
```

### Ejemplo con configuración por defecto:
- **Configuración:** 10 imanes/riel, espaciado 4cm, separación 6cm
- **Vagón:** Posición X=30cm, altura levitación ≈ 2cm
- **Riel superior:** Offset = +3cm del centro
- **Riel inferior:** Offset = -3cm del centro

**Distancias típicas:**
- Imán justo debajo del vagón (mismo X): `distance = √(0² + 5²) = 5 cm`
- Imán a 4cm de distancia horizontal: `distance = √(4² + 5²) = 6.4 cm`
- Imán a 12cm de distancia horizontal: `distance = √(12² + 5²) = 13 cm`

**Contribuciones:**
- A 5cm: `F = 20.5 × 2.5 / 5³ = 0.41 N` (alta)
- A 6.4cm: `F = 20.5 × 2.5 / 6.4³ = 0.196 N` (media)
- A 13cm: `F = 20.5 × 2.5 / 13³ = 0.023 N` (despreciable)

---

## 🎨 Estilos

Todos los componentes tienen archivos CSS dedicados con:
- ✅ Gradientes oscuros (tema consistente)
- ✅ Animaciones suaves
- ✅ Responsive design
- ✅ Código de colores educativo:
  - Azul (#3b82f6): Valores correctos/información
  - Rojo (#ef4444): Valores incorrectos/advertencias
  - Verde (#10b981): Éxito/eficiencia
  - Naranja (#f59e0b): Puntos importantes
  - Morado (#8b5cf6): Insights

---

## ✨ Resumen de Mejoras

### Antes:
- ❌ Tooltip estático con texto genérico
- ❌ No explicaba por qué la fuerza no es N × M
- ❌ Usuario no veía contribuciones individuales
- ❌ Sin visualización de F ∝ 1/r³

### Ahora:
- ✅ Tooltips dinámicos con valores reales del usuario
- ✅ Modal educativo completo con explicación detallada
- ✅ Panel de análisis en tiempo real (top contribuyentes, stats)
- ✅ Gráfico interactivo mostrando curva de decaimiento
- ✅ Todos los valores calculados dinámicamente
- ✅ Distancias reales de imanes mostradas en puntos amarillos
- ✅ Usuario comprende por qué 10 × 2.5 N ≠ 25 N

---

## 🧪 Cómo Probar

1. **Abre la aplicación** (puerto 5173)
2. **Pasa el mouse** sobre el ❓ en "Fuerza Magnética por Imán"
3. **Haz clic** en el botón "¿Por qué no es 10 × 2?"
4. **Observa el modal** con explicación detallada
5. **Baja en la página** para ver el gráfico F vs distancia
6. **Revisa el panel** de análisis con top contribuyentes
7. **Modifica variables** (masa, imanes, distancia) y observa:
   - Los puntos amarillos se mueven en el gráfico
   - Las contribuciones cambian en tiempo real
   - La eficiencia se recalcula
   - Los tooltips muestran valores actualizados

---

## 📝 Notas Técnicas

- **Performance:** Usamos `useMemo` para evitar recálculos innecesarios
- **Actualización:** Componentes responden a cambios en `variables` y `state`
- **Precisión:** Valores calculados por el motor físico real (no aproximaciones)
- **Canvas HTML5:** Gráfico dibujado con canvas nativo (sin librerías externas)
- **Accesibilidad:** Tooltips con `aria-label`, botones con feedback visual

---

## 🎯 Objetivos Cumplidos

1. ✅ Modal con texto dinámico (no "2.5 N" hardcodeado)
2. ✅ Gráfica F ∝ 1/r³ con puntos de imanes reales
3. ✅ Panel de análisis con contribuciones individuales
4. ✅ Tooltips mejorados con callback al modal
5. ✅ Cálculo y exportación de distancias reales
6. ✅ Integración completa en App.tsx
7. ✅ Estilos profesionales y responsivos
8. ✅ Educación efectiva sobre física de dipolos magnéticos

---

**Autor:** Sara Ibáñez • Esteban Fontanilla • Javid Vergel • Heyner Martínez  
**Fecha:** Octubre 2025  
**Tecnología:** React + TypeScript + Canvas API
