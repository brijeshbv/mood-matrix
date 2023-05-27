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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


ChartJS.register(ArcElement, Tooltip, Legend);

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
  const org_summary = data?.org_summary
  const chartOptions = {
    maintainAspectRatio: false, // Disable aspect ratio to control size
    responsive: true,
  };
  const org_data = {
  labels: ['Positive', 'Negative', 'Neutal'],
  datasets: [
    {
      label: 'Organization Sentiment Summary',
      data: [org_summary?.positive, org_summary?.negative, org_summary?.neutral],
      backgroundColor: [
        'rgba(0, 255, 0, 0.6)',
        'rgba(255, 0, 0, 0.6)',
        'rgba(0, 0, 255, 0.6)',
      ],
      borderColor: [
        'rgba(0, 255, 0, 0.9)',
        'rgba(255, 0, 0, 0.9)',
        'rgba(0, 0, 255, 0.9)',

      ],
      borderWidth: 1,
    },
  ],
};

  if(error) return <div className='text-destructive'>Failed to load.</div>
  if (isLoading) return <LoadingSpinner />

  return (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' 
     ,width: '100vh', height: '60vh' }}>
    
      <h1 style={{ fontSize: '2rem' }}>
        {'Organization level Sentiment Analysis'}
      </h1>
   <Doughnut data={org_data} options={chartOptions}  />
   </div>
   <div style={{ paddingTop: '50px' }}>

  <Table>
  <TableCaption>A list of your users and their ratings.</TableCaption>
  <TableHeader>
    <TableRow>
    <TableHead >Name</TableHead>
      <TableHead >Email</TableHead>
      <TableHead >Rating</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.data.map((user: any) => (
      <TableRow key={user.email}>
        <TableCell className="text-blue-500 hover:text-blue-700 hover:underline"><Link href={`/dashboard/${user.email}`}>{user.name}</Link></TableCell>
        <TableCell className="text-blue-500 hover:text-blue-700 hover:underline"><Link href={`/dashboard/${user.email}`}>{user.email}</Link></TableCell>
        <TableCell>{user.rating}</TableCell>
        </TableRow>
    ))}
  </TableBody>
</Table>
</div>
</div>)
}
