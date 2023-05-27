"use client"
import React from 'react'
import useSWR from 'swr';
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

const fetcher = (url: string) => fetch(url, {
  method: 'GET'
}).then((res) => { 
  return res.json()});

export default function Page({ params }: { params: { email: string } }) {
  const decodedString = decodeURIComponent(params.email)
  const {data, error, isLoading } = useSWR(
    `http://127.0.0.1:5000/api/v1/coach/${decodedString}`, fetcher)

  if(error) return <div className='text-destructive'>Failed to load.</div>

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container flex flex-col gap-2 p-4">
      <h1 className="text-center pb-4 text-serif text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Coach {decodeURIComponent(params.email)}
      </h1>
      <div className='mx-auto justify-center text-center'>
        <h2 className='text-left font-bold font-serif'>Employee Coaching Overview</h2>
        <p className='text-sm text-justify max-w-md'>{data.output_text}</p>
      </div>
      <h2 className='text-left font-bold font-serif'>Employee Coaching Strategies:</h2>
      <Table>
        <TableCaption>A list of coaching strategies for {decodeURIComponent(params.email)}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Time Spent</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Feedback</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((item: any, index: number) => (
            <TableRow key={index}>
              <TableCell>{item.type}</TableCell>
              <TableCell>{new Date(item.time * 1000).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}</TableCell>
              <TableCell>{item.time_spent} minutes</TableCell>
              <TableCell className='max-w-md'>{item.content}</TableCell>
              <TableCell className='max-w-md font-semibold'>{data.intermediate_steps[index]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
