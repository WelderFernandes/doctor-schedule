"use client";
import { createClinic } from "@/app/actions/create-clinic";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const clinicSchema = z.object({
  name: z
    .string({
      required_error: "Nome é Obrigatório",
      invalid_type_error: "Nome deve ser uma string",
    })
    .trim()
    .min(5, {
      message: "Nome é Obrigatório",
    })
    .max(100),
});

export function ClinicForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof clinicSchema>>({
    resolver: zodResolver(clinicSchema),
  });

  const onSubmit = async (values: z.infer<typeof clinicSchema>) => {
    try {
      await createClinic(values.name);
      toast.success("Clínica criada com sucesso");
      form.reset();
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar clínica");
      return;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="name">Nome da Clínica</Label>
              <FormControl>
                <Input
                  id="name"
                  placeholder="Digite o nome da clínica"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="flex items-center justify-end space-x-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Criar Clínica
            {form.formState.isSubmitting && (
              <Loader2 className="ml-2 animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
