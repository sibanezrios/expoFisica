/**
 * Panel de Análisis de Fuerza Magnética
 * Muestra el desglose en tiempo real de las contribuciones individuales de cada imán
 */

import React from 'react';
import './ForceAnalysisPanel.css';

interface MagnetContribution {
  index: number;
  rail: 'superior' | 'inferior';
  distance: number;
  force: number;
  percentage: number;
}

interface ForceAnalysisPanelProps {
  magnetContributions: MagnetContribution[];
  totalForce: number;
  magnetCount: number;
  magneticForce: number;
  onMagnetClick?: (index: number) => void; // Callback cuando se hace clic en un imán
}

export const ForceAnalysisPanel: React.FC<ForceAnalysisPanelProps> = ({
  magnetContributions,
  totalForce,
  magnetCount,
  magneticForce,
  onMagnetClick
}) => {
  // Ordenar por contribución (mayor a menor)
  const sortedContributions = [...magnetContributions]
    .sort((a, b) => b.force - a.force);

  // Top 7 contribuyentes
  const topContributors = sortedContributions.slice(0, 7);

  // Contar imanes "activos" (>1% contribución)
  const activeMagnets = magnetContributions.filter(m => m.percentage > 1).length;

  // Calcular eficiencia
  const theoreticalMax = magnetCount * magneticForce;
  const efficiency = (totalForce / theoreticalMax) * 100;

  // Distancia promedio
  const avgDistance = magnetContributions.reduce((sum, m) => sum + m.distance, 0) / magnetContributions.length;

  return (
    <div className="force-analysis-panel">
      <h3>🔬 Análisis de Fuerza en Tiempo Real</h3>
      
      {/* Estadísticas Generales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Fuerza Total</div>
          <div className="stat-value primary">{totalForce.toFixed(2)} N</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Eficiencia</div>
          <div className="stat-value">{efficiency.toFixed(1)}%</div>
          <div className="efficiency-bar">
            <div className="efficiency-fill" style={{ width: `${Math.min(efficiency, 100)}%` }}></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Imanes Activos</div>
          <div className="stat-value">{activeMagnets} de {magnetCount}</div>
          <div className="stat-note">(&gt;1% contribución)</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Distancia Promedio</div>
          <div className="stat-value">{(avgDistance * 100).toFixed(1)} cm</div>
        </div>
      </div>

      {/* Top Contribuyentes */}
      <div className="contributors-section">
        <h4>⭐ Top Contribuyentes (haz clic para ubicar en gráfica)</h4>
        <div className="contributors-list">
          {topContributors.map((contributor, rank) => {
            // Calcular el índice global del imán en el array de contributions
            const globalIndex = magnetContributions.findIndex(
              m => m.index === contributor.index && m.rail === contributor.rail
            );
            
            return (
              <div 
                key={`${contributor.rail}-${contributor.index}-${rank}`} 
                className="contributor-item clickable"
                onClick={() => onMagnetClick && onMagnetClick(globalIndex)}
                title="Haz clic para ver en la gráfica"
              >
                <div className="contributor-header">
                  <span className="rank">#{rank + 1}</span>
                  <span className="rail-badge" data-rail={contributor.rail}>
                    {contributor.rail === 'superior' ? 'Riel Superior' : 'Riel Inferior'}
                  </span>
                  <span className="magnet-id">Imán #{contributor.index + 1}</span>
                </div>

              <div className="contributor-details">
                <div className="detail-row">
                  <span className="detail-label">Distancia:</span>
                  <span className="detail-value">{(contributor.distance * 100).toFixed(2)} cm</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Fuerza:</span>
                  <span className="detail-value highlight">{contributor.force.toFixed(3)} N</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Contribución:</span>
                  <span className="detail-value">{contributor.percentage.toFixed(1)}%</span>
                </div>
              </div>

              <div className="contribution-bar">
                <div 
                  className="contribution-fill" 
                  style={{ width: `${contributor.percentage}%` }}
                ></div>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Insight: Decay Effect */}
      <div className="insight-box">
        <div className="insight-icon">💡</div>
        <div className="insight-content">
          <div className="insight-title">Efecto de Decaimiento por Distancia</div>
          <div className="insight-text">
            Los imanes más cercanos (distancia &lt; {(avgDistance * 100).toFixed(0)} cm) 
            aportan <strong>{topContributors.slice(0, 3).reduce((sum, m) => sum + m.percentage, 0).toFixed(1)}%</strong> de 
            la fuerza total, aunque solo sean 3 de {magnetCount} imanes. 
            Esto demuestra la ley de <strong>F ∝ 1/r³</strong>.
          </div>
        </div>
      </div>

      {/* Distribución Visual */}
      <div className="distribution-section">
        <h4>📊 Distribución de Contribuciones</h4>
        <div className="distribution-bars">
          {[
            { range: '>10%', color: '#10b981', count: magnetContributions.filter(m => m.percentage > 10).length },
            { range: '5-10%', color: '#3b82f6', count: magnetContributions.filter(m => m.percentage >= 5 && m.percentage <= 10).length },
            { range: '1-5%', color: '#f59e0b', count: magnetContributions.filter(m => m.percentage >= 1 && m.percentage < 5).length },
            { range: '<1%', color: '#64748b', count: magnetContributions.filter(m => m.percentage < 1).length }
          ].map(group => (
            <div key={group.range} className="distribution-bar">
              <div className="distribution-label">{group.range}</div>
              <div className="distribution-visual">
                <div 
                  className="distribution-fill" 
                  style={{ 
                    width: `${(group.count / magnetCount) * 100}%`,
                    backgroundColor: group.color 
                  }}
                ></div>
              </div>
              <div className="distribution-count">{group.count} imanes</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
