import { FunctionComponent } from 'react'
import Head from 'next/head'
import TopMenu from './TopMenu'
import LeftBar from './LeftBar'
import TopBar from './TopBar'
import RightBar from './RightBar'
import BottomBar from './BottomBar'

const Layout: FunctionComponent<{
  title: string
}> = ({ title = 'Home' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="wrapper h-full w-full">
        <TopMenu />
        <LeftBar />
        <TopBar />
        <RightBar />
        <BottomBar />
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
          grid-template-columns: 30px auto 350px;
          grid-template-rows: 20px 30px auto 20px;
          grid-template-areas:
            'topMenu topMenu topMenu'
            'topBar topBar rightBar'
            'leftBar main rightBar'
            'leftBar bottomBar bottomBar';
          background-color: #181818;
          gap: 1px;

          --icon-color: #f0f0f0;
        }
      `}</style>
    </>
  )
}

export default Layout
