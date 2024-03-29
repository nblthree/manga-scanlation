import { NextPage } from 'next'
import Layout from '../components/Layout'
import TopMenu from '../components/TopMenu'
import LeftBar from '../components/LeftBar'
import TopBar from '../components/TopBar'
import RightBar from '../components/RightBar'
import BottomBar from '../components/BottomBar'
import { useEffect, useState, useRef } from 'react'
import { rgba2hex } from '../utils'
import { useHotkeys } from 'react-hotkeys-hook'

function getMousePos(
  canvas: HTMLCanvasElement,
  evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) {
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
    Type: 'cursor-text',
  }
  return c[tool] || ''
}

function detectLeftButton(
  evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) {
  evt = evt || window.event
  if ('buttons' in evt) {
    return evt.buttons == 1
  }
  const button =
    (evt as unknown as MouseEvent).which ||
    (evt as unknown as MouseEvent).button
  return button == 1
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number,
  lineHeight: number
) {
  let dx = 0
  if (['end', 'right'].includes(ctx.textAlign)) {
    dx = maxWidth
  } else if (ctx.textAlign === 'center') {
    dx = maxWidth / 2
  }
  const lines = text.split('\n')
  const startingY = y
  for (let i = 0; i < lines.length; i++) {
    const words = lines[i].split(' ')
    let line = ''

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        if (y + lineHeight > maxHeight + startingY) break
        ctx.fillText(line, x + dx, y + lineHeight)
        line = words[n] + ' '
        y += lineHeight
      } else {
        line = testLine
      }
    }
    if (y + lineHeight > maxHeight + startingY) break
    ctx.fillText(line, x + dx, y + lineHeight)
    y += lineHeight
  }
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
    rubberRadius: 20,
  })
  const [styles, setStyles] = useState<{
    bg: string
    textColor: string
    textFont: string
    textSize: string
    textAlign: 'left' | 'right' | 'center' | 'start' | 'end'
  }>({
    bg: '#ffffff',
    textColor: '#000000',
    textFont: 'serif',
    textSize: '40',
    textAlign: 'left',
  })
  const [history] = useState<{
    list: ImageData[]
    index: number
    time: number
  }>({ list: [], index: -1, time: 0 })
  const [writingData, setWritingData] = useState<{
    imgData: ImageData
    text: string
  }>()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = canvasRef?.current

  const drawLastImageData = () => {
    const c = canvas || (document.getElementById('canvas') as HTMLCanvasElement)
    if (!c || !history.list[history.index]?.data) return
    const ctx = c.getContext('2d') as CanvasRenderingContext2D
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

  const drawStar = ({
    cx,
    cy,
    spikes,
    outerRadius,
    innerRadius,
  }: {
    cx: number
    cy: number
    spikes: number
    outerRadius: number
    innerRadius: number
  }) => {
    if (!canvas) return
    drawLastImageData()
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    ctx.lineWidth = 3
    ctx.setLineDash([])

    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.lineWidth = 5
    ctx.strokeStyle = styles.textColor
    ctx.stroke()
    ctx.fillStyle = styles.bg
    ctx.fill()
  }

  const drawHeart = ({
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
    ctx.setLineDash([])
    ctx.beginPath()
    const topCurveHeight = height * 0.3
    ctx.moveTo(x, y + topCurveHeight)
    // top left curve
    ctx.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight)

    // bottom left curve
    ctx.bezierCurveTo(
      x - width / 2,
      y + (height + topCurveHeight) / 2,
      x,
      y + (height + topCurveHeight) / 2,
      x,
      y + height
    )

    // bottom right curve
    ctx.bezierCurveTo(
      x,
      y + (height + topCurveHeight) / 2,
      x + width / 2,
      y + (height + topCurveHeight) / 2,
      x + width / 2,
      y + topCurveHeight
    )

    // top right curve
    ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight)

    ctx.closePath()
    ctx.fillStyle = styles.bg
    ctx.strokeStyle = styles.textColor
    ctx.fill()
    ctx.stroke()
  }

  useEffect(() => {
    if (!canvas || !imageURL) return

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const img = new Image()
    img.onload = function () {
      ctx.canvas.width = img.width
      ctx.canvas.height = img.height
      const { maxDisplayWidth, maxDisplayHeight } = getMaxDisplaySize(canvas)
      const minZoom = Math.min(
        maxDisplayWidth / img.width,
        maxDisplayHeight / (img.width * (img.height / img.width))
      )
      const canvasPosition = {
        x: (maxDisplayWidth - minZoom * img.width) / 2,
        y: (maxDisplayHeight - minZoom * img.height) / 2,
      }
      setData({
        ...data,
        width: img.width,
        height: img.height,
        canvasPosition,
        zoom: minZoom,
      })
      ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height)
      saveCanvas()
    }
    img.src = imageURL
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

    let y = data.canvasPosition.y - ((z - data.zoom) * data.height) / 2
    if (y > 0) {
      y = 0
    } else if (y < maxDisplayHeight - data.height * z) {
      y = maxDisplayHeight - data.height * z
    }

    let x = data.canvasPosition.x - ((z - data.zoom) * data.width) / 2
    if (x > 0) {
      x = 0
    } else if (x < maxDisplayWidth - data.width * z) {
      x = maxDisplayWidth - data.width * z
    }

    const mx = maxDisplayWidth - z * data.width
    const my = maxDisplayHeight - z * data.height
    setData({
      ...data,
      zoom: z,
      canvasPosition: {
        x: mx > 0 ? mx / 2 : x,
        y: my > 0 ? my / 2 : y,
      },
    })
  }

  const getCursorPosition = (
    ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!canvas) return
    const cursorPosition = getMousePos(canvas, ev)
    return cursorPosition
  }

  const getCanvasPosition = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
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

  const pickColor = (ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (tool !== 'Picker') return
    const cursorPosition = getCursorPosition(ev)
    if (!cursorPosition || !canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const p = ctx.getImageData(cursorPosition.x, cursorPosition.y, 1, 1).data
    const hex = rgba2hex({ r: p[0], g: p[1], b: p[2] })

    setStyles({ ...styles, bg: hex })
  }

  const erase = (ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
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
    if (dt < 500) {
      history.list[history.index] = canvasData
      history.time = Date.now()
    } else {
      history.list.splice(history.index + 1, history.list.length)
      history.list.push(canvasData)
      history.time = Date.now()
      history.index += 1
    }
  }

  const drawShape = (
    tool: string,
    para: {
      x: number
      y: number
      width: number
      height: number
    }
  ) => {
    if (tool === 'Heart') {
      drawHeart(para)
    } else if (tool === 'Star') {
      drawStar({
        cx: para.x + para.width / 2,
        cy: para.y + para.height / 2,
        spikes: 5,
        outerRadius: 1 * para.width,
        innerRadius: 0.5 * para.width,
      })
    }
  }

  const handleMoving = (
    ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (data.width === 0) return
    ev.preventDefault()
    const cursorPosition = getCursorPosition(ev)
    const canvasPosition = getCanvasPosition(ev)
    setData({
      ...data,
      ...(cursorPosition ? { cursorPosition } : {}),
      ...(canvasPosition ? { canvasPosition } : {}),
      mouseDown: { x: ev.pageX, y: ev.pageY },
    })
    if (
      canvas &&
      cursorPosition &&
      (tool === 'Select' ||
        tool === 'Type' ||
        tool === 'Heart' ||
        tool === 'Star') &&
      detectLeftButton(ev)
    ) {
      const x = Math.min(data.initialPosition.x, cursorPosition.x)
      const y = Math.min(data.initialPosition.y, cursorPosition.y)
      const width = Math.abs(data.initialPosition.x - cursorPosition.x)
      const height = Math.abs(data.initialPosition.y - cursorPosition.y)
      const para = {
        x,
        y,
        width,
        height,
      }
      drawDashedRect(para)
      if (tool === 'Heart' || tool === 'Star')
        drawShape(tool, {
          x: para.x,
          y: para.y,
          width: Math.max(para.width, para.height),
          height: Math.max(para.width, para.height),
        })
    }
    if (tool === 'Erase' && canvas && cursorPosition) {
      if (detectLeftButton(ev)) {
        erase(ev)
      }
      drawRubber(cursorPosition)
    }
  }

  const handleShortcuts = (ev: KeyboardEvent) => {
    if (ev.key === 'Backspace' && tool === 'Select' && canvas) {
      drawLastImageData()
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.fillStyle = styles.bg
      const x = Math.min(data.initialPosition.x, data.endPosition.x)
      const y = Math.min(data.initialPosition.y, data.endPosition.y)
      ctx.fillRect(
        x,
        y,
        Math.abs(data.initialPosition.x - data.endPosition.x),
        Math.abs(data.initialPosition.y - data.endPosition.y)
      )
      saveCanvas()
    }
  }

  const renderText = () => {
    if (!canvas || !writingData?.text) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const x = Math.min(data.initialPosition.x, data.endPosition.x)
    const y = Math.min(data.initialPosition.y, data.endPosition.y)
    const width = Math.abs(data.initialPosition.x - data.endPosition.x)
    const height = Math.abs(data.initialPosition.y - data.endPosition.y)
    ctx.putImageData(writingData.imgData, x, y)

    ctx.fillStyle = styles.textColor
    ctx.textAlign = styles.textAlign
    ctx.font = `${styles.textSize}px ${styles.textFont}`
    wrapText(
      ctx,
      writingData.text,
      x,
      y,
      width,
      height,
      ctx.measureText('M').width * 1.2
    )
  }

  const write = (e: React.KeyboardEvent) => {
    if (!canvas || !writingData?.imgData || e.ctrlKey) return
    const array = writingData.text.split('')
    if (e.key === 'Enter') {
      array.push('\n')
    } else {
      array.push(e.key)
    }
    writingData.text = array.join('')
    renderText()
  }
  const past = async (e: any) => {
    if(e.ctrlKey && e.key === 'v') {
      if (!canvas || !writingData?.imgData) return
      const text = await navigator.clipboard.readText()
      const array = writingData.text.split('')
      if(!text) return
      array.push(...text.split(''))
      writingData.text = array.join('')
      renderText()
    }
  }
  const writeKeyUp = (e: React.KeyboardEvent) => {
    past(e)
    if (!canvas || !writingData?.imgData || e.ctrlKey) return
    if (e.key === 'Backspace') {
      const array = writingData.text.split('')
      if (writingData.text.endsWith('\n')) array.pop()
      array.pop()
      writingData.text = array.join('')
      renderText()
    }
  }

  const saveAfterText = () => {
    drawLastImageData()
    if (writingData?.text) {
      renderText()
      saveCanvas()
      writingData.text = ''
    }
  }

  useEffect(() => {
    window.addEventListener('keyup', handleShortcuts)
    return () => {
      window.removeEventListener('keyup', handleShortcuts)
    }
  })

  useEffect(() => {
    if (['Erase', 'Type', 'Select', 'none', 'Heart', 'Star'].includes(tool)) {
      drawLastImageData()
      setData({
        ...data,
        initialPosition: { x: 0, y: 0 },
        endPosition: { x: 0, y: 0 },
      })
    }
  }, [tool])

  useEffect(() => {
    if (writingData?.text) {
      renderText()
    }
  }, [styles])

  const save = (event: KeyboardEvent | void) => {
    if (event) event.preventDefault()
    if (!document || history.list.length === 0) return
    const c = canvas || (document.getElementById('canvas') as HTMLCanvasElement)
    const link = document.createElement('a')
    link.setAttribute('download', 'scan.jpg')
    link.setAttribute(
      'href',
      c.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream')
    )
    link.click()
  }

  const undo = (event: KeyboardEvent | void) => {
    if (event) event.preventDefault()
    if (history.index === 0) return
    history.index -= 1
    drawLastImageData()
  }

  const redo = (event: KeyboardEvent | void) => {
    if (event) event.preventDefault()
    if (history.index === history.list.length - 1) return
    history.index += 1
    drawLastImageData()
  }

  useHotkeys('Ctrl+z', undo)
  useHotkeys('Ctrl+y', redo)
  useHotkeys('Ctrl+s', save)

  return (
    <Layout title="Manga Scanlation">
      <div className="wrap h-full w-full">
        <TopMenu
          setImageURL={setImageURL}
          save={save}
          undo={undo}
          redo={redo}
        />
        <LeftBar setTool={setTool} tool={tool} />
        <TopBar styles={styles} setStyles={setStyles} />
        <RightBar />
        <div
          className="Main flex p-4"
          onClick={() => {
            canvas?.focus()
          }}
        >
          <div
            className={
              imageURL ? `m-auto overflow-hidden flex w-full h-full` : ``
            }
          >
            <canvas
              id="canvas"
              onClick={(e) => {
                if (tool === 'Zoom In' || tool === 'Zoom Out') {
                  handleZooming(tool)
                }
                pickColor(e)
              }}
              onMouseLeave={() => {
                if (tool !== 'Erase') return
                drawLastImageData()
              }}
              onMouseUp={(e) => {
                let endPosition = data.endPosition
                if (
                  tool === 'Type' ||
                  tool === 'Select' ||
                  tool === 'Heart' ||
                  tool === 'Star'
                ) {
                  endPosition = getCursorPosition(e) as { x: number; y: number }
                  if (
                    (tool === 'Type' || tool === 'Heart' || tool === 'Star') &&
                    canvas
                  ) {
                    drawLastImageData()
                    const ctx = canvas.getContext(
                      '2d'
                    ) as CanvasRenderingContext2D
                    const x = Math.min(data.initialPosition.x, endPosition.x)
                    const y = Math.min(data.initialPosition.y, endPosition.y)
                    const width = Math.abs(
                      data.initialPosition.x - endPosition.x
                    )
                    const height = Math.abs(
                      data.initialPosition.y - endPosition.y
                    )
                    if (width === 0 || height === 0) return
                    if (tool === 'Type') {
                      const imgData = ctx.getImageData(x, y, width, height)
                      setWritingData({
                        imgData,
                        text: '',
                      })
                      drawDashedRect({
                        x,
                        y,
                        width,
                        height,
                      })
                    } else {
                      drawShape(tool, {
                        x: x,
                        y: y,
                        width: Math.max(width, height),
                        height: Math.max(width, height),
                      })
                      saveCanvas()
                    }
                  }
                }
                setData({
                  ...data,
                  endPosition,
                })
              }}
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).id !== 'canvas') return
                saveAfterText()
                setData({
                  ...data,
                  initialPosition: getCursorPosition(e) as {
                    x: number
                    y: number
                  },
                  mouseDown: { x: e.pageX, y: e.pageY },
                })
              }}
              onMouseMove={handleMoving}
              onKeyPress={write}
              onKeyUp={writeKeyUp}
              tabIndex={1}
              ref={canvasRef}
              className={`m-auto ${cursor(tool)} origin-top-left`}
              style={{
                transform: `translate(${data.canvasPosition.x}px, ${data.canvasPosition.y}px) scale(${data.zoom})`,
              }}
            />
          </div>
        </div>
        <BottomBar
          cursorPosition={data.cursorPosition}
          dashedRectData={{
            width: Math.abs(data.initialPosition.x - data.endPosition.x),
            height: Math.abs(data.initialPosition.y - data.endPosition.y),
          }}
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
