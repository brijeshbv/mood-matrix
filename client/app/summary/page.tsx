"use client"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

import { Payment, columns } from "@/components/column"
import { DataTable } from "@/components/data-table"
import useSWR from 'swr';

const fetcher = (url) => fetch(url, {
  method: 'GET',
}).then((res) => {
  console.log(res)
  return res.json()});


export default function DataTableDemo() {

  const {data, error } = useSWR(
 'http://127.0.0.1:5000/api/v1/users_rating', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return <DataTable columns={columns} data={data} />
}
