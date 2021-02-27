import { FunctionComponent } from 'react'
import {
  Home,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  AlignRight,
} from 'react-feather'

const TopBar: FunctionComponent = () => {
  return (
    <div className="TopBar bg-grey-700">
      <ul className="list-none flex flex-row h-full divide-x-2 divide-grey-900">
        <li className="h-full px-4">
          <button
            title="Home"
            className="h-full border-none outline-none flex bg-transparent focus:outline-none"
          >
            <Home
              style={{ margin: 'auto' }}
              size="1.4rem"
              color="var(--icon-color)"
            />
          </button>
        </li>
        <li className="h-full">
          <ul className="list-none flex flex-row h-full">
            <li className="h-full px-1">
              <button
                title="Align Left"
                className="h-full border-none outline-none flex bg-transparent focus:outline-none"
              >
                <AlignLeft
                  style={{ margin: 'auto' }}
                  size="1.4rem"
                  color="var(--icon-color)"
                />
              </button>
            </li>
            <li className="h-full px-1">
              <button
                title="Align Center"
                className="h-full border-none outline-none flex bg-transparent focus:outline-none"
              >
                <AlignCenter
                  style={{ margin: 'auto' }}
                  size="1.4rem"
                  color="var(--icon-color)"
                />
              </button>
            </li>
            <li className="h-full px-1">
              <button
                title="Align Justify"
                className="h-full border-none outline-none flex bg-transparent focus:outline-none"
              >
                <AlignJustify
                  style={{ margin: 'auto' }}
                  size="1.4rem"
                  color="var(--icon-color)"
                />
              </button>
            </li>
            <li className="h-full px-1">
              <button
                title="Align Right"
                className="h-full border-none outline-none flex bg-transparent focus:outline-none"
              >
                <AlignRight
                  style={{ margin: 'auto' }}
                  size="1.4rem"
                  color="var(--icon-color)"
                />
              </button>
            </li>
          </ul>
        </li>
        <li className="h-full px-1">
          <button
            title="Write up-down"
            className="h-full border-none outline-none flex bg-transparent focus:outline-none"
          >
            <AlignRight
              style={{
                margin: 'auto',
                transformOrigin: 'center',
                transform: 'rotate(-90deg)',
              }}
              size="1.4rem"
              color="var(--icon-color)"
            />
          </button>
        </li>
      </ul>
      <style jsx>{`
        .TopBar {
          grid-area: topBar;
        }
      `}</style>
    </div>
  )
}

export default TopBar
