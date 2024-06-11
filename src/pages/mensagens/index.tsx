import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { api } from '@/services/api';
import { useMutation, useQuery } from 'react-query';

import { celMask } from '@/utils/masks';

import { RefreshCwIcon } from 'lucide-react';

import { Pagination } from '@/components/pages/mensagens/pagination';
import withAuth from '@/hoc/withAuth';
import { toast } from '@/components/ui/use-toast';

interface WhatsAppMessageLog {
  companyId: string;
  createdAt: string;
  id: string;
  isSent: boolean;
  message: string;
  patientId: string;
  patientName: string;
  phoneNumber: string;
}

const Messages: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);

  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  async function whatsAppConnections() {
    const response = await api.get('/connections');
    return response.data;
  }

  const { data: whatsConnectionsInfo } = useQuery('@connections', whatsAppConnections, {
    refetchOnWindowFocus: false,
    onError: (err: any) => {
      toast({
        title: 'Não foi possível buscar os dados da conexão.',
        description: err?.message || 'Ocorreu um erro desconhecido',
        duration: 3000,
      });
    },
  });

  async function whatsAppLogConnections() {
    const response = await api.get('/whatsapp-message-log', {
      params: {
        page: page,
        limit: limit,
        isSent: null,
      },
    });
    return response.data;
  }

  const { data: whatsAppLog, refetch: refretchWhatsAppLog } = useQuery<WhatsAppMessageLog[]>(
    ['@connections-log', page, limit],
    whatsAppLogConnections,
    {
      refetchOnWindowFocus: false,
      onError: (err: any) => {
        toast({
          title: 'Não foi possível buscar as mensagens.',
          description: err?.message || 'Ocorreu um erro desconhecido',
          duration: 3000,
        });
      },
    },
  );

  const { mutate: resendMessages } = useMutation(
    async () => {
      return api.post('/whatsapp-message-log/resend-message');
    },
    {
      onSuccess: () => {
        toast({
          title: 'Sucesso!',
          description: 'As mensagens foram reenviadas!',
          duration: 3000,
        });
        refretchWhatsAppLog();
      },
      onError: (error: any) => {
        toast({
          title: 'Erro!',
          description: `Erro ao reenviar as mensagens: ${error.message}`,
          duration: 3000,
        });
      },
    },
  );

  return (
    <div className="flex h-screen justify-center p-16">
      <div className="flex w-full max-w-full flex-col gap-3 overflow-auto p-4 sm:ml-[270px]">
        <h2 className="my-6  border-b pb-2 text-3xl font-semibold tracking-tight">Mensagens</h2>

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
          </Card>
        ) : (
          <div className="mb-12 mt-6 flex flex-col items-center justify-center gap-4 font-bold text-red-600">
            Nenhum telefone conectado!
          </div>
        )}
        {Number(whatsAppLog?.length) > 0 ? (
          <>
            <div className="mb-4 flex justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary" onClick={() => whatsConnectionsInfo && resendMessages()}>
                      <RefreshCwIcon size={16} className="mr-2" /> Reenviar Mensagens Mal Sucedidas
                      {!whatsConnectionsInfo && (
                        <TooltipContent>
                          <p>Necessário ter o telefone conectado para executar a ação.</p>
                        </TooltipContent>
                      )}
                    </Button>
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do paciente</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Celular</TableHead>
                  <TableHead>Enviado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {whatsAppLog?.map((whatsappLog: WhatsAppMessageLog) => (
                  <TableRow key={whatsappLog.id}>
                    <TableCell className="font-medium">{whatsappLog.patientName}</TableCell>
                    <TableCell>{whatsappLog.message}</TableCell>
                    <TableCell className="w-64">{celMask(whatsappLog.phoneNumber)}</TableCell>
                    <TableCell className="w-44">{whatsappLog.isSent ? 'Sim' : 'Não'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              currentPage={page}
              onNext={nextPage}
              onPrevious={prevPage}
              onLimitChange={handleLimitChange}
              isPreviousDisabled={page === 1}
              isNextDisabled={Number(whatsAppLog?.length) < limit}
              limit={limit}
            />
          </>
        ) : (
          <div className="mb-12 mt-6 flex flex-col items-center justify-center gap-4 font-bold text-red-600">
            Não existem dados de mensagens disponíveis.
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(Messages);
