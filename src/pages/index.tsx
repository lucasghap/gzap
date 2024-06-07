import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/router';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { api } from '@/services/api';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import ForgotPassword from '@/components/pages/login/forgotPassword';
import { PasswordInput } from '@/components/ui/password-input';

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
    } catch (err) {
      toast({
        title: 'Não foi possivel realizar o login:',
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-emerald-800 to-emerald-400">
      <h1 className="mb-12 text-5xl font-bold text-white">GZAP</h1>
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
                <FormLabel>Usuário</FormLabel>
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
          <Button type="submit" className="w-full" variant="default">
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
