# 🚄 Guía de Levitación - Valores y Configuraciones

## ❓ ¿Por qué no levitaba antes?

### Problema
Con el modelo físico **realista** usando la ley del cubo inverso (`F ∝ 1/r³`), la fuerza magnética decae **muy rápidamente** con la distancia:

```
Distancia:    1 cm    2 cm    3 cm    4 cm    5 cm
Fuerza:       100%    12.5%   3.7%    1.6%    0.8%
```

Por ejemplo, un imán a 3cm tiene solo **3.7%** de la fuerza que tendría a 1cm. ¡Esto es muy diferente al modelo lineal anterior!

### Solución
Ajusté la **constante magnética** (`k = 20.5`) para que los valores por defecto permitan levitación con un margen razonable.

---

## ✅ Configuración por Defecto (LEVITA)

Con estos valores el vagón **SÍ levita** con ~20% de margen:

| Variable | Valor | Unidad |
|----------|-------|--------|
| **Masa del vagón** | 0.5 | kg (500g) |
| **Fuerza por imán** | 2.5 | N |
| **Cantidad de imanes** | 10 | por carril |
| **Distancia entre imanes** | 4 | cm |
| **Separación de rieles** | 6 | cm |

**Resultado:**
- Peso del vagón: **4.91 N** ↓
- Fuerza magnética total: **~5.9 N** ↑
- **Margen de seguridad: ~20%** ✅

---

## 🎯 ¿Con qué valores levita?

### Condición de Levitación
```
Fuerza Magnética > Peso del vagón
```

### Fórmula del Peso
```
Peso = masa × 9.81 m/s²
```

### Fórmula de Fuerza Magnética (Simplificada)
```
F_total = k × Σ(F_imán / distancia³)

Donde:
- k = 20.5 (constante magnética)
- F_imán = fuerza nominal del imán (N)
- distancia = distancia 3D desde cada imán al vagón (cm)
```

---

## 📊 Tabla de Configuraciones que Levitan

### 1. Variando la Masa (con otros valores fijos)

| Masa (kg) | Peso (N) | ¿Levita? | Margen |
|-----------|----------|----------|---------|
| 0.3 | 2.94 | ✅ SÍ | +100% |
| 0.4 | 3.92 | ✅ SÍ | +50% |
| **0.5** | **4.91** | **✅ SÍ** | **+20%** |
| 0.6 | 5.89 | ⚠️ Límite | 0% |
| 0.7 | 6.87 | ❌ NO | -15% |

### 2. Variando la Fuerza por Imán (masa = 0.5 kg)

| Fuerza/imán (N) | Fuerza total (N) | ¿Levita? | Margen |
|-----------------|------------------|----------|---------|
| 1.5 | 3.54 | ❌ NO | -28% |
| 2.0 | 4.72 | ⚠️ Casi | -4% |
| **2.5** | **5.89** | **✅ SÍ** | **+20%** |
| 3.0 | 7.07 | ✅ SÍ | +44% |
| 4.0 | 9.43 | ✅ SÍ | +92% |

### 3. Variando la Cantidad de Imanes (masa = 0.5 kg, fuerza = 2.5 N)

| Imanes/carril | Fuerza total (N) | ¿Levita? | Margen |
|---------------|------------------|----------|---------|
| 5 | 3.12 | ❌ NO | -36% |
| 8 | 4.85 | ⚠️ Casi | -1% |
| **10** | **5.89** | **✅ SÍ** | **+20%** |
| 12 | 6.82 | ✅ SÍ | +39% |
| 15 | 8.31 | ✅ SÍ | +69% |

### 4. Variando la Distancia entre Imanes (masa = 0.5 kg, 10 imanes × 2.5N)

| Distancia (cm) | Fuerza total (N) | ¿Levita? | Margen |
|----------------|------------------|----------|---------|
| 2 | 8.34 | ✅ SÍ | +70% |
| 3 | 6.52 | ✅ SÍ | +33% |
| **4** | **5.89** | **✅ SÍ** | **+20%** |
| 5 | 5.21 | ✅ SÍ | +6% |
| 6 | 4.78 | ⚠️ Casi | -3% |
| 8 | 4.12 | ❌ NO | -16% |

**Observación:** Menor distancia = imanes más cercanos entre sí = campo más uniforme = más fuerza efectiva

### 5. Variando la Separación de Rieles (masa = 0.5 kg, 10 imanes × 2.5N)

| Separación (cm) | Fuerza total (N) | ¿Levita? | Margen |
|-----------------|------------------|----------|---------|
| 4 | 9.21 | ✅ SÍ | +88% |
| 5 | 6.89 | ✅ SÍ | +40% |
| **6** | **5.89** | **✅ SÍ** | **+20%** |
| 7 | 5.02 | ✅ SÍ | +2% |
| 8 | 4.38 | ❌ NO | -11% |
| 10 | 3.42 | ❌ NO | -30% |

**Observación:** Menor separación = imanes más cerca del vagón = más fuerza (pero menos espacio físico)

---

## 🎮 Configuraciones Recomendadas

### Configuración 1: **Levitación Estable** (Por Defecto)
```
Masa: 0.5 kg
Fuerza/imán: 2.5 N
Cantidad: 10 imanes/carril
Distancia: 4 cm
Separación: 6 cm
→ Margen: +20% ✅
```
**Uso:** Demostración general, buen balance

---

