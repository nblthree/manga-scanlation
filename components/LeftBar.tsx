import { FunctionComponent } from 'react'
import { Move, Square, Type } from 'react-feather'
import { Rubber } from '../svg'

const LeftBar: FunctionComponent = () => {
  return (
    <div className="LeftBar bg-grey-700">
      <ul className="list-none">
        <button
          title="Move"
          className="w-full py-2 border-none outline-none flex bg-transparent focus:outline-none"
        >
          <Move style={{ margin: 'auto' }} size="1.2rem" color="#d0d0d0" />
        </button>
        <button
          title="Select"
          className="w-full py-2 border-none outline-none flex bg-transparent focus:outline-none"
        >
          <Square style={{ margin: 'auto' }} size="1.2rem" color="#d0d0d0" />
        </button>
        <button
          title="Rubber"
          className="w-full py-2 border-none outline-none flex bg-transparent focus:outline-none"
        >
          <Rubber style={{ margin: 'auto' }} size="1.2rem" color="#d0d0d0" />
        </button>
        <button
          title="Type"
          className="w-full py-2 border-none outline-none flex bg-transparent focus:outline-none"
        >
          <Type style={{ margin: 'auto' }} size="1.2rem" color="#d0d0d0" />
        </button>
      </ul>
      <style jsx>{`
        .LeftBar {
          grid-area: leftBar;
        }
      `}</style>
    </div>
  )
}

export default LeftBar
