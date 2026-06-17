import { toFetchData } from "@/shared/config"

const About = () => {
  return (
    <div className="flex flex-col gap-4 max-w-150 m-auto items-center py-8 px-4">
      <h1 className="text-2xl">Добро пожаловать на DNSure!</h1>
      <p>
        Этот сайт - DNS-резолвер. Он позволяет проверить работоспособность какого-либо сайта из различных стран. Здесь можно тестировать не только доменные имена, но и Ваши серверы по IP.
      </p>
      <h2 className="text-xl">Почему мы?</h2>
      <p>
        DNSure, в отличии от таких сайтов как downdetector, ориентируется не на отзывы пользователей, которых может быть недостаточно в колличестве и которые приходят с задержкой, а на прямые запросы к сайту. Сайт отправляет следующие запросы: 
      </p>
      <ul className="w-full">
        {toFetchData.map((item:string, index:number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p>
        что позволяет пользователю с точностью определить доступен ли сайт из его страны или нет. 
      </p>
    </div>
  )
}

export default About