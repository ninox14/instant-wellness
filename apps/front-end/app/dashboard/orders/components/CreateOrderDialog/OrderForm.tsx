"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { orderFormSchema } from "./orderFormSchema";
import { z } from "zod";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useCreateOrders } from "@/app/dashboard/orders/components/use-create-orders";

type LocationFormValues = z.infer<typeof orderFormSchema>;

export function OrderForm() {
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      latitude: 0,
      longitude: 0,
      subTotal: 0
    }
  });

  const { createOrder, error } = useCreateOrders();

  const onSubmit = async (values: LocationFormValues) => {
    try {
      await createOrder({
        lat: values.latitude,
        lon: values.longitude,
        subtotal: values.subTotal
      });
    } finally {
      form.reset();
    }
  };

  return (
    <>
      <Form {...form}>
        {error && <div className="text-red-500">{error}</div>}
        <form
          id="orderForm"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Latitude */}
          <Controller
            name="latitude"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Latitude</FormLabel>
                <Input
                  {...field}
                  type="number"
                  step="any"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Longitude */}
          <Controller
            name="longitude"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Longitude</FormLabel>
                <Input
                  {...field}
                  type="number"
                  step="any"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* Sub Total */}
          <Controller
            name="subTotal"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Sub Total</FormLabel>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
                {fieldState.invalid && (
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
        </form>
      </Form>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit" form="orderForm">
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
}
