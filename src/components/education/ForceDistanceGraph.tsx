/**
 * Gráfico de Fuerza Magnética vs Distancia - GUÍA VISUAL EDUCATIVA
 */
import React, { useRef, useEffect } from 'react';
import './ForceDistanceGraph.css';

interface ForceDistanceGraphProps {
  magneticForce: number;
  magnetCount: number;
}

export const ForceDistanceGraph: React.FC<ForceDistanceGraphProps> = ({ magneticForce, magnetCount }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 900, height = 500, padding = 70;
    const graphWidth = width - 2 * padding, graphHeight = height - 2 * padding;
    
    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#1e293b');
    bg.addColorStop(1, '#0f172a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const minDistance = 0.01, maxDistance = 0.15, maxForce = 100, k = 20.5;
    const distanceToX = (d: number) => padding + ((d - minDistance) / (maxDistance - minDistance)) * graphWidth;
    const forceToY = (f: number) => height - padding - (f / maxForce) * graphHeight;

    // Grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = forceToY((maxForce / 5) * i);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    [1, 3, 5, 7, 9, 11, 13, 15].forEach(d => {
      const x = distanceToX(d / 100);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    });

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.stroke();

    // X Label
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(width / 2 - 120, height - 30, 240, 28, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#93c5fd';
    ctx.fillText('Distancia al carrito (cm)', width / 2, height - 8);

    // Y Label
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-115, -14, 230, 28, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#34d399';
    ctx.fillText('Fuerza magnética (N)', 0, 5);
    ctx.restore();

    // X Ticks
    ctx.font = 'bold 13px Inter';
    ctx.textAlign = 'center';
    [1, 3, 5, 7, 9, 11, 13, 15].forEach(d => {
      const x = distanceToX(d / 100);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, height - padding);
      ctx.lineTo(x, height - padding + 8);
      ctx.stroke();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.fillRect(x - 12, height - padding + 10, 24, 18);
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(String(d), x, height - padding + 23);
    });

    // Y Ticks
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const force = (maxForce / 5) * i;
      const y = forceToY(force);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding - 8, y);
      ctx.lineTo(padding, y);
      ctx.stroke();
      const val = force.toFixed(0);
      const tw = ctx.measureText(val).width;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(padding - tw - 20, y - 10, tw + 12, 20);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px Inter';
      ctx.fillText(val, padding - 10, y + 5);
    }

    // Zones
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.fillRect(distanceToX(0.01), padding, distanceToX(0.03) - distanceToX(0.01), graphHeight);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
    ctx.fillRect(distanceToX(0.03), padding, distanceToX(0.07) - distanceToX(0.03), graphHeight);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
    ctx.fillRect(distanceToX(0.07), padding, distanceToX(0.09) - distanceToX(0.07), graphHeight);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.fillRect(distanceToX(0.09), padding, distanceToX(0.15) - distanceToX(0.09), graphHeight);

    // Zone Labels
    ctx.font = 'bold 11px Inter';
    ctx.textAlign = 'center';
    [[0.01, 0.03, '⚠️ Demasiado\ncerca', '#ef4444', 84], [0.03, 0.07, '✅ ZONA ÓPTIMA', '#10b981', 104], [0.07, 0.09, '⚡ Límite', '#f59e0b', 76], [0.09, 0.15, '❌ No levita', '#ef4444', 130]].forEach(([d1, d2, text, color, w]) => {
      const x = (distanceToX(d1 as number) + distanceToX(d2 as number)) / 2;
      ctx.fillStyle = `${color}66`;
      ctx.fillRect(x - (w as number) / 2, padding + 5, w as number, 20);
      ctx.fillStyle = color as string;
      ctx.fillText(text as string, x, padding + 18);
    });

    // Curve
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 4;
    ctx.shadowColor = 'rgba(96, 165, 250, 0.5)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i <= 200; i++) {
      const dist = minDistance + (i / 200) * (maxDistance - minDistance);
      const force = (k * magneticForce) / Math.pow(dist, 3);
      if (force <= maxForce) {
        const x = distanceToX(dist), y = forceToY(force);
        if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
      } else if (started) { ctx.lineTo(distanceToX(dist), padding); break; }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Formula
    const lx = padding + 20, ly = padding + 50;
    ctx.font = 'bold 16px Inter';
    const parts = [`F = ${k.toFixed(1)}`, ` × ${magneticForce.toFixed(2)}`, ' / r'];
    const widths = parts.map(p => ctx.measureText(p).width);
    ctx.font = 'bold 12px Inter';
    widths.push(ctx.measureText('3').width);
    const lw = widths.reduce((a, b) => a + b, 30);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(lx - 10, ly - 24, lw, 38, 8);
    ctx.fill();
    ctx.stroke();
    ctx.textAlign = 'left';
    let cx = lx;
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 16px Inter';
    parts.forEach((p, i) => { ctx.fillText(p, cx, ly); cx += widths[i]; });
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 12px Inter';
    ctx.fillText('3', cx, ly - 6);

    // Legend
    const plx = padding + 20, ply = padding + 95;
    const plt = `🟡 Imanes actuales (${magnetCount})`;
    ctx.font = 'bold 15px Inter';
    const plw = ctx.measureText(plt).width + 20;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(plx - 10, ply - 20, plw, 30, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(plt, plx, ply);
  }, [magneticForce, magnetCount]);

  return (
    <div className="force-distance-graph">
      <h3>📈 Relación Fuerza-Distancia (F ∝ 1/r³)</h3>
      <div className="graph-container">
        <canvas ref={canvasRef} width={900} height={500} className="graph-canvas" />
      </div>
      <div className="graph-insight">
        <div className="insight-icon">🎯</div>
        <div className="insight-text">
          <strong>Guía visual educativa:</strong> Esta gráfica muestra cómo la fuerza magnética 
          disminuye rápidamente con la distancia según la ley del cubo inverso. 
          <strong> Duplicar la distancia reduce la fuerza a 1/8</strong> (2³ = 8). 
          La zona óptima de levitación está entre <strong>3-7 cm</strong>.
        </div>
      </div>
    </div>
  );
};
