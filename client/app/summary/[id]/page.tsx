export default function Page({ params }: { params: { id: string } }) {
  console.log(params.id)
  return (
    <div className="flex flex-1 flex-row">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
        Summary for {params.id}
      </h1>
    </div>
  )
}
