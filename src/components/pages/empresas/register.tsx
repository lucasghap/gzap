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

interface RegisterCompany {
  onClose: () => void;
}

interface FormInputs {
  name: string;
  cnpj: string;
}

const RegisterCompany: React.FC<RegisterCompany> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const FormSchema = z.object({
    name: z.string().min(2, {
      message: 'O usuário deve conter no minímo 4 caracteres.',
    }),
    cnpj: z.string().min(2, {
      message: 'O nome deve conter no minímo 4 caracteres.',
    }),
  });

  const form = useForm<FormInputs>({
    resolver: zodResolver(FormSchema),
  });

  const { mutate, isLoading } = useMutation(
    'create-company',
    async (data: FormInputs) => {
      await api.post('/companies', data);
    },
    {
      onError: (error: any) => {
        toast({
          title: 'Erro ao cadastrar a empresa',
          description: `${error.message}`,
        });
      },
      onSuccess: async () => {
        await queryClient.refetchQueries('@company');

        toast({
          title: 'Sucesso!',
          description: 'Empresa cadastrada!',
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
            <DialogTitle>Adicionar Empresa</DialogTitle>
            <DialogDescription>Informe os dados para adicionar a empresa.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="grid gap-4 py-4" onSubmit={form.handleSubmit((data) => mutate(data))}>
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
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="Informe o CNPJ" {...field} />
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

export default RegisterCompany;
