/**
 * Motor de física para la simulación de levitación magnética
 * Sistema lineal con dos hileras de imanes enfrentadas
 * Con interdependencias dinámicas entre variables
 * 
 * ═══════════════════════════════════════════════════════════════════
 * MODELO FÍSICO: INTERACCIÓN DIPOLO-DIPOLO AXIAL
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Para imanes permanentes en configuración axial, la fuerza decrece con
 * la distancia según: F = Σ k·Mᵢ/rᵢ⁴
 * 
 * Donde:
 *   k = 3μ₀/(4π) ≈ 3×10⁻⁷ N·m⁴/A² (constante de Maxwell)
 *   μ₀ = 4π×10⁻⁷ H/m (permeabilidad del vacío)
 *   Mᵢ = momento magnético del imán i
 *   rᵢ = distancia del imán i al vagón
 * 
 * Cada imán contribuye individualmente según su distancia al vagón.
 * NO es una suma lineal simple (10 × 2.5N ≠ 25N real)
 * 
 */

import type { PhysicsVariables, SimulationState } from '../types';
import { MAGNET_PROPERTIES } from '../types';

const GRAVITY = 9.81; // m/s²

// Constante física real del modelo dipolo-dipolo axial
// k = 3μ₀/(4π) donde μ₀ = 4π×10⁻⁷ H/m (permeabilidad del vacío)
const MU_0 = 4 * Math.PI * 1e-7; // 4π×10⁻⁷ H/m
const MAGNETIC_CONSTANT = (3 * MU_0) / (4 * Math.PI); // ≈ 3×10⁻⁷ N·m⁴/A²

// Factor de escala para compatibilidad con valores UI
const SCALING_FACTOR = 1e9;

/**
 * ═══════════════════════════════════════════════════════════════════
 * CÁLCULO INDIVIDUAL DE FUERZA MAGNÉTICA POR IMÁN
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Implementa la LEY DEL CUBO INVERSO para dipolos magnéticos:
 * 
 *    F(r) = k × M / r³
 * 
 * Donde:
 *   - F(r) = Fuerza a distancia r
 *   - k = Constante magnética del sistema
 *   - M = Fuerza magnética nominal del imán
 *   - r = Distancia del imán al vagón
 * 
 * @param magnetStrength - Fuerza nominal del imán en Newtons
 * @param distanceToCart - Distancia del imán al centro del vagón (cm)
 * @returns Fuerza real ejercida por este imán individual
 */
function calculateMagneticForceFromMagnet(
  magnetStrength: number,
  distanceToCart: number
): number {
  // Prevenir división por cero (distancia mínima: 0.5 cm)
  const safeDistance = Math.max(distanceToCart, 0.5);
  
  // Aplicar factor de escala para compatibilidad con valores UI
  const adjustedStrength = magnetStrength * SCALING_FACTOR;
  
  // Ley dipolo-dipolo axial: F = k·M/r⁴
  const force = (MAGNETIC_CONSTANT * adjustedStrength) / Math.pow(safeDistance, 4);
  
  return force;
}

/**
 * ═══════════════════════════════════════════════════════════════════
 * CÁLCULO DE FUERZA MAGNÉTICA TOTAL (SUMA DE TODOS LOS IMANES)
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Calcula la contribución de TODOS los imanes del sistema considerando:
 * 1. Posición del vagón (asumida en el centro del sistema)
 * 2. Distancia de cada imán al vagón
 * 3. Dos hileras de imanes (superior e inferior)
 * 
 * La fuerza total NO es una suma lineal simple, sino la suma de
 * contribuciones individuales que decaen con 1/r³
 * 
 * @param variables - Variables físicas del sistema
 * @param cartPosition - Posición X del vagón en cm (para cálculo preciso)
 * @returns Fuerza magnética total en Newtons
 */
