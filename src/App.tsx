import { ThemeProvider } from '@/components/theme-provider';
import { Outlet } from 'react-router';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Outlet />
      <Toaster position='top-right' richColors closeButton />
    </ThemeProvider>
  );
}

export default App;
