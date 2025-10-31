/**
 * Modal educativo que explica por qué la fuerza magnética total
 * NO es simplemente magnetCount × magneticForce × 2
 * 
 * Usa valores dinámicos de la configuración actual del simulador
 */

import React from 'react';
import './MagneticForceExplanationModal.css';

interface MagneticForceExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Valores actuales del simulador
  magnetCount: number;        // ej: 10
  magneticForce: number;       // ej: 2.5
  actualMagneticForce: number; // ej: 5.89 (calculado con F ∝ 1/r³)
  weight: number;              // ej: 4.91
  railCount: number;           // siempre 2 (superior e inferior)
}

export const MagneticForceExplanationModal: React.FC<MagneticForceExplanationModalProps> = ({
  isOpen,
  onClose,
  magnetCount,
  magneticForce,
  actualMagneticForce,
  weight,
  railCount = 2,
}) => {
  if (!isOpen) return null;

  // Calcular valores dinámicos
  const theoreticalLinearForce = magnetCount * magneticForce * railCount;
  const efficiency = (actualMagneticForce / theoreticalLinearForce) * 100;
  const forceDeficit = theoreticalLinearForce - actualMagneticForce;
  const totalMagnets = magnetCount * railCount;
  const deficitPercentage = (forceDeficit / theoreticalLinearForce) * 100;
  const estimatedActiveMagnets = Math.ceil(totalMagnets * (efficiency / 100) * 1.5);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <h2>💡 Explicación: ¿Por qué no es {theoreticalLinearForce.toFixed(1)} N?</h2>
        
        <div className="explanation-section">
          <h3>🤔 La Pregunta</h3>
          <p>
            Si hay <strong>{magnetCount} imanes</strong> que ejercen <strong>{magneticForce} N</strong> cada uno,
            en <strong>{railCount} rieles</strong>, ¿por qué la fuerza total no es:
          </p>
          <div className="formula-box incorrect">
            <code>{magnetCount} × {magneticForce} × {railCount} = {theoreticalLinearForce.toFixed(1)} N</code>
            <span className="badge error">❌ Incorrecto</span>
          </div>
        </div>

        <div className="explanation-section">
          <h3>🧲 La Respuesta: Física Real</h3>
          <p>Cada imán <strong>NO</strong> aplica la misma fuerza sobre el vagón porque:</p>
          
          <ol className="physics-reasons">
            <li>
              <strong>La fuerza magnética depende de la distancia:</strong>
              <div className="formula-box">
                F ∝ 1/r³ <span className="formula-note">(ley del cubo inverso para dipolos)</span>
              </div>
            </li>
            
            <li>
              <strong>Los imanes cercanos dominan:</strong>
              <table className="decay-table">
                <thead>
                  <tr>
                    <th>Distancia</th>
                    <th>Fuerza</th>
                    <th>% de fuerza a 1cm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1 cm</td>
                    <td>100%</td>
                    <td className="full">████████████</td>
                  </tr>
                  <tr>
                    <td>2 cm</td>
                    <td>12.5%</td>
                    <td className="low">██</td>
                  </tr>
                  <tr>
                    <td>3 cm</td>
                    <td>3.7%</td>
                    <td className="very-low">▌</td>
                  </tr>
                  <tr>
                    <td>5 cm</td>
                    <td>0.8%</td>
                    <td className="negligible">▏</td>
                  </tr>
                </tbody>
              </table>
            </li>
            
            <li>
              <strong>El parámetro "{magneticForce} N" NO es la fuerza total,</strong><br/>
              sino la <em>intensidad base del campo magnético a 1 cm de distancia</em>.
            </li>
          </ol>
        </div>

        <div className="explanation-section highlight">
          <h3>📊 Con Tu Configuración Actual</h3>
          
          <div className="comparison-grid">
            <div className="comparison-item">
              <div className="label">Imanes totales:</div>
              <div className="value">{magnetCount} × {railCount} rieles = <strong>{totalMagnets} imanes</strong></div>
            </div>
            
            <div className="comparison-item">
              <div className="label">Intensidad base:</div>
              <div className="value"><strong>{magneticForce} N</strong> por imán</div>
            </div>
            
            <div className="comparison-item incorrect-bg">
              <div className="label">❌ Suma lineal (incorrecto):</div>
              <div className="value large">{theoreticalLinearForce.toFixed(1)} N</div>
            </div>
            
            <div className="comparison-item correct-bg">
              <div className="label">✅ Física real (F ∝ 1/r³):</div>
              <div className="value large">{actualMagneticForce.toFixed(2)} N</div>
            </div>
            
            <div className="comparison-item">
              <div className="label">Eficiencia del sistema:</div>
              <div className="value">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(efficiency, 100)}%` }}
                  />
                </div>
                <strong>{efficiency.toFixed(1)}%</strong>
              </div>
            </div>
            
            <div className="comparison-item">
              <div className="label">Fuerza "perdida":</div>
              <div className="value">
                {forceDeficit.toFixed(2)} N ({deficitPercentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>

        <div className="explanation-section">
          <h3>🔬 Física Real en Detalle</h3>
          <p>Cada imán calcula su contribución individual:</p>
          
          <div className="formula-box">
            <code>F<sub>imán</sub> = k × ({magneticForce} N / distancia³)</code>
          </div>
          
          <p>
            Donde <strong>"distancia"</strong> es la distancia 3D real desde cada imán
            hasta la posición actual del vagón.
          </p>
          
          <p>
            Luego se suman todas las <strong>{totalMagnets} contribuciones individuales</strong>.
          </p>
        </div>

        <div className="explanation-section insight">
          <h3>💡 ¿Por qué Tanta Diferencia?</h3>
          <p>
            Los <strong>{totalMagnets} imanes</strong> están distribuidos a lo largo del carril.
          </p>
          <p>
            Solo los <strong>~{estimatedActiveMagnets} imanes más cercanos</strong> al vagón contribuyen
            significativamente (~70-80% de la fuerza total).
          </p>
          <p>
            Los otros <strong>{totalMagnets - estimatedActiveMagnets} imanes</strong> apenas aportan 
            debido al <em>decaimiento cúbico</em> (1/r³).
          </p>
        </div>

        <div className="explanation-section">
          <h3>📐 Balance de Fuerzas</h3>
          <table className="balance-table">
            <tbody>
              <tr>
                <td>Fuerza magnética (hacia arriba):</td>
                <td className="value-cell">{actualMagneticForce.toFixed(2)} N ↑</td>
              </tr>
              <tr>
                <td>Peso del vagón (hacia abajo):</td>
                <td className="value-cell">{weight.toFixed(2)} N ↓</td>
              </tr>
              <tr className={actualMagneticForce > weight ? 'success' : 'error'}>
                <td><strong>Resultado:</strong></td>
                <td className="value-cell">
                  {actualMagneticForce > weight ? (
                    <>✅ LEVITA (margen: {((actualMagneticForce - weight) / weight * 100).toFixed(1)}%)</>
                  ) : (
                    <>❌ NO LEVITA (déficit: {((weight - actualMagneticForce) / weight * 100).toFixed(1)}%)</>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="explanation-section summary">
          <h3>✨ Resumen</h3>
          <ul className="summary-list">
            <li>
              ❌ <strong>Incorrecto:</strong> Asumir que todos los imanes ejercen {magneticForce} N
            </li>
            <li>
              ✅ <strong>Correcto:</strong> Cada imán aporta según su distancia (F ∝ 1/r³)
            </li>
            <li>
              🎯 <strong>Resultado:</strong> Solo {efficiency.toFixed(0)}% de eficiencia debido al decaimiento espacial
            </li>
          </ul>
        </div>

        <button className="btn-primary" onClick={onClose}>
          Entendido
        </button>
      </div>
    </div>
  );
};
