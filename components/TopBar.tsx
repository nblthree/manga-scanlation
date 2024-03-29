import { FunctionComponent, useState } from 'react'
import { AlignLeft, AlignCenter, AlignRight } from 'react-feather'
import FormatSize from '@material-ui/icons/FormatSize'
import FormatColorText from '@material-ui/icons/FormatColorText'
import GitHub from '@material-ui/icons/GitHub'
import { ChromePicker, RGBColor } from 'react-color'
import { rgba2hex } from '../utils'

const TopBar: FunctionComponent<{
  styles: any
  setStyles: (arg: any) => void
}> = ({ styles, setStyles }) => {
  const [show, setShow] = useState({ bg: false, textColor: false })
  const [localState, setLocalState] = useState({ ...styles })

  return (
    <div className="TopBar bg-primary">
      <ul className="list-none flex flex-row h-full divide-x-2 divide-grey-800">
        <li className="h-full px-4">
          <a
            title="GitHub"
            className="h-full outline-none flex bg-transparent focus:outline-none"
            href="https://github.com/nblthree/manga-scanlation"
            target="_blank"
            rel="noreferrer"
          >
            <GitHub
              titleAccess="GitHub"
              htmlColor="var(--icon-color)"
              style={{ fontSize: '1.1rem', margin: 'auto' }}
            />
          </a>
        </li>
        <li className="h-full px-2 flex relative">
          <span className=" text-secondary text-sm leading-8 pr-2">Fill :</span>
          <button
            title="Fill Color"
            className="h-4 border-none m-auto outline-none flex focus:outline-none w-6"
            style={{ backgroundColor: styles.bg }}
            onClick={() => {
              setShow({ ...show, bg: !show.bg })
            }}
          ></button>
          <div
            className={`absolute left-0 top-full z-10 ${
              show.bg ? 'block' : 'hidden'
            }`}
          >
            <ChromePicker
              color={localState.bg}
              onChange={({ rgb }: { rgb: RGBColor }) => {
                setLocalState({ ...localState, bg: rgb })
              }}
              onChangeComplete={({ rgb }: { rgb: RGBColor }) => {
                setStyles({ ...styles, bg: rgba2hex(rgb) })
              }}
            />
          </div>
        </li>
        <li className="h-full px-2 flex relative">
          <FormatColorText
            titleAccess="Text Color"
            htmlColor="var(--icon-color)"
            style={{ fontSize: '1rem', margin: 'auto 0.4rem auto 0' }}
            onClick={() => {
              setShow({ ...show, textColor: !show.textColor })
            }}
          />
          <button
            title="Fill Color"
            className="h-4 border-none m-auto outline-none flex focus:outline-none w-6"
            style={{ backgroundColor: styles.textColor }}
            onClick={() => {
              setShow({ ...show, textColor: !show.textColor })
            }}
          ></button>
          <div
            className={`absolute left-0 top-full z-10 ${
              show.textColor ? 'block' : 'hidden'
            }`}
          >
            <ChromePicker
              color={localState.textColor}
              onChange={({ rgb }: { rgb: RGBColor }) => {
                setLocalState({ ...localState, textColor: rgb })
              }}
              onChangeComplete={({ rgb }: { rgb: RGBColor }) => {
                setStyles({ ...styles, textColor: rgba2hex(rgb) })
              }}
            />
          </div>
        </li>
        <li className="h-full px-2 flex">
          <label htmlFor="font-size-input">
            <FormatSize
              titleAccess="Font size"
              htmlColor="var(--icon-color)"
              style={{ fontSize: '1rem', margin: 'auto 0.4rem auto 0' }}
            />
          </label>
          <input
            id="font-size-input"
            className="w-16 my-auto h-5 indent border-0 bg-grey-900 text-xs text-secondary"
            value={styles.textSize}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = Number(e.target.value)
              if (Number.isNaN(value) || value <= 0) return
              setStyles({ ...styles, textSize: value })
            }}
          />
        </li>
        <li className="h-full">
          <ul className="list-none flex flex-row h-full">
            <li className="h-full px-1">
              <button
                title="Align Left"
                className="h-full border-none outline-none flex bg-transparent focus:outline-none"
                onClick={() => {
                  setStyles({ ...styles, textAlign: 'left' })
                }}
              >
                <AlignLeft
                  style={{ margin: 'auto' }}
                  size="1rem"
                  color="var(--icon-color)"
                />
              </button>
            </li>
            <li className="h-full px-1">
              <button
                title="Align Center"
                className="h-full border-none outline-none flex bg-transparent focus:outline-none"
                onClick={() => {
                  setStyles({ ...styles, textAlign: 'center' })
                }}
              >
                <AlignCenter
                  style={{ margin: 'auto' }}
                  size="1rem"
                  color="var(--icon-color)"
                />
              </button>
            </li>
            <li className="h-full px-1">
              <button
                title="Align Right"
                className="h-full border-none outline-none flex bg-transparent focus:outline-none"
                onClick={() => {
                  setStyles({ ...styles, textAlign: 'right' })
                }}
              >
                <AlignRight
                  style={{ margin: 'auto' }}
                  size="1rem"
                  color="var(--icon-color)"
                />
              </button>
            </li>
          </ul>
        </li>
        {/*<li className="h-full px-1">
          <button
            title="Write up-down"
            className="h-full border-none outline-none flex bg-transparent focus:outline-none"
            onClick={() => {setStyles({...styles, dir: 'ttb'})}}
          >
            <AlignRight
              style={{
                margin: 'auto',
                transformOrigin: 'center',
                transform: 'rotate(-90deg)',
              }}
              size="1rem"
              color="var(--icon-color)"
            />
          </button>
          </li>*/}
      </ul>
      <style jsx>{`
        .TopBar {
          grid-area: topBar;
        }
        .indent {
          text-indent: 0.4rem;
        }
      `}</style>
    </div>
  )
}

export default TopBar
