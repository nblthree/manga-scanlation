import * as React from 'react'

const TopMenu: React.FunctionComponent = () => {
  return (
    <div className="topMenu bg-grey-700">
      <ul className="list-none flex flex-row">
        <li className="h-full w-8"></li>
        <li className="h-full text-gray-50 px-2 text-sm relative block group">
          <button className="outline-none bg-transparent border-none focus:outline-none">
            File
          </button>
          <ul className="list-none w-28 absolute left-0 bg-grey-900 hidden group-hover:block group-focus:block">
            <li className=" text-gray-50 py-1 text-xs indent-1 relative block group">
              New File
            </li>
            <li className=" text-gray-50 py-1 text-xs indent-1 relative block group">
              Save
            </li>
            <li className=" text-gray-50 py-1 text-xs indent-1 relative block group">
              Save As...
            </li>
          </ul>
        </li>
        <li className="h-full text-gray-50 px-2 text-sm relative block group">
          <button className="outline-none bg-transparent border-none focus:outline-none">
            Edit
          </button>
          <ul className="list-none w-28 absolute left-0 bg-grey-900 hidden group-hover:block group-focus:block">
            <li className=" text-gray-50 py-1 text-xs indent-1 relative block group">
              Undo
            </li>
            <li className=" text-gray-50 py-1 text-xs indent-1 relative block group">
              Redo
            </li>
          </ul>
        </li>
      </ul>
      <style jsx>{`
        .topMenu {
          grid-area: topMenu;
        }
      `}</style>
    </div>
  )
}

export default TopMenu
