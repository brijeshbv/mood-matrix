import Link from "next/link"
import React from 'react'

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import myImg from "@/public/img.png"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <img src="img.png" />
      </div>
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Welcome to Mood Matrix, your ultimate productivity companion!
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Unlock your full potential at work by understanding and managing your
          emotions with Mood Matrix. Embrace a happier, healthier, and more
          productive work environment. Sign up today and experience the
          transformative power of Mood Matrix!
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          Documentation
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          GitHub
        </Link>
      </div>
    </section>
  )
}
