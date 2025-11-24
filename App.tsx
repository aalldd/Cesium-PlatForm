import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Showcase } from './pages/Showcase';
import { ExampleViewer } from './pages/ExampleViewer';
import { AppProvider } from './contexts/AppContext';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/example/:id" element={<ExampleViewer />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;