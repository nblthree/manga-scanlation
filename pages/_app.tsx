import { AppProps } from 'next/app'
import { ReactElement, useEffect } from 'react'
import '../styles/globals.css'

export default function MyApp({
  Component,
  pageProps,
}: AppProps): ReactElement {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return <Component {...pageProps} />
}
