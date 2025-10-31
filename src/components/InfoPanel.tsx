/**
 * Panel de Información Educativa - Modal Deslizante
 */

import { useState, useEffect } from 'react';
import './InfoPanel.css';
import { MagnetVisualization } from './MagnetVisualization';
import { ForceDistanceGraph } from './ForceDistanceGraph';

export const InfoPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Botón flotante para abrir el panel */}
      <button 
        className="info-trigger-btn" 
        onClick={() => setIsOpen(true)}
        title="Ver información del modelo físico"
      >
        <span className="info-icon">ℹ️</span>
        <span className="info-text">Información</span>
      </button>

      {/* Backdrop + Modal Deslizante */}
      {isOpen && (
        <>
          <div 
            className="info-backdrop" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`info-modal ${isOpen ? 'open' : ''}`}>
            <div className="info-modal-header">
              <h2>🔍 Información del Modelo Físico</h2>
              <button 
                className="close-btn" 
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            
            <div className="info-modal-content">
              <section className="info-section">
                <h3>🎯 Objetivo del sistema:</h3>
                <p>
                  Este simulador representa un modelo físico simplificado de levitación magnética 
                  mediante imanes permanentes, inspirado en trenes Maglev. Su propósito es permitir 
                  al usuario explorar cómo ciertas variables físicas influyen en la capacidad del 
                  vagón de levitar y desplazarse de forma estable.
                </p>
              </section>

              <section className="info-section">
                <h3>🧲 Principio de levitación:</h3>
                <p>
                  La levitación se produce por <strong>repulsión magnética</strong> entre polos iguales 
                  (N-N o S-S) ubicados en los rieles y en el vagón. Para que el vagón levite, la fuerza 
                  magnética total efectiva debe superar el peso del vagón (calculado como masa × gravedad).
                </p>
                <ul>
                  <li className="success">✅ Si la fuerza neta es positiva, el vagón se eleva.</li>
                  <li className="error">❌ Si la fuerza neta es negativa o cero, el vagón permanece en el suelo.</li>
                </ul>
              </section>

              <section className="info-section">
                <h3>🔬 Modelo físico: ley del cubo inverso</h3>
                <p>
                  Este simulador implementa un <strong>modelo físico realista</strong> donde cada imán 
                  contribuye individualmente según su distancia al vagón, siguiendo la <strong>ley del 
                  cubo inverso</strong> (F ∝ 1/r^) característica de dipolos magnéticos.
                </p>
                <div className="warning-box">
                  <strong>⚠️ IMPORTANTE:</strong><br />
                  La fuerza total NO es una suma lineal simple. Si tienes 10 imanes de 2.5N cada uno, 
                  la fuerza real NO es 10 × 2.5N = 25N. Los imanes más alejados del vagón contribuyen 
                  mucho menos debido al decaimiento cúbico con la distancia.
                </div>
                
                <ForceDistanceGraph />
              </section>

              <section className="info-section">
                <h3>🔬 Visualización de configuración magnética:</h3>
                <MagnetVisualization />
              </section>

              <section className="info-section">
                <h3>📏 Factor de estabilidad:</h3>
                <p>
                  Este valor representa qué tan simétrico y alineado está el campo magnético entre los 
                  dos rieles. Un 100% indica que los imanes están perfectamente enfrentados, garantizando 
                  equilibrio lateral.
                </p>
                <div className="warning-box">
                  <strong>⚠️ IMPORTANTE:</strong><br />
                  El Factor de Estabilidad ≠ Levitación. Un sistema puede estar perfectamente estable 
                  (100%) pero aún no levitar si la fuerza magnética es insuficiente.
                </div>
              </section>

              <section className="info-section">
                <h3>🧮 Variables que afectan el sistema:</h3>
                <ul className="variables-list">
                  <li><strong>Masa del Vagón</strong> (↑ masa = ↑ peso)</li>
                  <li><strong>Fuerza Magnética por Imán</strong></li>
                  <li><strong>Cantidad y distribución de imanes</strong></li>
                  <li><strong>Separación entre hileras</strong></li>
                  <li><strong>Distancia entre imanes</strong></li>
                  <li><strong>Dirección y velocidad del motor</strong> (solo afecta desplazamiento, no levitación)</li>
                </ul>
              </section>

              <section className="info-section">
                <h3>�� Recomendación:</h3>
                <p>
                  Prueba diferentes combinaciones de masa, fuerza y cantidad de imanes. Observa cómo 
                  se modifican la altura, la fuerza neta y la estabilidad del sistema.
                </p>
              </section>

              <section className="info-section audience">
                <h3>🎓 Público:</h3>
                <p>
                  Este simulador está diseñado para estudiantes de física, ingenieros, docentes y 
                  entusiastas del electromagnetismo.
                </p>
              </section>
            </div>
          </div>
        </>
      )}
    </>
  );
};
