import React, { useEffect } from 'react';
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
import { useMutation, useQueryClient } from 'react-query';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput } from '@/components/ui/password-input';

interface EditUserProps {
  onClose: () => void;
  userData: any;
}

interface FormInputs {
  email: string;
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  targetUserId: string;
}

const EditUserSidebar: React.FC<EditUserProps> = ({ onClose, userData }) => {
  const queryClient = useQueryClient();

  const FormSchema = z
    .object({
      email: z.string().email({ message: 'Email inválido' }),
      name: z.string(),
      username: z.string(),
      password: z.string().optional().nullable(),
      confirmPassword: z.string().optional().nullable(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'As senhas não correspondem',
      path: ['confirmPassword'],
    });

  const form = useForm<FormInputs>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: userData?.email,
      name: userData?.name,
      username: userData?.username,
      targetUserId: userData?.id,
    },
  });

  const { mutate, isLoading } = useMutation(
    async (data: FormInputs) => {
      await api.put(`/users/`, data);
    },
    {
      onError: (error: any) => {
        toast({
          title: 'Erro ao atualizar seus dados',
          description: `${error.message}`,
        });
      },
      onSuccess: async () => {
        await queryClient.refetchQueries('@userData');

        toast({
          title: 'Sucesso!',
          description: 'Seus dados foram atualizados!',
        });

        onClose();
      },
    },
  );

  useEffect(() => {
    if (userData) {
      form.reset({
        email: userData.email,
        name: userData.name,
        username: userData.username,
        targetUserId: userData.id,
      });
    }
  }, [userData, form]);

  return (
    <div className="mt-32 flex h-screen justify-center">
      <DialogPortal>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Atualize seus dados</DialogTitle>
            <DialogDescription>Altere seu dados pessoais.</DialogDescription>
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
                      <Input placeholder="Informe o Email" {...field} />
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
                      <Input placeholder="Informe o nome" {...field} />
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
                      <Input placeholder="Informe o usuário" {...field} />
                    </FormControl>
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
                      <PasswordInput placeholder="Informe a nova senha" {...field} />
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
                      <PasswordInput placeholder="Confirme sua nova senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  Atualizar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogPortal>
    </div>
  );
};

export default EditUserSidebar;
