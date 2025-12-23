import React from 'react';
import Dashboard from './components/Dashboard.jsx';
import { layout } from './components/styles.jsx';
import { Authentication } from './components/functions/authentication.jsx';

function App() {
  return (
    <Authentication>
      <div className={layout.app}>
        <main>
          <div className={layout.container}>
            <Dashboard />
          </div>
        </main>
      </div>
    </Authentication>
  );
}

export default App;
