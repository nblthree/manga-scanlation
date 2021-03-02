import { FunctionComponent, RefObject, useEffect, useState } from 'react'

const Main: FunctionComponent<{
  canvasRef: RefObject<HTMLCanvasElement> | null
  image: string
  tool: string
}> = ({ canvasRef, image, tool }) => {
  const [data, setData] = useState({
    width: 0,
    height: 0,
    maxDisplayWidth: 0,
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

  const canvas = canvasRef?.current
  const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D
  const w = ctx?.canvas.width
  const h = ctx?.canvas.height
  useEffect(() => {
    if (canvas) {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const width = ctx.canvas.width
      const height = ctx.canvas.height
      //const displayWidth = canvas.offsetWidth
      //const displayHeight = canvas.offsetHeight
      const maxDisplayWidth =
        (canvas.parentElement?.parentElement?.offsetWidth || 40) - 40
      setData({ ...data, width, height, maxDisplayWidth })
    }
  }, [w, h])

  return (
    <div className="Main flex p-8">
      <div className={image ? `p-2 m-auto overflow-hidden flex` : ``}>
        <canvas
          onClick={() => {
            if (tool === 'Zoom In' || tool === 'Zoom Out') {
              handleZooming(tool)
            }
          }}
          ref={canvasRef}
          className="m-auto"
          style={{ width: `${100 * zoom}%` }}
        />
      </div>
      <style jsx>{`
        .Main {
          grid-area: main;
        }
      `}</style>
    </div>
  )
}

export default Main
