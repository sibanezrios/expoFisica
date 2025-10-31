// src/components/education/FormulasPanel.tsx
import React from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import "./FormulasPanel.css";

type FormulaItem = {
  label: string;
  symbol?: string;
  formula: string;
  note?: string;
};

const FORMULAS: FormulaItem[] = [
  {
    label: "Fuerza Magnética Efectiva",
    symbol: "F_{\\text{mag}}(z)",
    formula: String.raw`F_{\\text{mag}}(z) = \sum_{i=1}^{n} k \frac{M_i}{r_i^{4}}`,
    note: String.raw`r_i = \sqrt{\,z^{2} + \left(\frac{d}{2}\right)^{2}\,}`,
  },
  {
    label: "Peso",
    symbol: "W",
    formula: String.raw`W = m\,g`,
    note: String.raw`g = 9.81\,\mathrm{m\,s^{-2}}`,
  },
  {
    label: "Fuerza Neta",
    symbol: "F_{\\text{net}}",
    formula: String.raw`F_{\\text{net}} = F_{\\text{mag}}(z) - W - F_{\\text{perdidas}}`,
    note: String.raw`\text{(sin pérdidas) } F_{\\text{net}} = F_{\\text{mag}}(z) - W`,
  },
  {
    label: "Altura de Equilibrio",
    symbol: "z^{*}",
    formula: String.raw`z^{*} = \left(\frac{\sum k\,M_i}{m\,g}\right)^{1/4}`,
    note: String.raw`\text{(modelo continuo) } z^{*} = \frac{1}{\alpha}\,\ln\!\left(\frac{F_{0}}{m\,g}\right)`,
  },
  { label: "Velocidad Real", symbol: "v", formula: String.raw`v = \frac{\mathrm{d}z}{\mathrm{d}t}` },
  {
    label: "Factor Distancia",
    symbol: "FD",
    formula: String.raw`FD = 100 \cdot \frac{F_{\\text{mag}}(z)}{F_{\\text{mag}}(z_{\\min})}`,
  },
  {
    label: "Factor Estabilidad",
    symbol: "FE",
    formula: String.raw`FE = 100 \cdot \mathrm{clip}\!\left(\frac{\omega_n}{\omega_{\mathrm{ref}}},\,0,\,1\right)`,
    note: String.raw`\omega_n = \sqrt{\frac{k_{\\text{mag}}}{m}},\quad k_{\\text{mag}}(z) = -\frac{\mathrm{d}F_{\\text{mag}}}{\mathrm{d}z}`,
  },
];

export const FormulasPanel: React.FC = () => {
  return (
    <section className="physics-formulas-section">
      <h3 className="formulas-title">📐 Fórmulas del modelo físico</h3>

      <div className="physics-grid">
        {FORMULAS.map(({ label, symbol, formula, note }) => (
          <div className="physics-card" key={label}>
            <div className="physics-card__header">{label}</div>

            {symbol && (
              <div className="math-line math-line--symbol">
                <BlockMath math={symbol} />
              </div>
            )}

            <div className="math-line">
              <BlockMath math={formula} />
            </div>

            {note && (
              <div className="math-line math-line--note">
                <BlockMath math={note} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