function calculateTotalMagneticForce(
  variables: PhysicsVariables,
  cartPositionX: number = 40 // Posición por defecto: centro del sistema (80cm/2)
): number {
  const { magnetType, magnetCount, magnetDistance, railSeparation } = variables;
  // Determinar fuerza magnética nominal por imán según tipo
  const magneticForce = MAGNET_PROPERTIES[magnetType]?.forceRange?.default ?? 2.5;

  let totalForce = 0;
  for (let i = 0; i < magnetCount; i++) {
    const magnetPositionX = i * magnetDistance;
    const horizontalDistance = Math.abs(magnetPositionX - cartPositionX);
    const verticalDistance = railSeparation / 2;
    const distance3D = Math.sqrt(
      Math.pow(horizontalDistance, 2) +
      Math.pow(verticalDistance, 2)
    );
    const forceFromThisMagnet = calculateMagneticForceFromMagnet(
      magneticForce,
      distance3D
    );
    totalForce += forceFromThisMagnet * 2;
  }
  return totalForce;
}

/**
 * Calcula el factor de estabilidad según la separación entre hileras
 * Mayor separación = menor estabilidad = menor altura efectiva
 */
function calculateStabilityFactor(railSeparation: number): number {
  // Separación óptima: 6 cm
  const optimalSeparation = 6;
  const separationRatio = optimalSeparation / railSeparation;
  
  // Factor entre 0.5 y 1.0
  return Math.max(0.5, Math.min(1.0, separationRatio));
}

/**
 * Calcula la altura de levitación basada en la fuerza magnética vs peso
 * En el sistema lineal, hay dos hileras de imanes (superior e inferior)
 * que generan repulsión vertical
 * 
 * INTERDEPENDENCIAS:
 * - Cada imán contribuye según su distancia 3D al vagón (ley 1/r³)
 * - Separación entre hileras afecta la estabilidad
 */
function calculateLevitationHeight(variables: PhysicsVariables): number {
  const { trainMass, railSeparation } = variables;
  
  // Calcular fuerza magnética total usando el modelo correcto
  const totalMagneticForce = calculateTotalMagneticForce(variables);
  
  // Peso del vagón
  const weight = trainMass * GRAVITY;
  
  // Fuerza neta vertical
  const netForce = totalMagneticForce - weight;
  
  // Solo levita si la fuerza magnética supera el peso
  if (netForce <= 0) {
    return 0; // Sin levitación, pegado al suelo
  }
  
  // Factor de estabilidad según separación entre hileras
  const stabilityFactor = calculateStabilityFactor(railSeparation);
  
  // Altura proporcional a la fuerza neta disponible
  // Máximo: la mitad de la separación entre rieles para seguridad
  const heightFactor = netForce / weight;
  const maxHeight = (railSeparation / 2.5) * stabilityFactor;
  const calculatedHeight = ((heightFactor * railSeparation) / 3) * stabilityFactor;
  
  return Math.min(calculatedHeight, maxHeight);
}

/**
 * Calcula la fuerza neta resultante sobre el vagón
 * INTERDEPENDENCIAS:
 * - Afectada por la posición de TODOS los imanes (ley 1/r³)
 * - Depende directamente de masa (peso)
 */
export function calculateNetForce(variables: PhysicsVariables): number {
  const { trainMass } = variables;
  
  // Calcular fuerza magnética total usando el modelo correcto
  const totalMagneticForce = calculateTotalMagneticForce(variables);
  
  const weight = trainMass * GRAVITY;
  
  // Fuerza neta = Fuerza magnética - Peso
  return totalMagneticForce - weight;
}

/**
 * Determina si el vagón puede levitar
 */
function isLevitating(variables: PhysicsVariables): boolean {
  return calculateNetForce(variables) > 0;
}

/**
 * Calcula el factor de carga según la masa y la fuerza disponible
 * Mayor masa = mayor carga = menor eficiencia
 */
function calculateLoadFactor(variables: PhysicsVariables): number {
  const netForce = calculateNetForce(variables);
  const weight = variables.trainMass * GRAVITY;
  
  if (netForce <= 0) return 0;
  
  // Factor entre 0.3 y 1.0 según qué tan cerca estemos del límite
  const forceRatio = netForce / weight;
  return Math.min(1.0, Math.max(0.3, forceRatio));
}

