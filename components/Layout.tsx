import * as React from 'react'
import Head from 'next/head'

const Layout: React.FunctionComponent<{
  title: string
}> = ({ title = 'Home' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="wrapper"></div>
      <style jsx>{`
        .wrapper {
          display: grid;
        }
      `}</style>
    </>
  )
}

export default Layout
