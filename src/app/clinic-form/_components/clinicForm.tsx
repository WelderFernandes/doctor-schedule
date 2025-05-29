"use client";
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
import { useForm } from "react-hook-form";
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
  const form = useForm<z.infer<typeof clinicSchema>>({
    resolver: zodResolver(clinicSchema),
  });

  const onSubmit = (values: z.infer<typeof clinicSchema>) => {
    console.log(values);
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
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
