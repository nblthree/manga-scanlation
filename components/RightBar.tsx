import { FunctionComponent } from 'react'

const RightBar: FunctionComponent = () => {
  return (
    <div className="RightBar bg-grey-700">
      <style jsx>{`
        .RightBar {
          grid-area: rightBar;
        }
      `}</style>
    </div>
  )
}

export default RightBar
