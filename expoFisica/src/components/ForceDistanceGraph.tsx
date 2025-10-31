/**
 * Mini-gráfica educativa: Ley del Inverso de la Cuarta Potencia
 * Visualiza cómo la fuerza magnética decrece con la distancia
 * F ∝ 1/r⁴ (interacción dipolo-dipolo axial)
 */

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './ForceDistanceGraph.css';

export const ForceDistanceGraph: React.FC = () => {
  const formulaRef = useRef<HTMLDivElement>(null);

  // Renderizar fórmula con KaTeX
  useEffect(() => {
    if (formulaRef.current) {
      const formula = String.raw`F = \sum_{i=1}^{n} k \frac{M_i}{r_i^4}`;
      katex.render(formula, formulaRef.current, {
        throwOnError: false,
        displayMode: true,
      });
    }
  }, []);

  // Generar puntos para la curva F ∝ 1/r⁴
  const generateCurvePoints = (): string => {
    const points: string[] = [];
    const width = 300;
    const height = 150;
    const padding = 20;
    
    // Rango de distancia: 1 a 10 (unidades arbitrarias)
    const minR = 1;
    const maxR = 10;
    
    // Calcular valores de fuerza
    const forces: number[] = [];
    for (let r = minR; r <= maxR; r += 0.2) {
      const force = 1 / Math.pow(r, 4); // F ∝ 1/r⁴
      forces.push(force);
    }
    
    const maxForce = Math.max(...forces);
    
    // Convertir a coordenadas SVG
    for (let r = minR; r <= maxR; r += 0.2) {
      const force = 1 / Math.pow(r, 4);
      
      // Normalizar y mapear a coordenadas del canvas
      const x = padding + ((r - minR) / (maxR - minR)) * (width - 2 * padding);
      const y = height - padding - (force / maxForce) * (height - 2 * padding);
      
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    
    return points.join(' ');
  };

  return (
    <div className="force-distance-graph">
      <h4>📉 Ley del Inverso de la Cuarta Potencia (F ∝ 1/r⁴)</h4>
      <p className="graph-description">
        La fuerza magnética total es la <strong>suma de las contribuciones individuales de cada imán</strong>.
        En modo físico real, la interacción <strong>dipolo–dipolo</strong> decae con <strong>1/r⁴</strong>.
      </p>
      
      {/* Fórmulas explicativas fuera de la gráfica */}
      <div className="formula-box">
        <div className="formula-main">
          <div ref={formulaRef} className="formula-katex"></div>
        </div>
        <div className="formula-legend">
          <div className="legend-row">
            <strong>F</strong>
            <span>=</span>
            <span>Fuerza magnética total</span>
          </div>
          <div className="legend-row">
            <strong>k</strong>
            <span>=</span>
            <span>Constante magnética (factor de calibración del sistema)</span>
          </div>
          <div className="legend-row">
            <strong>M<sub>i</sub></strong>
            <span>=</span>
            <span>Intensidad o momento magnético de cada imán</span>
          </div>
          <div className="legend-row">
            <strong>r<sub>i</sub></strong>
            <span>=</span>
            <span>Distancia del imán i al vagón</span>
          </div>
          <div className="legend-row">
            <strong>n</strong>
            <span>=</span>
            <span>Número total de imanes</span>
          </div>
        </div>
      </div>
      
      <svg 
        viewBox="0 0 300 150" 
        className="force-graph-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo y cuadrícula */}
        <rect x="0" y="0" width="300" height="150" fill="#0F172A" />
        
        {/* Líneas de cuadrícula sutiles */}
        <g stroke="#334155" strokeWidth="0.5" opacity="0.3">
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`h-${i}`}
              x1="20"
              y1={20 + i * 27.5}
              x2="280"
              y2={20 + i * 27.5}
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={`v-${i}`}
              x1={20 + i * 52}
              y1="20"
              x2={20 + i * 52}
              y2="130"
            />
          ))}
        </g>
        
        {/* Ejes */}
        <g stroke="#64748B" strokeWidth="2">
          {/* Eje Y (Fuerza) */}
          <line x1="20" y1="20" x2="20" y2="130" />
          {/* Eje X (Distancia) */}
          <line x1="20" y1="130" x2="280" y2="130" />
        </g>
        
        {/* Curva F ∝ 1/r⁴ */}
        <polyline
          points={generateCurvePoints()}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Área bajo la curva (sombreado) */}
        <linearGradient id="forceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
        </linearGradient>
        
        <polygon
          points={`20,130 ${generateCurvePoints()} 280,130`}
          fill="url(#forceGradient)"
        />
        
        {/* Etiquetas de ejes */}
        <text
          x="150"
          y="145"
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="11"
          fontFamily="Inter, sans-serif"
        >
          Distancia (r)
        </text>
        
        <text
          x="10"
          y="15"
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="11"
          fontFamily="Inter, sans-serif"
          transform="rotate(-90, 10, 75)"
        >
          Fuerza (F)
        </text>
        
        {/* Fórmula simplificada en la gráfica */}
        <text
          x="220"
          y="40"
          textAnchor="middle"
          fill="#60A5FA"
          fontSize="18"
          fontFamily="'Courier New', monospace"
          fontWeight="bold"
        >
          F ∝ 1/r⁴
        </text>
      </svg>
      
      <div className="graph-legend">
        <div className="legend-item">
          <span className="legend-dot near"></span>
          <span>Imanes cercanos: <strong>Alta contribución</strong></span>
        </div>
        <div className="legend-item">
          <span className="legend-dot far"></span>
          <span>Imanes lejanos: <strong>Baja contribución</strong></span>
        </div>
      </div>
      
      <div className="graph-note" style={{ background: 'rgba(99, 102, 241, 0.1)', borderLeft: '3px solid #6366F1' }}>
        <strong>� Modelo Físico Real:</strong> La interacción dipolo–dipolo en configuración axial 
        sigue la ley 1/r⁴. La constante magnética <code style={{ 
          background: 'rgba(99, 102, 241, 0.2)', 
          padding: '2px 6px', 
          borderRadius: '3px',
          color: '#A5B4FC',
          fontFamily: 'monospace'
        }}>k = (3μ₀)/(4π) ≈ 3×10⁻⁷</code> proviene de las ecuaciones de Maxwell.
      </div>
    </div>
  );
};
