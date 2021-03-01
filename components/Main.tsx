import { FunctionComponent, RefObject, useState } from 'react'

const Main: FunctionComponent<{
  canvasRef: RefObject<HTMLCanvasElement> | null
  image: boolean
  tool: string
}> = ({ canvasRef, image, tool }) => {
  const [zoom, setZoom] = useState(1)

  const handleZooming = (arg: string) => {
    let z = zoom
    if (arg === 'Zoom In') {
      z = zoom + 0.05
    } else if (arg === 'Zoom Out') {
      z = zoom - 0.05
      if (z < 0.2) z = 0.2
    }
    setZoom(z)
  }

  return (
    <div className="Main flex p-8">
      <div
        className={image ? `p-2 m-auto overflow-hidden flex bg-grey-700` : ``}
      >
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
