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

const fetcher = (url: string) => fetch(url, {
  method: 'GET'
}).then((res) => { 
  return res.json()});

export default function Page({ params }: { params: { email: string } }) {
  const {data, error, isLoading } = useSWR(
    `http://127.0.0.1:5000/api/v1/summary/${decodeURIComponent(params.email)}`, fetcher)

  console.log(params)
  console.log(data)
  return (
    <div className="pt-4">
      <div className="flex flex-1 flex-col text-center p-4">
        <h1 className="pb-4 text-3xl font-extrabold leading-tight  tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Summary for {decodeURIComponent(params.email)}
        </h1>
        <h2 className='text-left font-bold font-serif'>Summary of recent actions</h2>
        <p className='text-sm text-justify'>{data.output_text}</p>
      </div>
      {/* <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Content</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Time Spent</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData["storchaka@gmail.com"].items.map((item) => (
            <TableRow>
              <TableCell className="font-medium">{item.content}</TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell>{item.time_spent}</TableCell>
              <TableCell>{item.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  )
}
