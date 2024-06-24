import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil } from 'phosphor-react';
import { useState } from 'react';
import { api } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { cnpjMask, unmask } from '@/utils/masks';
import RegisterOrEditCompany from '@/components/pages/empresas/registerOrEdit';
import withAuth from '@/hoc/withAuth';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import Head from 'next/head';
import { Input } from '@/components/ui/input';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const Companies: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [companySelected, setCompanySelected] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Novo estado para o termo de pesquisa
  const queryClient = useQueryClient();

  async function fetchCompanies() {
    const response = await api.get('/companies/all');
    return response.data;
  }

  const { data: companies } = useQuery('@company', fetchCompanies, {
    refetchOnWindowFocus: false,
    onError: (err: any) => {
      toast({
        title: 'Não foi possível buscar as empresas.',
        description: err?.message || 'Ocorreu um erro desconhecido',
        duration: 3000,
      });
    },
  });

  const updateCompanyStatus = useMutation(
    async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.patch(`/companies/${id}`, { isActive });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('@company');
        toast({
          title: 'Status atualizado',
          description: 'O status da empresa foi atualizado com sucesso',
          duration: 3000,
        });
      },
      onError: (err: any) => {
        toast({
          title: 'Erro ao atualizar status',
          description: err?.message || 'Ocorreu um erro desconhecido',
          duration: 3000,
        });
      },
    },
  );

  const handleEditClick = (company: Company) => {
    setCompanySelected(company);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddCompanyClick = () => {
    setCompanySelected(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleToggleActive = (company: Company) => {
    updateCompanyStatus.mutate({ id: company.id, isActive: !company.isActive });
  };

  const normalize = (str: string) => str.replace(/[^\w]/g, '').toLowerCase();

  const filteredCompanies = companies?.filter((company: Company) => {
    const normalizedSearchTerm = normalize(searchTerm);
    return (
      company.name.toLowerCase().includes(normalizedSearchTerm) ||
      normalize(unmask(company.cnpj)).includes(normalizedSearchTerm)
    );
  });

  return (
    <div className="flex h-screen justify-center">
      <Head>
        <title>GZAP | Empresas</title>
      </Head>
      <div className="w-full max-w-full overflow-auto p-4 sm:ml-[270px]">
        <h2 className="my-6 border-b pb-2 text-3xl font-semibold tracking-tight">Empresas Cadastradas</h2>

        <div className="my-8 flex justify-end">
          <Button variant="outline" onClick={handleAddCompanyClick}>
            Adicionar Empresa
          </Button>
        </div>
        <div className="my-4">
          <Input
            type="text"
            placeholder="Pesquisar Empresa ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies?.map((company: Company) => (
              <TableRow key={company.id}>
                <TableCell className="w-96">{company.id}</TableCell>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{cnpjMask(company.cnpj)}</TableCell>
                <TableCell>
                  <Switch checked={company.isActive} onCheckedChange={() => handleToggleActive(company)} />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEditClick(company)}>
                    <Pencil className="mr-2" />
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showModal && (
        <Dialog.Root open={showModal} onOpenChange={setShowModal}>
          <RegisterOrEditCompany
            onClose={() => setShowModal(false)}
            isEditing={isEditing}
            companySelected={companySelected}
          />
        </Dialog.Root>
      )}
    </div>
  );
};

export default withAuth(Companies);
