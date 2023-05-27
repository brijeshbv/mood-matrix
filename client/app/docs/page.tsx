import React from 'react'

export default function Docs() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Mood Matrix Documentation
        </h1>
      </div>
      <div className="items-left container flex flex-col gap-4 p-4 ">
        <h2>Table of Contents:</h2>
        <ol className="list-decimal pl-6">
          <li>Introduction</li>
          <li>
            Getting Started
            <ol>
              <li>Creating an Account</li>
              <li>Logging In</li>
            </ol>
          </li>
          <li>
            Sentiment Analysis
            <ol className="list-decimal pl-6">
              <li>Understanding Sentiment Analysis Results</li>
              <li>Reviewing your day</li>
              <li>Adding Notes and Context</li>
            </ol>
          </li>
          <li>
            Personalized Coaching
            <ol className="list-decimal pl-6">
              <li>Understanding Coaching Recommendations</li>
            </ol>
          </li>
          <li>
            Team Collaboration
            <ol className="list-decimal pl-6">
              <li>Creating and Managing Groups</li>
              <li>Sharing Mood Insights with Team Members</li>
            </ol>
          </li>
          <li>Progress Visualization</li>
          <li>Integration and Accessibility</li>
          <li>Troubleshooting</li>
          <li>Frequently Asked Questions (FAQ)</li>
          <li>Contact and Support</li>
        </ol>

        <h2>1. Introduction:</h2>
        <p>
          Mood Matrix is a productivity app designed to help you analyze and
          manage your daily workday sentiments. By tracking your emotions, Mood
          Matrix provides valuable insights into your mood patterns and offers
          personalized recommendations to enhance your productivity and overall
          well-being.
        </p>

        <h2>2. Getting Started:</h2>
        <h3>2.1 Creating an Account:</h3>
        <p>
          To get started with Mood Matrix, visit our website and click on the
          &quot;Sign Up&quot; button. Fill in the required information, such as
          your name, email address, and password, and follow the instructions to
          create your account.
        </p>

        <h3>2.2 Logging In:</h3>
        <p>
          Once you have created your account, you can log in by visiting the
          Mood Matrix website and clicking on the &quot;Log In&quot; button.
          Enter your email address and password to access your account.
        </p>
      </div>
    </section>
  )
}
