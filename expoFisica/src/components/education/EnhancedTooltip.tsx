/**
 * Tooltip Mejorado con Valores Dinámicos y Enlace al Modal
 * Reemplaza texto estático con valores calculados del sistema actual
 */

import React, { useState } from 'react';
import './EnhancedTooltip.css';

interface EnhancedTooltipProps {
  /** Texto base del tooltip (puede incluir {placeholders}) */
  text: string;
  /** Valores dinámicos para reemplazar en el texto */
  dynamicValues?: Record<string, string | number>;
  /** Función callback para abrir el modal de explicación */
  onOpenExplanation?: () => void;
  /** Contenido visual del trigger (por defecto: ❓) */
  children?: React.ReactNode;
  /** Si el tooltip debe mostrar múltiples líneas */
  multiline?: boolean;
  /** Mostrar botón de "más información" */
  showMoreInfo?: boolean;
}

export const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  text,
  dynamicValues = {},
  onOpenExplanation,
  children,
  multiline = false,
  showMoreInfo = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Reemplazar placeholders en el texto con valores dinámicos
  const processedText = text.replace(/\{(\w+)\}/g, (match, key) => {
    if (key in dynamicValues) {
      const value = dynamicValues[key];
      return typeof value === 'number' ? value.toFixed(2) : String(value);
    }
    return match;
  });

  return (
    <div className="enhanced-tooltip-wrapper">
      <span
        className="enhanced-tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        role="button"
        aria-label="Mostrar información"
      >
        {children || '❓'}
      </span>
      
      {isVisible && (
        <div className={`enhanced-tooltip-content ${multiline ? 'multiline' : ''}`}>
          <div className="tooltip-text">
            {processedText}
          </div>
          
          {showMoreInfo && onOpenExplanation && (
            <button
              className="tooltip-learn-more"
              onClick={(e) => {
                e.stopPropagation();
                onOpenExplanation();
                setIsVisible(false);
              }}
            >
              <span className="info-icon">ℹ️</span>
              <span>¿Por qué no es {dynamicValues.magnetCount || 'N'} × {dynamicValues.magneticForce || 'M'}?</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
