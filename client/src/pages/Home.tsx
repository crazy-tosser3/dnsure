import TestForm from "@/widgets/TestForm"

const Home = () => {
  return (
    <main className="flex flex-col gap-16 items-center py-8 px-4">
      <h1 className="text-2xl md:text-3xl lg:text-4xl">Проверим, работает ли</h1>
      <TestForm />
    </main>
  )
}

export default Home