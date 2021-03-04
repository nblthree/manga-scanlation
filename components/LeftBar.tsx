import { FunctionComponent } from 'react'
import { Move, Square, Type, ZoomIn, ZoomOut } from 'react-feather'
import Colorize from '@material-ui/icons/Colorize'
import { Rubber } from '../svg'

const LeftBar: FunctionComponent<{
  setTool: (arg: string) => void
  tool: string
}> = ({ setTool, tool }) => {
  const cmp = {
    Move,
    Select: Square,
    Erase: Rubber,
    Type,
    'Zoom In': ZoomIn,
    'Zoom Out': ZoomOut,
  }
  return (
    <div className="LeftBar bg-primary">
      <ul className="list-none">
        {Object.keys(cmp).map((name: string) => {
          const ToolIcon = cmp[name as keyof typeof cmp]
          return (
            <li
              key={name}
              className={`w-full ${tool === name ? 'bg-grey-300' : ''}`}
            >
              <button
                title={name}
                className="w-full py-2 border-none outline-none flex bg-transparent focus:outline-none"
                onClick={(e) => {
                  const target = e.currentTarget as HTMLElement
                  setTool(
                    target.getAttribute('title') !== tool
                      ? (target.getAttribute('title') as string)
                      : 'none'
                  )
                }}
              >
                <ToolIcon
                  style={{ margin: 'auto' }}
                  title={name}
                  size="1rem"
                  color="var(--icon-color)"
                />
              </button>
            </li>
          )
        })}
        <li className={`w-full ${tool === 'Picker' ? 'bg-grey-300' : ''}`}>
          <button
            title={'Picker'}
            className="w-full py-2 border-none outline-none flex bg-transparent focus:outline-none"
            onClick={(e) => {
              const target = e.currentTarget as HTMLElement
              setTool(
                target.getAttribute('title') !== tool
                  ? (target.getAttribute('title') as string)
                  : 'none'
              )
            }}
          >
            <Colorize
              titleAccess="Picker"
              htmlColor="var(--icon-color)"
              style={{ fontSize: '1rem', margin: 'auto' }}
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
