const PauseIcon = ({
  width = 40,
  height = 40,
  bgColor = 'white',
  fillColor = 'black',
}: {
  width?: number
  height?: number
  bgColor?: string
  fillColor?: string
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
        fill={bgColor}
      />
      <rect x="22" y="15.1463" width="1.49744" height="9.70734" rx="0.748718" fill={fillColor} />
      <rect x="16" y="15.1463" width="1.5" height="9.70734" rx="0.75" fill={fillColor} />
    </svg>
  )
}

export default PauseIcon
