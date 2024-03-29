import { FunctionComponent } from 'react'
import { Move, Square } from 'react-feather'

const BottomBar: FunctionComponent<{
  dashedRectData: { width: number; height: number }
  cursorPosition: { x: number; y: number }
}> = ({ dashedRectData, cursorPosition }) => {
  return (
    <div className="BottomBar bg-primary">
      <ul className="list-none flex h-full divide-x-2 divide-grey-700">
        <li className="flex h-full">
          <Move
            style={{ margin: 'auto 0.5rem' }}
            size="0.8rem"
            color="var(--icon-color)"
          />
          <span className="text-xs text-secondary">{`${cursorPosition.x.toFixed(
            0
          )}, ${cursorPosition.y.toFixed(0)}px`}</span>
        </li>
        <li className="flex h-full">
          <Square
            style={{ margin: 'auto 0.5rem' }}
            size="0.8rem"
            color="var(--icon-color)"
          />
          <span className="text-xs text-secondary">{`${dashedRectData.width.toFixed(
            0
          )}, ${dashedRectData.height.toFixed(0)}px`}</span>
        </li>
      </ul>
      <style jsx>{`
        .BottomBar {
          grid-area: bottomBar;
        }
        li {
          min-width: 30%;
        }
      `}</style>
    </div>
  )
}

export default BottomBar
