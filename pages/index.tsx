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
  const [data, setData] = useState({
    width: 0,
    height: 0,
    canvasPosition: { x: 0, y: 0 },
    cursorPosition: { x: 0, y: 0 },
    zoom: 0.5,
    mouseDown: { x: 0, y: 0 },
    onCanvas: false,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = canvasRef?.current

  useEffect(() => {
    if (canvas) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const img = new Image()
      img.onload = function () {
        ctx.canvas.width = img.width
        ctx.canvas.height = img.height
        const { maxDisplayWidth, maxDisplayHeight } = getMaxDisplaySize(canvas)
        setData({
          ...data,
          width: img.width,
          height: img.height,
          canvasPosition: {
            x: (maxDisplayWidth - 0.5 * img.width) / 2,
            y: (maxDisplayHeight - 0.5 * img.height) / 2,
          },
        })
        ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
      }
      img.src = imageURL
    }
  }, [imageURL, canvas])

  const getMaxDisplaySize = (canvas: HTMLCanvasElement) => {
    const maxDisplayWidth =
      (canvas.parentElement?.parentElement?.offsetWidth || 0) - 16 * 2
    const maxDisplayHeight =
      (canvas.parentElement?.parentElement?.offsetHeight || 0) - 16 * 2

    return { maxDisplayHeight, maxDisplayWidth }
  }

  const handleZooming = (arg: string) => {
    if (!canvas) return
    const { maxDisplayWidth, maxDisplayHeight } = getMaxDisplaySize(canvas)
    const minZoom = Math.min(
      maxDisplayWidth / data.width,
      maxDisplayHeight / (data.width * (data.height / data.width))
    )
    let z = data.zoom
    if (arg === 'Zoom In') {
      z = data.zoom + 0.05
      if (z > 1) z = 1
    } else if (arg === 'Zoom Out') {
      z = data.zoom - 0.05
      if (z < minZoom) z = minZoom
    }

    const x = maxDisplayWidth - z * data.width
    const y = maxDisplayHeight - z * data.height
    setData({
      ...data,
      zoom: z,
      canvasPosition: {
        x: x / 2,
        y: y / 2,
      },
    })
  }

  const getCursorPosition = (ev: MouseEvent) => {
    if (!canvas) return
    const cursorPosition = getMousePos(canvas, ev)
    return { cursorPosition }
  }

  const getCanvasPosition = (e: MouseEvent) => {
    if (tool !== 'Move' || !canvas || !detectLeftButton(e)) return

    const { maxDisplayWidth, maxDisplayHeight } = getMaxDisplaySize(canvas)

    const minX = maxDisplayWidth - canvas.offsetWidth
    const minY = maxDisplayHeight - canvas.offsetHeight
    const x = data.canvasPosition.x + (e.pageX - data.mouseDown.x)
    const y = data.canvasPosition.y + (e.pageY - data.mouseDown.y)

    return {
      canvasPosition: {
        x: Math.max(Math.min(0, x), minX),
        y: Math.max(Math.min(0, y), minY),
      },
    }
  }

  const handleMoving = (ev: MouseEvent) => {
    ev.preventDefault()
    const cursorPosition = getCursorPosition(ev) || {}
    const canvasPosition = data.onCanvas ? getCanvasPosition(ev) || {} : {}
    setData({
      ...data,
      ...cursorPosition,
      ...canvasPosition,
      mouseDown: { x: ev.pageX, y: ev.pageY },
    })
  }

  const handleMouseDown = (ev: MouseEvent) => {
    if ((ev.target as HTMLElement).id !== 'canvas') return
    setData({
      ...data,
      mouseDown: { x: ev.pageX, y: ev.pageY },
      onCanvas: true,
    })
  }
  const handleMouseUp = () => {
    setData({ ...data, onCanvas: false })
  }

  useEffect(() => {
    if (!canvas) return

    canvas.addEventListener('mousemove', handleMoving)
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    return () => {
      canvas.removeEventListener('mousemove', handleMoving)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
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
              id="canvas"
              onClick={() => {
                if (tool === 'Zoom In' || tool === 'Zoom Out') {
                  handleZooming(tool)
                }
              }}
              ref={canvasRef}
              className={`m-auto ${cursor(tool)} origin-top-left`}
              style={{
                //width: `${data.width * data.zoom}px`,
                transform: `translate(${data.canvasPosition.x}px, ${data.canvasPosition.y}px) scale(${data.zoom})`,
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
