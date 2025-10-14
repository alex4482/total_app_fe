import { useState } from 'react';

// import TotalAppLogo from '@/assets/logo/totalAppLogo.svg?react';
import { useAuthContext } from '@/Auth';
import { loginUser } from '@/clients/auth-client.ts';
import ModeToggle from '@/layouts/main/components/Navbar/ModeToggle';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button, buttonVariants } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useToast } from '@/components/ui/use-toast.ts';

export interface LoginProps {
  // email: string;
  password: string;
}

export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logInUser } = useAuthContext();

  const formSchema = z.object({
    // email: z
    //   .string()
    //   .email({ message: 'Introduceti o adresa de email valida.' }),
    password: z.string().min(1, { message: 'Parola este obligatorie.' }),
  });

  const loginForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleLogin = async (values: LoginProps) => {
    try {
      const response = await loginUser(values);
      if (response.status >= 200 && response.status < 300) {
        logInUser(response.data);
        navigate('/');
      } else {
        toast({
          description: 'A aparut o eroare la login!',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        description: 'A aparut o eroare la login!',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoggingIn(true);
    handleLogin(values);
  };

  return (
    <section className="container grid place-items-center gap-10 py-20 md:py-32 lg:grid-cols-1">
      <Card>
        <div className="flex justify-end">
          <ModeToggle />
        </div>
        <div className="space-y-6">
          {/* <main className="text-center font-bold">
            <div className="flex w-full">
              <TotalAppLogo className="w-auto" />
            </div>
          </main> */}
        </div>
        <CardHeader className="items-start">
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Introdu parola pentru a continua.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onSubmit)}
              id="loginForm"
              className="space-y-8"
            >
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parola</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Button
            type="submit"
            form="loginForm"
            disabled={isLoggingIn}
            className={`w-full ${buttonVariants({
              variant: 'primaryYellow',
            })}`}
          >
            {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>
          
        </CardFooter>
      </Card>
    </section>
  );
}
