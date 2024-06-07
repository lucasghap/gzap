import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { api } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from '@/components/ui/use-toast';
import { celMask } from '@/utils/masks';

export default function Instance() {
  const queryClient = useQueryClient();
  const [intervalId, setIntervalId] = useState<any>(null);

  async function whatsAppConnections() {
    const response = await api.get('/connections');
    return response.data;
  }

  const { data: whatsConnectionsInfo, refetch: refetchConnections } = useQuery('@connections', whatsAppConnections, {
    refetchInterval: intervalId ? 10000 : false,
    refetchOnWindowFocus: false,
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
  });

  const { mutate, isLoading: loadingLogout } = useMutation(
    'logout-session',
    async () => {
      await api.post('/whatsapp/logout');
    },
    {
      onError: (error: any) => {
        toast({
          title: 'Erro ao desconectar da sessão',
          description: `${error.message}`,
        });
      },
      onSuccess: async () => {
        toast({
          title: 'Sucesso!',
          description: 'Sessão desconectada!',
        });
        queryClient.invalidateQueries('@connections');
        refetchQRCODE();
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

  return (
    <div className="flex h-screen justify-center p-16">
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
              <Button onClick={() => mutate()} disabled={loadingLogout}>
                Desconectar da Sessão
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center gap-4">
            {whatsAppQRCODE?.qrCode && <img src={whatsAppQRCODE?.qrCode} alt="WhatsApp QR Code" />}
            <Button onClick={() => refetchQRCODE()} disabled={isFetching}>
              Gerar novo QR-Code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
