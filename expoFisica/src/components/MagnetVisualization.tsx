/**
 * Visualización educativa de imanes con geometría horizontal
 * Cada imán es un rectángulo horizontal con N y S lado a lado
 */

import React from 'react';
import './MagnetVisualization.css';

export const MagnetVisualization: React.FC = () => {
  // Configuración de imanes
  const magnetWidth = 60; // ancho total del imán
  const magnetHeight = 20; // alto del imán
  const magnetSpacing = 5; // espacio entre imanes
  const magnetCount = 20; // número de imanes por fila
  const rowSeparation = 40; // separación vertical entre filas

  // Generar imanes para la fila superior: Patrón alternante N-S-N-S...
  const renderUpperRow = () => {
    return Array.from({ length: magnetCount }).map((_, index) => {
      const x = index * (magnetWidth + magnetSpacing);
      const y = 0;
      const isNorth = index % 2 === 0; // Alterna: par=Norte, impar=Sur

      return (
        <div
          key={`upper-${index}`}
          className="magnet-container"
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${magnetWidth}px`,
            height: `${magnetHeight}px`,
          }}
        >
          {/* Imán completo: SOLO Norte O SOLO Sur */}
          <div className={`magnet-full ${isNorth ? 'north-pole' : 'south-pole'}`}>
            <span className="pole-label">{isNorth ? 'N' : 'S'}</span>
          </div>
        </div>
      );
    });
  };

  // Generar imanes para la fila inferior: Patrón alternante S-N-S-N... (inverso)
  const renderLowerRow = () => {
    return Array.from({ length: magnetCount }).map((_, index) => {
      const x = index * (magnetWidth + magnetSpacing);
      const y = magnetHeight + rowSeparation;
      const isNorth = index % 2 === 1; // Alterna INVERSO: impar=Norte, par=Sur

      return (
        <div
          key={`lower-${index}`}
          className="magnet-container"
          style={{
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${magnetWidth}px`,
            height: `${magnetHeight}px`,
          }}
        >
          {/* Imán completo: SOLO Norte O SOLO Sur */}
          <div className={`magnet-full ${isNorth ? 'north-pole' : 'south-pole'}`}>
            <span className="pole-label">{isNorth ? 'N' : 'S'}</span>
          </div>
        </div>
      );
    });
  };

  // Generar flechas de interacción
  const renderInteractionArrows = () => {
    const arrows = [];
    const arrowY = magnetHeight + rowSeparation / 2;

    for (let i = 0; i < magnetCount; i++) {
      const x = i * (magnetWidth + magnetSpacing);
      const upperIsNorth = i % 2 === 0;
      const lowerIsNorth = i % 2 === 1;
      
      // Si son polos opuestos → ATRACCIÓN
      // Si son polos iguales → REPULSIÓN
      const isAttraction = upperIsNorth !== lowerIsNorth;
      
      arrows.push(
        <div
          key={`arrow-${i}`}
          className={`interaction-arrow ${isAttraction ? 'attraction' : 'repulsion'}`}
          style={{
            position: 'absolute',
            left: `${x + magnetWidth / 2}px`,
            top: `${arrowY}px`,
          }}
        >
          <div className={`arrow-line ${isAttraction ? '' : 'repulsion-line'}`}></div>
          <div className="arrow-label">{isAttraction ? '↕️' : '⚡'}</div>
        </div>
      );
    }

    return arrows;
  };

  const containerHeight = magnetHeight * 2 + rowSeparation + 60;
  const containerWidth = magnetCount * (magnetWidth + magnetSpacing);

  return (
    <div className="magnet-visualization-wrapper">
      <h2 className="visualization-title">
        Visualización de Configuración Magnética
      </h2>
      
      <div className="visualization-description">
        <p>
          <strong>Fila Superior:</strong> Patrón alternante N-S-N-S-N-S... 
          (cada imán es COMPLETO: solo Norte o solo Sur)
        </p>
        <p>
          <strong>Fila Inferior:</strong> Patrón alternante INVERSO S-N-S-N-S-N... 
          (cada imán es COMPLETO: solo Sur o solo Norte)
        </p>
        <p className="interaction-legend">
          <span className="legend-item">↕️ = Atracción (N↔S, polos opuestos)</span>
          <span className="legend-item">⚡ = Repulsión (N↔N o S↔S, polos iguales)</span>
        </p>
      </div>

      <div
        className="magnet-visualization-container"
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          position: 'relative',
        }}
      >
        {renderUpperRow()}
        {renderLowerRow()}
        {renderInteractionArrows()}
      </div>

      <div className="visualization-notes">
        <h3>Notas Técnicas:</h3>
        <ul>
          <li>✓ Cada imán es un rectángulo horizontal (60px × 20px) COMPLETO</li>
          <li>✓ Cada imán es SOLO Norte (azul) O SOLO Sur (rojo), no ambos</li>
          <li>✓ Patrón alternante: N-S-N-S en fila superior, S-N-S-N en fila inferior</li>
          <li>✓ Polos opuestos enfrentados generan ATRACCIÓN (↕️)</li>
          <li>✓ Polos iguales enfrentados generan REPULSIÓN (⚡)</li>
        </ul>
      </div>
    </div>
  );
};
