import { ThemeProvider } from '@/components/theme-provider';
import { LoginForm } from './components/forms/login';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='flex min-h-svh flex-col items-center justify-center'>
        <LoginForm />
      </div>
    </ThemeProvider>
  );
}

export default App;
