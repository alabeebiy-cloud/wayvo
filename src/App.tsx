import React from 'react';
import { ScrollToHash } from './components/layout/ScrollToHash';
import { AppRoutes } from './routes/AppRoutes';

const App: React.FC = () => (
  <>
    <ScrollToHash />
    <AppRoutes />
  </>
);

export default App;