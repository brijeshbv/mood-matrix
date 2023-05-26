"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  rating: "1" | "2" | "3" | "4" | "5"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
{
        accessorKey: "email",
        header: "Email",
      },
  {
    accessorKey: "rating",
    header: "Rating",
  },

]
