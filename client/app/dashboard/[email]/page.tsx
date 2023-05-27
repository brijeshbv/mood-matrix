"use client"
import useSWR from 'swr';
import React from 'react';
import { ArrowLeftRight, User } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { LoadingSpinner } from '@/components/ui/spinner';
import { Button } from "@/components/ui/button"
import Link from 'next/link';

const fetcher = (url: string) => fetch(url, {
  method: 'GET'
}).then((res) => { 
  return res.json()});

export default function Page({ params }: { params: { email: string } }) {
  const decodedString = decodeURIComponent(params.email)
  const {data, error, isLoading } = useSWR(
    `http://127.0.0.1:5000/api/v1/summary/${decodedString}`, fetcher)

  if(error) return <div className='text-destructive'>Failed to load.</div>

  if (isLoading) return <LoadingSpinner />

  function truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }
  
    return content.slice(0, maxLength - 3) + '...';
  }
  
  return (
    <div className="container flex flex-col gap-2 p-4">
      <h1 className="text-center pb-4 text-serif text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Summary for {decodeURIComponent(params.email)}
      </h1>
      <div className='mx-auto justify-center text-center'>
        <h2 className='text-left font-bold font-serif'>Overview of recent actions</h2>
        <p className='text-sm text-justify max-w-md'>{data.output_text}</p>
        <Button asChild>
          <Link href={`/coach/${decodedString}`} className='mt-2'><User/><ArrowLeftRight/><User/>Coach</Link>
        </Button>
      </div>
      <h2 className='text-left font-bold font-serif'>All recent actions:</h2>
      <Table>
        <TableCaption>A list of {decodeURIComponent(params.email)} recent actions.</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Type</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Time Spent</TableHead> */}
            <TableHead>Summary</TableHead>
            <TableHead>Feedback</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((item: any, index: number) => (
            <TableRow key={index}>
              {/* <TableCell>{item.type.charAt(0).toUpperCase() + item.type.slice(1).replace(/_/g, " ")}</TableCell>
              <TableCell>{new Date(item.time * 1000).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}</TableCell>
              <TableCell>{item.time_spent} minutes</TableCell> */}
              <TableCell className='max-w-md'>{truncateContent(item.content, 200)}</TableCell>
              <TableCell className='max-w-md font-semibold'>{data.intermediate_steps[index]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
