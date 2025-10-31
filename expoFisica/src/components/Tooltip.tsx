/**
 * Componente Tooltip reutilizable con animación suave
 */

import React, { useState } from 'react';
import './Tooltip.css';

interface TooltipProps {
  text: string;
  children?: React.ReactNode;
  multiline?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children, multiline = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="tooltip-wrapper">
      <span
        className="tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        role="button"
        aria-label="Mostrar información"
      >
        {children || '❓'}
      </span>
      {isVisible && (
        <div className={`tooltip-content ${multiline ? 'multiline' : ''}`}>
          {text}
        </div>
      )}
    </div>
  );
};
