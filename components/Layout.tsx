import * as React from 'react'
import Head from 'next/head'
import TopMenu from './TopMenu'

const Layout: React.FunctionComponent<{
  title: string
}> = ({ title = 'Home' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="wrapper h-full w-full">
        <TopMenu />
      </div>
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
          display: grid;
          grid-template-columns: 40px auto 350px;
          grid-template-rows: 20px 40px auto 20px;
          grid-template-areas:
            'topMenu topMenu topMenu'
            'topBar topBar rightBarMenu'
            'leftBar main rightBar'
            'leftBar bottomBar bottomBar';
          background-color: #181818;
        }
      `}</style>
    </>
  )
}

export default Layout