/**
 * Calcula la velocidad real del vagón basada en física (F = m·a)
 * INTERDEPENDENCIAS:
 * - Si no levita → velocidad = 0 (independiente de motorSpeed)
 * - Si levita → velocidad depende de:
 *   * Masa (más masa = menos velocidad)
 *   * Fuerza neta (más fuerza = más velocidad)
 *   * Separación entre hileras (afecta estabilidad)
 *   * Distancia entre imanes (afecta fuerza efectiva)
 */
function calculateActualSpeed(variables: PhysicsVariables): number {
  const { trainMass, magnetType, railSeparation } = variables;
  // Si no hay levitación, no hay movimiento
  if (!isLevitating(variables)) {
    return 0;
  }
  const netForce = calculateNetForce(variables);
  const acceleration = netForce / trainMass;
  const accelerationFactor = Math.min(acceleration / GRAVITY, 3); // Max 3x
  const stabilityFactor = calculateStabilityFactor(railSeparation);
  const loadFactor = calculateLoadFactor(variables);
  // Calcular motorSpeed automáticamente según tipo de imán (igual que antes)
  const baseSpeed = 15;
  const magnetStrengthRatio = (MAGNET_PROPERTIES[magnetType]?.forceRange?.default ?? 2.5) / MAGNET_PROPERTIES['neodymium'].forceRange.default;
  const autoMotorSpeed = baseSpeed + (magnetStrengthRatio * 10);
  return autoMotorSpeed * accelerationFactor * stabilityFactor * loadFactor;
}

/**
 * Calcula la velocidad del vagón basada en la velocidad del motor y dirección
 */
export function calculateTrainVelocity(variables: PhysicsVariables): number {
  const { motorDirection } = variables;
  const actualSpeed = calculateActualSpeed(variables);
  return actualSpeed * motorDirection;
}

/**
 * Actualiza el estado de la simulación basado en las variables físicas
 * Sistema lineal: el vagón se mueve horizontalmente de izquierda a derecha
 * 
 * MOVIMIENTO INFINITO: El vagón permanece en el centro y el fondo se mueve
 */
export function updateSimulation(
  variables: PhysicsVariables
): SimulationState {
  // Calcular nueva altura de levitación
  const levitationHeight = calculateLevitationHeight(variables);
  
  // Calcular fuerza neta
  const netForce = calculateNetForce(variables);
  
  // Determinar si está levitando
  const isLevitatingNow = isLevitating(variables);
  
  // Calcular velocidad real (dependiente de física)
  const actualSpeed = calculateActualSpeed(variables);
  
  // Calcular velocidad con dirección
  const velocity = calculateTrainVelocity(variables);
  
  // Posición fija del vagón (centro-derecha de la pantalla para efecto infinito)
  const fixedPositionX = 30; // El vagón se mantiene aquí visualmente
  const centerY = 15; // Centro vertical del tablero
  
  // El desplazamiento acumulado se usa para mover el fondo
  // (se manejará en SimulationCanvas)
  
  return {
    levitationHeight,
    positionX: fixedPositionX,
    positionY: centerY,
    velocity,
    platformAngle: 0, // No hay plataforma giratoria en sistema lineal
    netForce,
    isLevitating: isLevitatingNow,
    actualSpeed,
  };
}

/**
 * Inicializa el estado de la simulación (sistema lineal)
 */
export function initializeSimulation(variables: PhysicsVariables): SimulationState {
  return {
    levitationHeight: calculateLevitationHeight(variables),
    positionX: 30, // posición fija (centro-derecha)
    positionY: 15, // centro vertical del tablero
    velocity: 0,
    platformAngle: 0, // No usado en sistema lineal
    netForce: calculateNetForce(variables),
    isLevitating: isLevitating(variables),
    actualSpeed: 0,
  };
}
