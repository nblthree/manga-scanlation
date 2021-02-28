import { FunctionComponent } from 'react'
import Head from 'next/head'

const Layout: FunctionComponent<{
  title: string
}> = ({ title = 'Manga scanlation', children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="wrapper h-full w-full">{children}</div>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }
        #__next {
          width: 100%;
          height: 100%;
        }
        .wrapper {
          background-color: #001818;

          --icon-color: #ffffff;
          --icon-size: 1rem;
        }
      `}</style>
    </>
  )
}

export default Layout