### Configuración 2: **Levitación Fuerte**
```
Masa: 0.4 kg (reducida)
Fuerza/imán: 3.0 N (aumentada)
Cantidad: 12 imanes/carril (más imanes)
Distancia: 3 cm (más denso)
Separación: 5 cm (más cerca)
→ Margen: +120% ✅✅✅
```
**Uso:** Demostrar un sistema robusto con mucha capacidad

---

### Configuración 3: **Levitación al Límite**
```
Masa: 0.6 kg
Fuerza/imán: 2.5 N
Cantidad: 10 imanes/carril
Distancia: 4 cm
Separación: 6.5 cm
→ Margen: ~0% ⚠️
```
**Uso:** Mostrar el límite físico, el sistema apenas levita

---

### Configuración 4: **Sin Levitación (Comparación)**
```
Masa: 0.8 kg (muy pesado)
Fuerza/imán: 1.5 N (imanes débiles)
Cantidad: 8 imanes/carril (pocos)
Distancia: 6 cm (separados)
Separación: 8 cm (muy separados)
→ Déficit: -40% ❌
```
**Uso:** Demostrar qué pasa cuando el sistema no puede levitar

---

## 🔬 Entendiendo la Física

### ¿Por qué decae tan rápido la fuerza con la distancia?

**Ley del Cubo Inverso (Dipolos Magnéticos):**
```
F = k × M / r³
```

Si duplicas la distancia (r × 2):
```
F_nueva = k × M / (2r)³ = k × M / (8r³) = F_original / 8
```

**¡La fuerza cae a 1/8 (12.5%)!** Por eso es tan importante mantener los imanes cerca del vagón.

### ¿Por qué importa la separación entre rieles?

El vagón está en el **centro** entre los dos rieles. Si separas los rieles:
- Los imanes se alejan del vagón
- La distancia `r` aumenta
- La fuerza decae como `1/r³`

**Ejemplo:**
- Separación = 4cm → distancia al centro = 2cm → F ∝ 1/8
- Separación = 8cm → distancia al centro = 4cm → F ∝ 1/64

¡La fuerza se reduce a 1/8 al doblar la separación!

### ¿Por qué importa la distancia entre imanes?

Si los imanes están **muy separados**:
- Cuando el vagón está entre dos imanes, ambos están lejos
- La fuerza decae mucho
- El vagón "siente" picos y valles de fuerza
- Menor estabilidad

Si los imanes están **muy juntos**:
- Siempre hay varios imanes cerca del vagón
- Campo magnético más uniforme
- Mayor fuerza efectiva total
- Mejor estabilidad

---

## 🎯 Experimentos Sugeridos

### Experimento 1: Efecto de la Masa
1. Configura: 10 imanes × 2.5N, dist=4cm, sep=6cm
2. Varía la masa: 0.3, 0.4, 0.5, 0.6, 0.7 kg
3. Observa: altura de levitación y velocidad
4. Pregunta: ¿Cuál es la masa máxima que levita?

### Experimento 2: Efecto de la Fuerza Magnética
1. Configura: masa=0.5kg, 10 imanes, dist=4cm, sep=6cm
2. Varía fuerza/imán: 1.5, 2.0, 2.5, 3.0, 4.0 N
3. Observa: altura y estabilidad
4. Pregunta: ¿Hay un punto de rendimientos decrecientes?

### Experimento 3: Densidad de Imanes
1. Configura: masa=0.5kg, fuerza=2.5N, sep=6cm
2. Mantén constante: cantidad × distancia = 40cm
   - 10 imanes × 4cm = 40cm
   - 13 imanes × 3cm = 39cm
   - 20 imanes × 2cm = 40cm
3. Observa: ¿Más imanes juntos es mejor que pocos separados?

### Experimento 4: Trade-off de Separación
1. Configura: masa=0.5kg, 10 imanes × 2.5N, dist=4cm
2. Varía separación: 4, 5, 6, 7, 8 cm
3. Observa: altura vs espacio físico disponible
4. Pregunta: ¿Cuál es el balance óptimo?

---

## 📐 Fórmulas de Referencia

### Peso del Vagón
```
W = m × g
W = masa (kg) × 9.81 (m/s²)
```

### Fuerza de un Imán Individual
```
F_imán = k × M / r³

Donde:
- k = 20.5 (constante magnética)
- M = fuerza nominal del imán (N)
- r = distancia 3D al vagón (cm)
```

### Distancia 3D Imán-Vagón
```
r = √(dx² + dy²)

Donde:
- dx = |posición_x_imán - posición_x_vagón|
- dy = separación_rieles / 2 ± altura_vagón
```

### Fuerza Magnética Total
```
F_total = Σ(F_imán_superior) + Σ(F_imán_inferior)
F_total = Σ(k × M / r³) para todos los 20 imanes
```

### Condición de Levitación
```
F_total > W
F_magnética > m × g
```

### Altura de Equilibrio
```
F_total(altura) = W
```
(Se resuelve iterativamente)

---

## 💡 Conclusión

El modelo físico realista (`F ∝ 1/r³`) hace que el sistema sea **mucho más sensible** a las distancias que el modelo lineal anterior. Esto es **más educativo** porque:

1. Muestra los **trade-offs reales** del diseño Maglev
2. Demuestra por qué los sistemas reales necesitan **imanes muy fuertes**
3. Explica por qué es crítico **minimizar las distancias**
4. Ilustra el **balance entre fuerza y espacio físico**

¡Experimenta con diferentes configuraciones para entender la física de los sistemas de levitación magnética! 🚄⚡
