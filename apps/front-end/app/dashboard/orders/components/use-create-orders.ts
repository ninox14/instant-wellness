import { CreateOrder } from "@/common";
import { http } from "@/lib/api";
import { isHTTPError } from "ky";
import { useEffect, useState } from "react";

export function useCreateOrders() {
  const [error, setError] = useState<string | undefined>(undefined);

  const createOrder = async (order: CreateOrder) => {
    try {
      await http.post("orders", order);
    } catch (err) {
      if (isHTTPError(err)) {
        const error = (await err.response.json()) as { message: string };
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(undefined);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [error]);

  return { error, createOrder };
}
