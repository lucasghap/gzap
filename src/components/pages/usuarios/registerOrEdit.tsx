import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogPortal,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PasswordInput } from '@/components/ui/password-input';

interface UserModalProps {
  onClose: () => void;
  isEditing: boolean;
  userSelected?: any;
}

interface CompaniesProps {
  id: string;
  name: string;
  email: string;
  username?: string;
  password?: any;
  confirmPassword?: any;
  companyId?: string;
  targetUserId: string;
}

const RegisterUser: React.FC<UserModalProps> = ({ onClose, isEditing, userSelected }) => {
  const queryClient = useQueryClient();

  async function fetchCompanies() {
    const response = await api.get('/companies/all');
    return response.data;
  }

  const { data: companies } = useQuery('@company', fetchCompanies);

  const CreateSchema = z
    .object({
      email: z.string().email({ message: 'Email inválido' }),
      name: z.string(),
      username: z.string(),
      password: z.string().min(2, {
        message: 'A senha deve conter no mínimo 6 caracteres',
      }),
      confirmPassword: z.string().min(2, {
        message: 'A senha deve conter no mínimo 6 caracteres',
      }),
      companyId: z.string(),
      targetUserId: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas não correspondem',
      path: ['confirmPassword'],
    });

  const EditSchema = z
    .object({
      email: z.string().email({ message: 'Email inválido' }),
      name: z.string(),
      username: z.string(),
      password: z.string().optional().nullable(),
      confirmPassword: z.string().optional().nullable(),
      companyId: z.string(),
      targetUserId: z.string(),
    })
    .refine((data) => !data.password || data.password === data.confirmPassword, {
      message: 'As senhas não correspondem',
      path: ['confirmPassword'],
    });

  const form = useForm<CompaniesProps>({
    resolver: zodResolver(isEditing ? EditSchema : CreateSchema),
    defaultValues: {
      email: userSelected?.email || '',
      name: userSelected?.name || '',
      username: userSelected?.username || '',
      password: isEditing ? null : '',
      confirmPassword: isEditing ? null : '',
      companyId: userSelected?.companyId || '',
      targetUserId: userSelected?.id || '',
    },
  });

  const mutationUrl = isEditing ? `/users/admin` : '/users';
  const mutationMethod = isEditing ? api.put : api.post;

  const { mutate, isLoading } = useMutation(
    'create-update-user',
    async (data: CompaniesProps) => {
      await mutationMethod(mutationUrl, data);
    },
    {
      onError: (error: any) => {
        toast({
          title: 'Erro ao cadastrar o usuário',
          description: `${error.message}`,
        });
      },
      onSuccess: async () => {
        await queryClient.refetchQueries('@users');

        toast({
          title: 'Sucesso!',
          description: isEditing ? 'Usuário editado!' : 'Usuário cadastrado!',
        });

        onClose();
      },
    },
  );

  return (
    <div className="mt-32 flex h-screen justify-center">
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
            <DialogDescription>Informe os dados para {isEditing ? 'editar' : 'adicionar'} o usuário.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="grid gap-4 py-4" onSubmit={form.handleSubmit((data) => mutate(data))}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe seu email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe o nome de usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma empresa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {companies?.map((company: CompaniesProps) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Informe a senha" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Confirme sua nova senha" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </div>
  );
};

export default RegisterUser;
