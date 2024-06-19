import Head from 'next/head';
import { useMediaQuery } from 'usehooks-ts';
import withAuth from '@/hoc/withAuth';

const GZAPHome: React.FC = () => {
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: false,
  });

  return (
    <div className={`flex h-screen items-center justify-center  ${isDesktop ? 'ml-64' : 'ml-0'}`}>
      <Head>
        <title>GZAP</title>
      </Head>
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          GZAP - Sua Central de Gerenciamento de Mensagens
        </h1>
        <h2 className="mt-6 border-b pb-2 text-3xl font-semibold tracking-tight">
          Selecione uma das opções no menu lateral
        </h2>
      </div>
    </div>
  );
};

export default withAuth(GZAPHome);
