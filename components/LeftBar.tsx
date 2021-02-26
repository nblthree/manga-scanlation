import { FunctionComponent } from 'react'

const LeftBar: FunctionComponent = () => {
  return (
    <div className="LeftBar bg-grey-700">
      <ul className="list-none"></ul>
      <style jsx>{`
        .LeftBar {
          grid-area: leftBar;
        }
      `}</style>
    </div>
  )
}

export default LeftBar
