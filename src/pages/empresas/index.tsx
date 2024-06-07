import { Button } from '@/components/ui/button';

import * as Dialog from '@radix-ui/react-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil } from 'phosphor-react';

import { useState } from 'react';

import { api } from '@/services/api';
import { useQuery } from 'react-query';
import { cnpjMask } from '@/utils/masks';
import RegisterOrEditCompany from '@/components/pages/empresas/registerOrEdit';

export default function Companies() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [companySelected, setCompanySelected] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  async function fetchCompanies() {
    const response = await api.get('/companies/all');
    return response.data;
  }

  const { data: companies } = useQuery('@company', fetchCompanies);

  const handleEditClick = (company: any) => {
    setCompanySelected(company);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddCompanyClick = () => {
    setCompanySelected(null);
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className=" flex h-screen justify-center">
      <div className="w-full max-w-full overflow-auto p-4 sm:ml-[270px]">
        <h2 className="my-6 border-b pb-2 text-3xl font-semibold tracking-tight">Empresas Cadastradas</h2>

        <div className="my-8 flex justify-end">
          <Button variant="outline" onClick={handleAddCompanyClick}>
            Adicionar Empresa
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies?.map((company: any) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{cnpjMask(company.cnpj)}</TableCell>
                <TableCell>{company.isActive ? 'Sim' : 'Não'}</TableCell>
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
}
