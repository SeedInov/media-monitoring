import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SearchScreen from './components/SearchScreen';
import ResultsScreen from './components/ResultsScreen';
import ReactQueryProvider from './lib/providers/tanstack-provider';

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchScreen />} />
          <Route path="/results/:query" element={<ResultsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;