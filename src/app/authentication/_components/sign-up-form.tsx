'"use client";';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome é Obrigatório" }).max(50),
  email: z
    .string()
    .trim()
    .min(5, {
      message: "Email é Obrigatório",
    })
    .email({
      message: "Email é Obrigatório",
    })
    .max(100),
  password: z
    .string()
    .trim()
    .min(8, {
      message: "A Senha deve ter pelo menos 8 caracteres",
    })
    .max(100),
});

export function SignUpForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    console.log(data);
  };
  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Preencha os campos abaixo para criar uma conta.
            </CardDescription>
          </CardHeader>

          <CardContent className="mb-4 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormItem>
                    <FormLabel>E-mal</FormLabel>
                    <FormControl>
                      <Input placeholder="jhon@doe.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="****" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Criar conta
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
