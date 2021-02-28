import { FunctionComponent, RefObject } from 'react'

const Main: FunctionComponent<{
  canvasRef: RefObject<HTMLCanvasElement> | null
  image: boolean
}> = ({ canvasRef, image }) => {
  return (
    <div className="Main flex">
      <div className={image ? `p-3.5 m-auto max-w-full flex bg-grey-700` : ``}>
        <canvas ref={canvasRef} className="w-full m-auto" />
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
