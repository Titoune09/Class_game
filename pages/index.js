import Head from 'next/head'
import FunSite from '../components/FunSite'

export default function Home() {
  return (
    <>
      <Head>
        <title>Mini-jeux discrets</title>
        <meta name="description" content="Collection de mini-jeux discrets pour les cours" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕹️</text></svg>" />
      </Head>
      <FunSite />
    </>
  )
}