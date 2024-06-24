import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Head from 'next/head';
import { api } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from '@/components/ui/use-toast';
import { celMask } from '@/utils/masks';
import withAuth from '@/hoc/withAuth';
import useTimerStore from '@/hooks/useTimerStore';

const Instance: React.FC = () => {
  const queryClient = useQueryClient();
  const [intervalId, setIntervalId] = useState<any>(null);
  const { endTime, setEndTime } = useTimerStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  async function whatsAppConnections() {
    const response = await api.get('/connections');
    return response.data;
  }

  const { data: whatsConnectionsInfo, refetch: refetchConnections } = useQuery('@connections', whatsAppConnections, {
    refetchInterval: intervalId ? 10000 : false,
    refetchOnWindowFocus: false,
    onError: (err: any) => {
      toast({
        title: 'Não foi possível buscar os dados da conexão.',
        description: err?.message || 'Ocorreu um erro desconhecido',
        duration: 3000,
      });
    },
    onSuccess: (data) => {
      if (data) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    },
  });

  async function fetchQRCODE() {
    const response = await api.get('/whatsapp/generate-qr');
    return response.data;
  }

  const {
    data: whatsAppQRCODE,
    refetch: refetchQRCODE,
    isFetching,
  } = useQuery('@qrcode', fetchQRCODE, {
    refetchOnWindowFocus: false,
    enabled: false,
    onError: (err: any) => {
      toast({
        title: 'Não foi possível buscar o QRCODE.',
        description: err?.message || 'Ocorreu um erro desconhecido',
        duration: 3000,
      });
    },
  });

  const { mutate, isLoading: loadingLogout } = useMutation(
    'logout-session',
    async () => {
      await api.post('/whatsapp/logout');
    },
    {
      onError: (err: any) => {
        toast({
          title: 'Erro ao desconectar da sessão',
          description: err?.message || 'Ocorreu um erro desconhecido',
          duration: 3000,
        });
      },
      onSuccess: async () => {
        toast({
          title: 'Sucesso!',
          description: 'Sessão desconectada!',
          duration: 3000,
        });
        queryClient.invalidateQueries('@connections');
        setTimeLeft(0);
      },
    },
  );

  useEffect(() => {
    if (!intervalId && !whatsConnectionsInfo) {
      const id = setInterval(() => {
        refetchConnections();
      }, 10000);
      setIntervalId(id);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId, refetchConnections, whatsConnectionsInfo]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (endTime) {
        const remaining = endTime - Date.now();
        setTimeLeft(Math.max(Math.ceil(remaining / 1000), 0));
      } else {
        setTimeLeft(0);
      }
    };

    if (endTime) {
      calculateTimeLeft();
      const timerId = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timerId);
    }
  }, [endTime]);

  const handleGenerateQRCode = () => {
    refetchQRCODE();
    const duration = 3 * 60 * 1000; // 3 minutos
    const newEndTime = Date.now() + duration;
    setEndTime(newEndTime);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen justify-center p-16">
      <Head>
        <title>GZAP | Instância</title>
      </Head>
      <div className="flex w-full max-w-full flex-col gap-3 overflow-auto p-4 sm:ml-[270px]">
        <h2 className="my-6 border-b pb-2 text-3xl font-semibold tracking-tight">Instância</h2>
        {whatsConnectionsInfo ? (
          <Card className="w-[380px]">
            <CardHeader>
              <CardTitle>Usuário Conectado</CardTitle>
              <CardDescription>Dados da conexão: </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div
                key={whatsConnectionsInfo.id}
                className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span className="flex size-2 translate-y-1 rounded-full bg-emerald-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Numero do Telefone : {celMask(whatsConnectionsInfo.phoneNumber)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Data do Login : {format(parseISO(whatsConnectionsInfo.updatedAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => mutate()} disabled={loadingLogout} loading={loadingLogout} spinnerSize={24}>
                Desconectar da Sessão
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center gap-4">
            {whatsAppQRCODE?.qrCode && <img src={whatsAppQRCODE?.qrCode} alt="WhatsApp QR Code" />}
            <Button onClick={handleGenerateQRCode} disabled={isFetching || timeLeft > 0}>
              {timeLeft > 0 ? `Aguarde ${formatTime(timeLeft)} para gerar um novo QR-Code` : 'Gerar novo QR-Code'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(Instance);
