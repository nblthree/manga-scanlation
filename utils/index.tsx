import { RGBColor } from 'react-color'

export const rgba2hex = ({ r, g, b, a = 1 }: RGBColor): string => {
  let hex =
    (r | (1 << 8)).toString(16).slice(1) +
    (g | (1 << 8)).toString(16).slice(1) +
    (b | (1 << 8)).toString(16).slice(1)
  const alpha = ((a * 255) | (1 << 8)).toString(16).slice(1)
  hex += alpha

  return '#' + hex
}
