"use client"
import Link from "next/link"
import React from "react"

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
import { Progress } from "@/components/ui/progress"


ChartJS.register(ArcElement, Tooltip, Legend);

const fetcher = (url: string) => fetch(url, {
  method: 'GET',
  headers: {
    'Access-Control-Request-Headers': 'Content-Type, Authorization'
  }
}).then((res) => {
  return res.json()
});

export default function Summary() {

  const { data, error, isLoading } = useSWR(
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
          'rgba(134, 239, 172, 1)',
          'rgba(252, 165, 165, 1)',
          'rgba(147, 197, 253, 1)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',

        ],
        borderWidth: 1,
      },
    ],
  };

  if (error) return <div className='text-destructive'>Failed to load.</div>
  if (isLoading) return <LoadingSpinner />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center'
        , width: '100vh', height: '60vh'
      }}>


        <h1 style={{ fontSize: '2rem' }}>
          {'Organization level Sentiment Analysis'}
        </h1>
        <Doughnut data={org_data} options={chartOptions} />
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
                <TableCell>{RatingChart(user.rating)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>)
}

interface Ratings {
  positive: number;
  negative: number;
  neutral: number;
}

function RatingChart(rating: string): JSX.Element {
  // parse `rating` and return a chart
  // rating can be a string like: "POSITIVE: 8 NEGATIVE: 15 NEUTRAL: 11", "POSITIVE: 6 NEGATIVE: 0 NEUTRAL: 6", "POSITIVE: 4 NEGATIVE: 1 NEUTRAL: 2", "POSITIVE: 2 NEGATIVE: 1 NEUTRAL: 1", "POSITIVE: 1 NEGATIVE: 1 NEUTRAL: 1", "POSITIVE: 4 NEGATIVE: 1 NEUTRAL: 1"
  // I want to get the numbers in to a object that looks like
  // const obj = { "positive": 8, "negative": 15, "neutral": 11 }. However, sometimes, in the rating, the string may or may not have a POSITIVE, NEGATIVE or NEUTRAL. So, I need to check if the string has POSITIVE, NEGATIVE or NEUTRAL and then parse the number after it. If it doesn't have it, then I need to set it to 0.

  const defaultRatings: Ratings = {
    positive: 0,
    negative: 0,
    neutral: 0,
  };

  // console.log("rating: ", rating)
  if (!rating) {
    return <>N/A</>
  }

  rating = rating.replace(/\s/g, '');

  const ratingTypes = ['positive', 'negative', 'neutral'];
  for (const type of ratingTypes) {
    const regex = new RegExp(`${type.toUpperCase()}:(\\d+)`, 'i');
    const match = rating.match(regex);
    console.log({ rating, match })
    // console.log(match)
    if (match) {
      defaultRatings[type as keyof Ratings] = Number(match[1]);
    }
  }


  const total = defaultRatings.positive + defaultRatings.neutral + defaultRatings.negative
  const positiveToHundred = Math.max(defaultRatings.positive / total * 100, 3);
  const neutralToHundred = Math.max(defaultRatings.neutral / total * 100, 3);
  const negativeToHundred = Math.max(defaultRatings.negative / total * 100, 3);



  return (
    <>
      <Progress className="w-32" value={positiveToHundred} color="emerald-300" />
      <Progress className="w-32" value={neutralToHundred} color="yellow-300" />
      <Progress className="w-32"value={negativeToHundred} color="red-300" />
    </>
  )
}