import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil } from 'phosphor-react';
import { useState } from 'react';
import { api } from '@/services/api';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import RegisterUser from '@/components/pages/usuarios/registerOrEdit';
import withAuth from '@/hoc/withAuth';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import Head from 'next/head';

interface User {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  username: string;
  type: string;
  isActive: boolean;
  updatedAt: string;
  companyId: string;
}

const Users: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userSelected, setUserSelected] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const queryClient = useQueryClient();

  async function fetchUsers() {
    const response = await api.get('/users/all');
    return response.data;
  }

  const { data: users } = useQuery('@users', fetchUsers, {
    refetchOnWindowFocus: false,
    onError: (err: any) => {
      toast({
        title: 'Não foi possível buscar os usuários',
        description: err?.message || 'Ocorreu um erro desconhecido',
        duration: 3000,
      });
    },
  });

  const updateUserStatus = useMutation(
    async ({ id, isActive }: { id: string; isActive: boolean }) => {
      await api.patch(`/users/${id}`, { isActive });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('@users');
        toast({
          title: 'Status atualizado',
          description: 'O status do usuário foi atualizado com sucesso',
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

  const handleEditUser = (user: User) => {
    setUserSelected(user);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddUser = () => {
    setUserSelected(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleToggleActive = (user: User) => {
    updateUserStatus.mutate({ id: user.id, isActive: !user.isActive });
  };

  return (
    <div className="ml-0 flex h-screen">
      <Head>
        <title>GZAP | Usuários</title>
      </Head>
      <div className="w-full max-w-full overflow-auto p-4 sm:ml-[270px]">
        <h2 className="mt-6 border-b pb-2 text-3xl font-semibold tracking-tight">Usuários Cadastrados</h2>

        <div className="my-8 flex justify-end">
          <Button variant="outline" onClick={handleAddUser}>
            Adicionar Usuário
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead>Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>
                  <Switch checked={user.isActive} onCheckedChange={() => handleToggleActive(user)} />
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEditUser(user)}>
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
          <RegisterUser onClose={() => setShowModal(false)} isEditing={isEditing} userSelected={userSelected} />
        </Dialog.Root>
      )}
    </div>
  );
};

export default withAuth(Users);
