/**
 * Tipos de datos para la simulación de levitación magnética
 */

// Tipos de imanes disponibles
export type MagnetType = 'neodymium' | 'ferrite' | 'alnico' | 'samarium-cobalt';

export interface PhysicsVariables {
  // Masa del vagón en kilogramos
  trainMass: number;
  
  // Distancia entre imanes en centímetros
  magnetDistance: number;
  
  // (Eliminado) Fuerza magnética estimada por imán en Newtons
  
  // Tipo de imán usado
  magnetType: MagnetType;
  
  // Cantidad de imanes por carril
  magnetCount: number;
  
  // Separación entre hileras de imanes (altura del canal) en centímetros
  railSeparation: number;
  
  // (Eliminado) Velocidad del motor en cm/s
  
  // Dirección del motor (1 = adelante, -1 = atrás)
  motorDirection: 1 | -1;
}

export interface SimulationState {
  // Altura de levitación del vagón en centímetros
  levitationHeight: number;
  
  // Posición X del vagón en centímetros
  positionX: number;
  
  // Posición Y del vagón en centímetros
  positionY: number;
  
  // Velocidad del vagón en cm/s
  velocity: number;
  
  // Ángulo actual de la plataforma en grados
  platformAngle: number;
  
  // Fuerza neta resultante en Newtons
  netForce: number;
  
  // Estado de levitación
  isLevitating: boolean;
  
  // Velocidad real calculada basada en física
  actualSpeed: number;
}

export interface BoardDimensions {
  width: number;  // cm
  height: number; // cm
}

export const DEFAULT_VARIABLES: PhysicsVariables = {
  trainMass: 0.5,           // 500 gramos
  magnetDistance: 4,        // 4 cm entre imanes
  magnetType: 'neodymium',  // Neodimio por defecto
  magnetCount: 10,          // 10 imanes por carril
  railSeparation: 6,        // 6 cm entre hileras
  motorDirection: 1,        // adelante
};

// Propiedades de diferentes tipos de imanes
export const MAGNET_PROPERTIES = {
  neodymium: {
    name: 'Neodimio (NdFeB)',
    description: 'Imán más fuerte disponible comercialmente',
    forceRange: { min: 1.5, max: 10.0, default: 2.5 },
    color: '#E5E7EB',
  },
  ferrite: {
    name: 'Ferrita (Cerámica)',
    description: 'Económico pero menos potente',
    forceRange: { min: 0.3, max: 2.0, default: 0.8 },
    color: '#52525B',
  },
  alnico: {
    name: 'AlNiCo',
    description: 'Alta temperatura, fuerza media',
    forceRange: { min: 0.5, max: 3.5, default: 1.2 },
    color: '#B45309',
  },
  'samarium-cobalt': {
    name: 'Samario-Cobalto (SmCo)',
    description: 'Muy fuerte y resistente al calor',
    forceRange: { min: 1.2, max: 8.0, default: 2.0 },
    color: '#7C3AED',
  },
};

export const BOARD_SIZE: BoardDimensions = {
  width: 80,   // 80 cm (más ancho para aprovechar el espacio)
  height: 30,  // 30 cm
};
