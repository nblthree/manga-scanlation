import { NextPage } from 'next'
import Layout from '../components/Layout'
import TopMenu from '../components/TopMenu'
import LeftBar from '../components/LeftBar'
import TopBar from '../components/TopBar'
import RightBar from '../components/RightBar'
import BottomBar from '../components/BottomBar'
import { useEffect, useState, useRef } from 'react'

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
  const rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
    scaleY = canvas.height / rect.height // relationship bitmap vs. element for Y

  return {
    x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY, // been adjusted to be relative to element
  }
}

const cursor = (tool: string): string => {
  const c: any = {
    Move: 'cursor-move',
    'Zoom In': 'cursor-zoom-in',
    'Zoom Out': 'cursor-zoom-out',
    none: '',
  }
  return c[tool] || ''
}

function detectLeftButton(evt: MouseEvent) {
  evt = evt || window.event
  if ('buttons' in evt) {
    return evt.buttons == 1
  }
  const button = (evt as MouseEvent).which || (evt as MouseEvent).button
  return button == 1
}

const IndexPage: NextPage = () => {
  const [imageURL, setImageURL] = useState('')
  const [tool, setTool] = useState('none')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = canvasRef?.current
  const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D
  const w = ctx?.canvas.width
  const h = ctx?.canvas.height

  useEffect(() => {
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

  const [data, setData] = useState({
    width: 0,
    height: 0,
    maxDisplayWidth: 0,
    maxDisplayHeight: 0,
    canvasPosition: { x: 0, y: 0 },
    cursorPosition: { x: 0, y: 0 },
  })
  const [zoom, setZoom] = useState(1)

  const handleZooming = (arg: string) => {
    const minZoom = data.maxDisplayWidth / data.width / 2
    let z = zoom
    if (arg === 'Zoom In') {
      z = zoom + 0.05
      if (z > data.width / data.maxDisplayWidth)
        z = data.width / data.maxDisplayWidth
    } else if (arg === 'Zoom Out') {
      z = zoom - 0.05
      if (z < minZoom) z = minZoom
    }
    setZoom(z)
  }

  useEffect(() => {
    if (canvas) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      //const displayWidth = canvas.offsetWidth
      //const displayHeight = canvas.offsetHeight
      const maxDisplayWidth =
        (canvas.parentElement?.parentElement?.offsetWidth || 0) - 16 * 2
      const maxDisplayHeight =
        (canvas.parentElement?.parentElement?.offsetHeight || 0) - 16 * 2
      setData({ ...data, width, height, maxDisplayWidth, maxDisplayHeight })
    }
  }, [w, h])

  const getCursorPosition = (ev: MouseEvent) => {
    if (!canvas) return {}
    const cursorPosition = getMousePos(canvas, ev)
    return { cursorPosition }
  }

  const getCanvasPosition = (e: MouseEvent) => {
    if (tool !== 'Move' || !canvas || !detectLeftButton(e)) return {}

    const minX = data.maxDisplayWidth - canvas.offsetWidth
    const minY = data.maxDisplayHeight - canvas.offsetHeight
    const x = data.canvasPosition.x + e.movementX
    const y = data.canvasPosition.y + e.movementY

    return {
      canvasPosition: {
        x: Math.max(Math.min(0, x), minX),
        y: Math.max(Math.min(0, y), minY),
      },
    }
  }

  const handleMoving = (ev: MouseEvent) => {
    const cursorPosition = getCursorPosition(ev)
    const canvasPosition = getCanvasPosition(ev)
    setData({ ...data, ...cursorPosition, ...canvasPosition })
  }

  useEffect(() => {
    if (!canvas) return

    canvas.addEventListener('mousemove', handleMoving)
    return () => {
      canvas.removeEventListener('mousemove', handleMoving)
    }
  })

  return (
    <Layout title="Manga Scanlation">
      <div className="wrap h-full w-full">
        <TopMenu setImageURL={setImageURL} />
        <LeftBar setTool={setTool} tool={tool} />
        <TopBar />
        <RightBar />
        <div className="Main flex p-4">
          <div
            className={
              imageURL ? `m-auto overflow-hidden flex w-full h-full` : ``
            }
          >
            <canvas
              onClick={() => {
                if (tool === 'Zoom In' || tool === 'Zoom Out') {
                  handleZooming(tool)
                }
              }}
              ref={canvasRef}
              className={`m-auto ${cursor(tool)}`}
              style={{
                width: `${100 * zoom}%`,
                transform: `translate(${data.canvasPosition.x}px, ${data.canvasPosition.y}px)`,
              }}
            />
          </div>
        </div>
        <BottomBar
          cursorPosition={data.cursorPosition}
          canvasPosition={data.canvasPosition}
        />
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
          .Main {
            grid-area: main;
          }
        `}</style>
      </div>
    </Layout>
  )
}

export default IndexPage
