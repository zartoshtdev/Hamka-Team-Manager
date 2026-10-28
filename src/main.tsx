import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import '@fontsource/vazirmatn/800.css';
import Providers from './app/Providers';
import App from './app/App';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Providers>
        <App />
      </Providers>
    </HashRouter>
  </StrictMode>,
);
