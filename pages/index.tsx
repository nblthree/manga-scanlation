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

const getMaxDisplaySize = (canvas: HTMLCanvasElement) => {
  const maxDisplayWidth =
    (canvas.parentElement?.parentElement?.offsetWidth || 0) - 16 * 2
  const maxDisplayHeight =
    (canvas.parentElement?.parentElement?.offsetHeight || 0) - 16 * 2

  return { maxDisplayHeight, maxDisplayWidth }
}

const cursor = (tool: string): string => {
  const c: any = {
    Move: 'cursor-move',
    'Zoom In': 'cursor-zoom-in',
    'Zoom Out': 'cursor-zoom-out',
    none: '',
    Select: 'cursor-crosshair',
    Erase: 'cursor-none',
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
    initialPosition: { x: 0, y: 0 },
    endPosition: { x: 0, y: 0 },
    onCanvas: false,
    rubberRadius: 20,
  })
  const [styles, setStyles] = useState({
    bg: '#ffffff',
    color: '#000000',
    text: 'align-left',
  })
  const [history] = useState<{
    list: ImageData[]
    index: number
    time: number
  }>({ list: [], index: -1, time: 0 })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = canvasRef?.current

  const drawLastImageData = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.putImageData(history.list[history.index], 0, 0)
  }

  const drawDashedRect = ({
    x,
    y,
    width,
    height,
  }: {
    x: number
    y: number
    width: number
    height: number
  }) => {
    if (!canvas) return
    drawLastImageData()
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.lineWidth = 3
    ctx.setLineDash([6])
    ctx.strokeRect(x, y, width, height)
  }

  const drawRubber = ({ x, y }: { x: number; y: number }) => {
    if (!canvas) return
    drawLastImageData()
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(x, y, data.rubberRadius, 0, 2 * Math.PI)
    ctx.stroke()
  }

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
        saveCanvas()
      }
      img.src = imageURL
    }
  }, [imageURL, canvas])

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
    return cursorPosition
  }

  const getCanvasPosition = (e: MouseEvent) => {
    if (tool !== 'Move' || !canvas || !detectLeftButton(e)) return

    const { maxDisplayWidth, maxDisplayHeight } = getMaxDisplaySize(canvas)

    const minX = maxDisplayWidth - data.width * data.zoom
    const minY = maxDisplayHeight - data.height * data.zoom
    const x = data.canvasPosition.x + (e.pageX - data.mouseDown.x)
    const y = data.canvasPosition.y + (e.pageY - data.mouseDown.y)

    return {
      x: minX < 0 ? Math.max(Math.min(0, x), minX) : minX / 2,
      y: minY < 0 ? Math.max(Math.min(0, y), minY) : minY / 2,
    }
  }

  const erase = (ev: MouseEvent) => {
    if (!canvas) return
    const { x, y } = getCursorPosition(ev) as { x: number; y: number }
    drawLastImageData()
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = styles.bg
    ctx.beginPath()
    ctx.arc(x, y, data.rubberRadius, 0, 2 * Math.PI)
    ctx.fill()
    saveCanvas()
  }

  const handleMoving = (ev: MouseEvent) => {
    if (!imageURL) return
    ev.preventDefault()
    const cursorPosition = getCursorPosition(ev)
    const canvasPosition = data.onCanvas
      ? getCanvasPosition(ev)
      : data.canvasPosition
    setData({
      ...data,
      ...(cursorPosition ? { cursorPosition } : {}),
      ...(canvasPosition ? { canvasPosition } : {}),
      mouseDown: { x: ev.pageX, y: ev.pageY },
    })
    if (canvas && cursorPosition && data.onCanvas && tool === 'Select') {
      const x = Math.min(data.initialPosition.x, cursorPosition.x)
      const y = Math.min(data.initialPosition.y, cursorPosition.y)
      drawDashedRect({
        x,
        y,
        width: Math.abs(data.initialPosition.x - cursorPosition.x),
        height: Math.abs(data.initialPosition.y - cursorPosition.y),
      })
    }
    if (tool === 'Erase' && canvas && cursorPosition) {
      if (data.onCanvas && detectLeftButton(ev)) {
        erase(ev)
      }
      drawRubber(cursorPosition)
    }
  }

  const saveCanvas = () => {
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const canvasData = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height
    )
    const dt = Date.now() - history.time
    if (dt < 5000) {
      history.list[history.index] = canvasData
      history.time = Date.now()
    } else {
      history.list.push(canvasData)
      history.time = Date.now()
      history.index += 1
    }
  }

  const handleMouseDown = (ev: MouseEvent) => {
    if ((ev.target as HTMLElement).id !== 'canvas') return
    setData({
      ...data,
      initialPosition: getCursorPosition(ev) as { x: number; y: number },
      mouseDown: { x: ev.pageX, y: ev.pageY },
      onCanvas: true,
    })
  }

  const handleMouseUp = (ev: MouseEvent) => {
    setData({
      ...data,
      onCanvas: false,
      endPosition: getCursorPosition(ev) as { x: number; y: number },
    })
  }

  const handleMouseLeave = () => {
    if (tool !== 'Erase') return
    drawLastImageData()
  }

  useEffect(() => {
    if (!canvas) return

    canvas.addEventListener('mousemove', handleMoving)
    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      canvas.removeEventListener('mousemove', handleMoving)
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  })

  return (
    <Layout title="Manga Scanlation">
      <div className="wrap h-full w-full">
        <TopMenu setImageURL={setImageURL} />
        <LeftBar setTool={setTool} tool={tool} />
        <TopBar styles={styles} setStyles={setStyles} />
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
