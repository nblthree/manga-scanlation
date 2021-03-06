import { FunctionComponent } from 'react'

const TopMenu: FunctionComponent<{
  setImageURL: (arg: any) => void
  save: () => void
  undo: () => void
  redo: () => void
}> = ({ setImageURL, save, undo, redo }) => {
  return (
    <div className="topMenu bg-primary">
      <ul className="list-none text-secondary flex flex-row">
        <li className="h-full w-8"></li>
        <li className="h-full px-2 text-sm relative block group">
          <button className="outline-none bg-transparent cursor-default border-none focus:outline-none">
            File
          </button>
          <ul className="list-none text-secondary w-28 absolute z-10 left-0 p-2 bg-grey-900 hidden group-hover:block group-focus:block">
            <li className="py-1 text-xs indent-1 relative block group">
              <label
                htmlFor="openFile"
                className="cursor-pointer block min-w-full"
              >
                Open File
                <input
                  type="file"
                  id="openFile"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onloadend = function () {
                      setImageURL(reader.result)
                    }
                    reader.readAsDataURL(file)
                  }}
                />
              </label>
            </li>
            <hr className="border-none h-px linear-gradient my-1" />
            <li
              className="py-1 text-xs indent-1 relative block group cursor-pointer"
              onClick={() => {
                save()
              }}
            >
              Save
            </li>
            {/*<li className="py-1 text-xs indent-1 relative block group">
              Save As...
                </li>*/}
          </ul>
        </li>
        <li className="h-fulltext-secondary px-2 text-sm relative block group">
          <button className="outline-none bg-transparent cursor-default border-none focus:outline-none">
            Edit
          </button>
          <ul className="list-none text-secondary w-28 absolute z-10 left-0 p-2 bg-grey-900 hidden group-hover:block group-focus:block">
            <li
              className="py-1 text-xs indent-1 relative block group cursor-pointer"
              onClick={() => {
                undo()
              }}
            >
              Undo
            </li>
            <li
              className="py-1 text-xs indent-1 relative block group cursor-pointer"
              onClick={() => {
                redo()
              }}
            >
              Redo
            </li>
          </ul>
        </li>
      </ul>
      <style jsx>{`
        .topMenu {
          grid-area: topMenu;
        }
        .linear-gradient {
          background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.5),
            rgba(255, 255, 255, 0)
          );
        }
      `}</style>
    </div>
  )
}

export default TopMenu
