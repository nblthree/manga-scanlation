import { FunctionComponent, useState } from 'react'
import Dictionary from './Dictionary'
import MenuBookIcon from '@material-ui/icons/MenuBook'

const RightBar: FunctionComponent = () => {
  const [tool, setTool] = useState('Dictionary')

  return (
    <div className="RightBar bg-primary">
      <div className="custom-style-1 h-10 w-full flex">
        <button
          title="Dictionary"
          className="w-8 p-2 border-none outline-none flex bg-transparent focus:outline-none"
          onClick={(e) => {
            const target = e.currentTarget as HTMLElement
            setTool(
              target.getAttribute('title') !== tool
                ? (target.getAttribute('title') as string)
                : 'none'
            )
          }}
        >
          <MenuBookIcon
            titleAccess="Dictionary"
            htmlColor="var(--icon-color)"
            style={{ fontSize: '1rem', margin: 'auto 0' }}
          />
        </button>
      </div>
      <div className="custom-style-2 w-full">
        <Dictionary />
      </div>
      <style jsx>{`
        .RightBar {
          grid-area: rightBar;
        }
        .custom-style-2 {
          height: calc(100% - 40px);
        }
      `}</style>
    </div>
  )
}

export default RightBar
