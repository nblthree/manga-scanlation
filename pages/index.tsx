import { NextPage } from 'next'
import Layout from '../components/Layout'
import TopMenu from '../components/TopMenu'
import LeftBar from '../components/LeftBar'
import TopBar from '../components/TopBar'
import RightBar from '../components/RightBar'
import Main from '../components/Main'
import { useEffect, useState, useRef } from 'react'

const IndexPage: NextPage = () => {
  const [imageURL, setImageURL] = useState('')
  const [tool, setTool] = useState('none')

  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const img = new Image()
      img.onload = function () {
        ctx.canvas.width = img.width
        ctx.canvas.height = img.height

        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
      }
      img.src = imageURL
    }
  }, [imageURL])

  return (
    <Layout title="Manga Scanlation">
      <div className="wrap h-full w-full">
        <TopMenu setImageURL={setImageURL} />
        <LeftBar setTool={setTool} tool={tool} />
        <TopBar />
        <RightBar />
        <Main canvasRef={canvasRef} image={imageURL} tool={tool} />
        <style jsx>{`
          .wrap {
            display: grid;
            grid-template-columns: 30px calc(100% - 380px) 350px;
            grid-template-rows: 20px 30px calc(100% - 70px) 20px;
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
