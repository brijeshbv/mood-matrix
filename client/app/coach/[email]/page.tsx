"use client"
import React from 'react'
import { useState } from 'react';
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
import { Button } from "@/components/ui/button"
import { MessageSquare } from 'lucide-react'

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

  function truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }
  
    return content.slice(0, maxLength - 3) + '...';
  }

  const [discordButtonClicked, setDiscordButtonClicked] = useState(false)
  const discordButtonHandler = async () => {
    fetch(`http://127.0.0.1:5000/api/v1/coach_agent/${decodedString}`)

    setDiscordButtonClicked(true)
  }

  return (
    <div className="container flex flex-col gap-2 p-4">
      <h1 className="text-center pb-4 text-serif text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Coach {decodeURIComponent(params.email)}
      </h1>
      <div className='mx-auto justify-center text-center'>
        <h2 className='text-left font-bold font-serif'>Employee Coaching Overview</h2>
        <p className='text-sm text-justify max-w-md'>{data.output_text}</p>

        {!discordButtonClicked && 
          <Button className="bg-[#6e85d3]" onClick={discordButtonHandler}>
            <MessageSquare className="mt-2 mr-1" />Coach on Discord
          </Button>
        }
      </div>
      <h2 className='text-left font-bold font-serif'>Employee Coaching Strategies:</h2>
      <Table>
        <TableCaption>A list of coaching strategies for {decodeURIComponent(params.email)}.</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Type</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Time Spent</TableHead> */}
            <TableHead>Content</TableHead>
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
