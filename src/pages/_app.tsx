import { AppProps } from 'next/app';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '@/services/queryClient';
import '../styles/global.css';
import { Sidebar } from '@/components/sidebar';
import { useRouter } from 'next/router';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

const Home: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { pathname } = useRouter();

  const SCREENS_WITHOUT_MENU = ['/'];

  const shouldRenderSidebar = !SCREENS_WITHOUT_MENU.includes(pathname);
  const applyTheme = pathname !== '/';

  return (
    <QueryClientProvider client={queryClient}>
      {applyTheme ? (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {shouldRenderSidebar && <Sidebar />}
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      ) : (
        <>
          {shouldRenderSidebar && <Sidebar />}
          <Component {...pageProps} />
          <Toaster />
        </>
      )}
    </QueryClientProvider>
  );
};

export default Home;
