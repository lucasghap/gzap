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
import { useMutation, useQueryClient } from 'react-query';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface EditCompanyProps {
  onClose: () => void;
}

interface FormInputs {
  username: string;
}

const ForgotPassword: React.FC<EditCompanyProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const FormSchema = z.object({
    username: z.string(),
  });

  const form = useForm<FormInputs>({
    resolver: zodResolver(FormSchema),
  });

  const { mutate, isLoading } = useMutation(
    async (data: FormInputs) => {
      await api.post(`/users/reset-password`, data);
    },
    {
      onError: (error: any) => {
        toast({
          title: 'Erro ao editar a resetar sua senha',
          description: error?.message || 'Ocorreu um erro desconhecido',
          duration: 3000,
        });
      },
      onSuccess: async () => {
        await queryClient.refetchQueries('@reset-password');

        toast({
          title: 'Sucesso!',
          description: 'Uma nova senha foi enviada para seu email!',
          duration: 3000,
        });

        onClose();
      },
    },
  );

  return (
    <DialogPortal>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar a senha</DialogTitle>
          <DialogDescription>
            Informe seu usuário, uma nova senha será enviada para o email cadastrado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-4 py-4" onSubmit={form.handleSubmit((data) => mutate(data))}>
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
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </DialogPortal>
  );
};

export default ForgotPassword;
