import { useRef, useEffect, RefObject } from 'react'

function useCanvas(fun: (context: CanvasRenderingContext2D | null) => void): RefObject<HTMLCanvasElement> {
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if(canvasRef && canvasRef.current) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      let animationFrameId: number
      
      const render = () => {
        fun(context)
        animationFrameId = window.requestAnimationFrame(render)
      }
      render()
      
      return () => {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [fun])
  
  return canvasRef
}

export default useCanvas