import { App } from '@/components/App'
import { getCars, getCarsByDecade } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [cars, carsByDecade] = await Promise.all([getCars(), getCarsByDecade()])
  return <App cars={cars} carsByDecade={carsByDecade} />
}
