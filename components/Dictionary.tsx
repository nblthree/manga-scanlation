import { FunctionComponent, useState } from 'react'
import SearchIcon from '@material-ui/icons/Search'

const Dictionary: FunctionComponent = () => {
  const [search, setSearch] = useState('')
  const [data, setData] = useState({
    kanji: [],
    reading: [],
  })
  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex w-full p-1">
        <input
          className="w-10/12 h-8 bg-grey-700 text-secondary outline-none border-2 border-grey-900 focus:ring-2 focus:ring-grey-400"
          onChange={({ target }) => setSearch(target.value)}
          value={search}
        />
        <button
          title="Search"
          className="w-2/12 border-none outline-none flex bg-transparent focus:outline-none"
          onClick={() => {
            fetch(`https://kanjiapi.dev/v1/reading/${search}`)
              .then((r) => r.json())
              .then((r) => {
                if (r.error) {
                  return fetch(`https://kanjiapi.dev/v1/kanji/${search}`)
                    .then((e) => e.json())
                    .then((e: any) => {
                      if (e.error) return
                      setData({ kanji: [e], reading: [] })
                    })
                }
                Promise.all(
                  r.main_kanji.map((kanji: string) =>
                    fetch(`https://kanjiapi.dev/v1/kanji/${kanji}`).then((e) =>
                      e.json()
                    )
                  )
                ).then((kanjiList: any) => {
                  setData({ kanji: kanjiList, reading: r })
                })
              })
          }}
        >
          <SearchIcon
            titleAccess="Search"
            htmlColor="var(--icon-color)"
            style={{ fontSize: '1.2rem', margin: 'auto' }}
          />
        </button>
      </div>
      <div className="w-full p-1 text-secondary divide-y-2 divide-solid divide-secondary">
        {data.kanji.map((entry: any, i) => (
          <div key={i} className="p-2">
            <div>
              Kanji:{' '}
              <span className="text-2xl font-thin text-white">
                {entry.kanji}
              </span>
            </div>
            <div className="p-2">
              {entry.kun_readings.length > 0 && (
                <div>kun readings: {entry.kun_readings.join(', ')}</div>
              )}
              {entry.name_readings.length > 0 && (
                <div>name_readings: {entry.name_readings.join(', ')}</div>
              )}
              <div>meanings: {entry.meanings.join(', ')}</div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .RightBar {
          grid-area: rightBar;
        }
      `}</style>
    </div>
  )
}

export default Dictionary
