import { FunctionComponent } from 'react'

const BottomBar: FunctionComponent = () => {
  return (
    <div className="BottomBar bg-grey-700">
      <style jsx>{`
        .BottomBar {
          grid-area: bottomBar;
        }
      `}</style>
    </div>
  )
}

export default BottomBar
