import { ThemeProvider } from '@/components/theme-provider';
import { Outlet } from 'react-router';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import Error from '@/containers/error/error';
import { toast } from 'sonner';
import { getAxiosError } from '@/utils/getAxiosError';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <Error resetErrorBoundry={resetErrorBoundary} />
        )}
        onError={(error) => {
          toast.error(getAxiosError(error));
        }}
      >
        <Outlet />
      </ErrorBoundary>
      <Toaster position='top-right' richColors closeButton />
    </ThemeProvider>
  );
}

export default App;
