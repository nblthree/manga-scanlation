import { NextPage } from 'next'
import Layout from '../components/Layout'
import TopMenu from '../components/TopMenu'
import LeftBar from '../components/LeftBar'
import TopBar from '../components/TopBar'
import RightBar from '../components/RightBar'
import BottomBar from '../components/BottomBar'

const IndexPage: NextPage = () => {
  return (
    <Layout title="Manga Scanlation">
      <div className="wrap h-full w-full">
        <TopMenu />
        <LeftBar />
        <TopBar />
        <RightBar />
        <BottomBar />
        <style jsx>{`
          .wrap {
            display: grid;
            grid-template-columns: 30px auto 350px;
            grid-template-rows: 20px 30px auto 20px;
            grid-template-areas:
              'topMenu topMenu topMenu'
              'topBar topBar rightBar'
              'leftBar main rightBar'
              'leftBar bottomBar bottomBar';
            gap: 1px;
          }
        `}</style>
      </div>
    </Layout>
  )
}

export default IndexPage
