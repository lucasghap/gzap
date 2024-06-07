// CompanyModal.tsx
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
import { cnpjMask, unmask } from '@/utils/masks';

interface CompanyModalProps {
  onClose: () => void;
  isEditing: boolean;
  companySelected?: any;
}

interface FormInputs {
  name: string;
  cnpj: string;
}

const RegisterOrEditCompany: React.FC<CompanyModalProps> = ({ onClose, isEditing, companySelected }) => {
  const queryClient = useQueryClient();

  const FormSchema = z.object({
    name: z.string().min(2, {
      message: 'O nome deve conter no mínimo 2 caracteres.',
    }),
    cnpj: z.string().min(2, {
      message: 'O CNPJ deve conter no mínimo 2 caracteres.',
    }),
  });

  const form = useForm<FormInputs>({
    resolver: zodResolver(FormSchema),
    defaultValues: isEditing
      ? {
        name: companySelected?.name || '',
        cnpj: companySelected?.cnpj || '',
      }
      : undefined,
  });

  const mutationUrl = isEditing ? `/companies/${companySelected?.id}` : '/companies';
  const mutationMethod = isEditing ? api.put : api.post;

  const { mutate, isLoading } = useMutation(
    async (data: FormInputs) => {
      const unmaskedData = { ...data, cnpj: unmask(data.cnpj) };
      await mutationMethod(mutationUrl, unmaskedData);
    },
    {
      onError: (error: any) => {
        toast({
          title: 'Erro ao cadastrar/editar a empresa',
          description: `${error.message}`,
        });
      },
      onSuccess: async () => {
        await queryClient.refetchQueries('@company');

        toast({
          title: 'Sucesso!',
          description: isEditing ? 'Empresa editada!' : 'Empresa cadastrada!',
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
            <DialogTitle>{isEditing ? 'Editar' : 'Adicionar'} Empresa</DialogTitle>
            <DialogDescription>Informe os dados para {isEditing ? 'editar' : 'adicionar'} a empresa.</DialogDescription>
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
                      <Input placeholder="Informe o nome" {...field} />
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
                      <Input placeholder="Informe o CNPJ" {...field} value={cnpjMask(field.value)} />
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

export default RegisterOrEditCompany;
