
import React from 'react'
import Script from 'next/script'
function PaddleLoader() {
  return (
    <Script id="paddle-loader" src="https://cdn.paddle.com/paddle/paddle.js"
        onLoad={() => {
            Paddle.Environment.set("sandbox")
            Paddle.Setup({vendor: 22908})
        }}
    >

    </Script>
  )
}

export default PaddleLoader