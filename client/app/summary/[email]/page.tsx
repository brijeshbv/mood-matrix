"use client"
import useSWR from 'swr';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { userAgent } from 'next/server';

import { LoadingSpinner } from '@/components/ui/spinner';

const fetcher = (url: string) => fetch(url, {
  method: 'GET'
}).then((res) => { 
  return res.json()});

export default function Page({ params }: { params: { email: string } }) {
  const decodedString = decodeURIComponent(params.email)
  const {data, error, isLoading } = useSWR(
    `http://127.0.0.1:5000/api/v1/summary/${decodedString}`, fetcher)

  console.log(data)
  if(error) return <div className='text-destructive'>Failed to load.</div>

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container flex flex-col gap-2 p-4">
      <h1 className="text-center pb-4 text-serif text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Summary for {decodeURIComponent(params.email)}
      </h1>
      <div className='mx-auto '>
        <h2 className='text-left font-bold font-serif'>Overview of recent actions</h2>
        <p className='text-sm text-justify max-w-md'>{data.output_text}</p>
      </div>
      <h2 className='text-left font-bold font-serif'>All recent actions:</h2>
      <Table>
        <TableCaption>A list of {decodeURIComponent(params.email)} recent actions.</TableCaption>
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
            <TableRow>
              <TableCell>{item.type}</TableCell>
              <TableCell>{new Date(item.time * 1000).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}</TableCell>
              <TableCell>{item.time_spent} minutes</TableCell>
              <TableCell className='max-w-md'>{item.content}</TableCell>
              <TableCell className='max-w-md'>{data.intermediate_steps[index]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
