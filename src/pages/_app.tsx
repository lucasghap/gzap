import { AppProps } from 'next/app';

import { QueryClientProvider } from 'react-query';
import { queryClient } from '@/services/queryClient';

import '../styles/global.css';
import { Sidebar } from '@/components/sidebar';
import { useRouter } from 'next/router';
import { Toaster } from '@/components/ui/toaster';

const Home: React.FC<AppProps> = ({ Component, pageProps }) => {
  const { pathname } = useRouter();

  const SCREENS_WITHOUT_MENU = ['/'];

  const shouldRenderSidebar = !SCREENS_WITHOUT_MENU.includes(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      {shouldRenderSidebar && <Sidebar />}
      <Component {...pageProps} />
      <Toaster />
    </QueryClientProvider>
  );
};

export default Home;
