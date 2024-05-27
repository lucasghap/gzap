import { AppProps } from 'next/app';

import { QueryClientProvider } from 'react-query';
import { queryClient } from '@/services/queryClient';

import '../styles/global.css';
import { Sidebar } from '@/components/sidebar';

const Home: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Sidebar />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
};

export default Home;
