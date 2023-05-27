"use client"
import Link from "next/link"
import React from "react"
import { Star } from "lucide-react"

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
                <TableCell className="text-blue-500 hover:text-blue-700 hover:underline"><Link href={`/summary/${user.email}`}>{user.name}</Link></TableCell>
                <TableCell className="text-blue-500 hover:text-blue-700 hover:underline"><Link href={`/summary/${user.email}`}>{user.email}</Link></TableCell>
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

  return (
    <>
      <Star />
      <div>Positive: {defaultRatings.positive}</div>
      <div>Negative: {defaultRatings.negative}</div>
      <div>Neutral: {defaultRatings.neutral}</div>
    </>
  )
}
