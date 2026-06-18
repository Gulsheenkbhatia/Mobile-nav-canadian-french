import React from 'react'

function StarComponent({ ...props }) {
  const { dataKey } = props
  const url = `url(#${dataKey})`
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="14"
        fill="none"
        viewBox="0 0 15 14"
      >
        <path
          fill="#2E2E2E"
          fillRule="evenodd"
          d="M7.5 11.252L12.135 14l-1.23-5.18L15 5.335l-5.393-.45L7.5 0 5.393 4.885 0 5.335 4.095 8.82 2.865 14 7.5 11.252z"
          clipRule="evenodd"
        />
        <mask id={dataKey} width="15" height="14" x="0" y="0" maskUnits="userSpaceOnUse">
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M7.5 11.252L12.135 14l-1.23-5.18L15 5.335l-5.393-.45L7.5 0 5.393 4.885 0 5.335 4.095 8.82 2.865 14 7.5 11.252z"
            clipRule="evenodd"
          />
        </mask>
        <g mask={url}>
          <path fill="#D8D8D8" d="M0 0H15V14H0z" />
        </g>
      </svg>
    </>
  )
}

export default StarComponent
