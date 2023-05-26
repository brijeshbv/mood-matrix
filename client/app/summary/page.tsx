"use client"
import Link from "next/link"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, {
  method: 'GET'
}).then((res) => { 
  return res.json()});

export default function Summary() {

  const {data, error } = useSWR(
 'http://127.0.0.1:5000/api/v1/users_rating', fetcher)

 console.log(data)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (

  <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead >Email</TableHead>
      <TableHead >Rating</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((user: any) => (
      <TableRow key={user.email}>
        <TableCell className="text-blue-500 hover:text-blue-700 hover:underline"><Link href={`/summary/${user.email}`}>{user.email}</Link></TableCell>
        <TableCell>{user.rating}</TableCell>
        </TableRow>
    ))}
  </TableBody>
</Table>)
}