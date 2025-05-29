"use client";
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
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LuLoader } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: `/dashboard`,
      },
      {
        onSuccess: () => {
          toast.success("Conta criada com sucesso!");
          router.push("/dashboard");
        },
        onError: (error) => {
          console.log({ error });
          toast.error(error.error.message);
          form.setError("root", {
            type: "onChange",
            message: error.error.message,
          });
        },
      },
    );
  }

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
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              Criar conta
              {form.formState.isSubmitting && (
                <LuLoader className="mr-2 h-4 w-4 animate-spin" />
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
