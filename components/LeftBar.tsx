import { FunctionComponent } from 'react'
import { Move, Square, Type } from 'react-feather'
import { Rubber } from '../svg'

const LeftBar: FunctionComponent = () => {
  return (
    <div className="LeftBar bg-primary">
      <ul className="list-none">
        <li className="w-full">
          <button
            title="Move"
            className="w-full py-2 border-none outline-none flex bg-transparent focus:outline-none"
          >
            <Move
              style={{ margin: 'auto' }}
              size="1.2rem"
              color="var(--icon-color)"
            />
          </button>
        </li>
        <li className="w-full">
          <button
            title="Select"
            className="w-full py-2 border-none outline-none flex bg-transparent focus:outline-none"
          >
            <Square
              style={{ margin: 'auto' }}
              size="1.2rem"
              color="var(--icon-color)"
            />
          </button>
        </li>
        <li className="w-full">
          <button
            title="Rubber"
            className="w-full py-2 border-none outline-none flex bg-transparent focus:outline-none"
          >
            <Rubber
              style={{ margin: 'auto' }}
              size="1.2rem"
              color="var(--icon-color)"
            />
          </button>
        </li>
        <li className="w-full">
          <button
            title="Type"
            className="w-full py-2 border-none outline-none flex bg-transparent focus:outline-none"
          >
            <Type
              style={{ margin: 'auto' }}
              size="1.2rem"
              color="var(--icon-color)"
            />
          </button>
        </li>
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
