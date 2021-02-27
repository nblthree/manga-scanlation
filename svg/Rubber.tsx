import { FunctionComponent } from 'react'

const Rubber: FunctionComponent<{
  color: string
  size: string | number
  [key: string]: any
}> = ({ color = 'currentColor', size = 24, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      color={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <polyline
        stroke="currentColor"
        fill="currentColor"
        points="18,0 24,6 12,18 6,12 18,0"
      ></polyline>
      <polyline
        stroke="currentColor"
        fill="none"
        points="6,12 0,18 6,24 12,18"
      ></polyline>
      <polyline
        stroke="currentColor"
        fill="none"
        points="6,24 24,24"
      ></polyline>
    </svg>
  )
}

export default Rubber
