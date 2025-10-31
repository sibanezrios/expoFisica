/**
 * Aplicación principal de simulación de levitación magnética
 */

import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { InfoPanel } from './components/InfoPanel';
import type { PhysicsVariables, SimulationState } from './types';
import { DEFAULT_VARIABLES } from './types';
import { updateSimulation, initializeSimulation } from './physics/engine';
import './App.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [variables, setVariables] = useState<PhysicsVariables>(DEFAULT_VARIABLES);
  const [state, setState] = useState<SimulationState>(() => 
    initializeSimulation(DEFAULT_VARIABLES)
  );

  // Actualizar simulación cada frame
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setState(updateSimulation(variables));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [variables]);

  const handleVariablesChange = (newVariables: PhysicsVariables) => {
    setVariables(newVariables);
  };

  const handleReset = () => {
    setVariables(DEFAULT_VARIABLES);
    setState(initializeSimulation(DEFAULT_VARIABLES));
  };

  // Mostrar welcome screen si showWelcome es true
  if (showWelcome) {
    return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚄 Simulación de levitación magnética</h1>
        <p>Sistema de vagón con imanes permanentes</p>
      </header>

      <main className="app-main">
        <ControlsPanel
          variables={variables}
          onVariablesChange={handleVariablesChange}
          onReset={handleReset}
        />

        <SimulationCanvas variables={variables} state={state} />
      </main>

      <InfoPanel />

      <footer className="app-footer">
        <p className="powered-by">
          Powered by: Esteban Fontanilla • Javid Vergel • Sara Ibáñez • Heyner Martínez
        </p>
      </footer>
    </div>
  );
}

export default App;
