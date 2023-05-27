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
import { LoadingSpinner } from "@/components/ui/spinner";

const fetcher = (url: string) => fetch(url, {
  method: 'GET',
  headers:{
    'Access-Control-Request-Headers': 'Content-Type, Authorization'
  }
}).then((res) => { 
  return res.json()});

export default function Summary() {

  const {data, error, isLoading } = useSWR(
 'http://127.0.0.1:5000/api/v1/users_rating', fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <LoadingSpinner />

  return (

  <Table>
  <TableCaption>A list of your users and their ratings.</TableCaption>
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