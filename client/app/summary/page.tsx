"use client"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"

import { Payment, columns } from "@/components/column"
import { DataTable } from "@/components/data-table"
import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => { 
  console.log(res)
  return res.json()});
 
const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    rating: "1",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    rating: "3",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    rating: "2",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    rating: "4",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    rating: "5",
    email: "carmella@hotmail.com",
  },
]

export default function DataTableDemo() {

  const {data, error } = useSWR('http://127.0.0.1:5000/api/v1/users_rating', fetcher)
  // const [users, setUsers] = useState([]);

  // useEffect(() =>{
  //   console.log('running request')
  //   fetch(`http://localhost/5000/api/v1/users`)
  //     .then((response) => response.json())
  //     .then(({ surveyData }) => console.log(surveyData))
  //     .catch((error) => console.log(error))
  // } ,[])
  console.log(data, error)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return <DataTable columns={columns} data={data} />
}
