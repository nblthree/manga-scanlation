import { FunctionComponent } from 'react'

const BottomBar: FunctionComponent = () => {
  return (
    <div className="BottomBar bg-primary">
      <style jsx>{`
        .BottomBar {
          grid-area: bottomBar;
        }
      `}</style>
    </div>
  )
}

export default BottomBar
