import ForgotPassword from '@/components/pages/login/forgotPassword';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { Mail } from 'lucide-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function Login() {
  const { push } = useRouter();
  const [showModalPassword, setShowModalPassword] = useState<boolean>(false);

  const FormSchema = z.object({
    username: z.string().min(2, {
      message: 'O usuário deve conter no minímo 4 caracteres.',
    }),
    password: z.string().min(2, {
      message: 'A senha deve conter no minímo 4 caracteres.',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>, e: any) => {
    e.preventDefault();

    try {
      const { username, password } = data;

      const response = await api.post('/auth/login', {
        username,
        password,
      });

      sessionStorage.setItem('tkn_gzap', response.data.access_token);
      push('/gzap');
    } catch (err: any) {
      toast({
        title: 'Não foi possível realizar o login:',
        description: err?.message || 'Ocorreu um erro desconhecido',
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-800 to-emerald-400">
      <Head>
        <title>LARA | Entrar</title>
      </Head>
      <h1 className="mb-12 text-5xl font-bold text-white">LARA</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 rounded-md bg-white p-8 shadow-md"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuáffrio</FormLabel>
                <FormControl>
                  <Input placeholder="Informe seu nome de usuário" {...field} suffix={<Mail />} />
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
                  <PasswordInput placeholder="Informe a senha" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            variant="default"
            loading={form.formState.isSubmitting}
            spinnerSize={24}
          >
            Entrar
          </Button>
          <Button type="button" variant="link" onClick={() => setShowModalPassword(true)}>
            Esqueci minha senha
          </Button>
        </form>
      </Form>
      {showModalPassword && (
        <Dialog.Root open={showModalPassword} onOpenChange={setShowModalPassword}>
          <ForgotPassword onClose={() => setShowModalPassword(false)} />
        </Dialog.Root>
      )}
    </div>
  );
}
