import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

import { Payment, columns } from "@/components/column"
import { DataTable } from "@/components/data-table"

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    rating: "1",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    rating: "3",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    rating: "2",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    rating: "4",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    rating: "5",
    email: "carmella@hotmail.com",
  },
]

export default function DataTableDemo() {
  return <DataTable columns={columns} data={data} />
}