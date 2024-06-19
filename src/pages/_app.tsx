import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@/services/queryClient';
import '../styles/global.css';
import { Sidebar } from '@/components/sidebar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

const Home: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { pathname, push } = useRouter();

  const SCREENS_WITHOUT_MENU = ['/'];

  const shouldRenderSidebar = !SCREENS_WITHOUT_MENU.includes(pathname);

  useEffect(() => {
    const token = sessionStorage.getItem('tkn_gzap');
    if (token && pathname === '/') {
      push('/gzap');
    }
  }, [pathname, push]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        forcedTheme={pathname === '/' ? 'light' : undefined}
        defaultTheme="light"
        enableSystem
      >
        {shouldRenderSidebar && <Sidebar />}
        <Component {...pageProps} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Home;
