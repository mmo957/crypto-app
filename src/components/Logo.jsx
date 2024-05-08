import React from 'react'

function Logo({logo=1,dim=64,width=undefined, height=undefined}) {
  return (
    <img width={width} height={height} className='rounded-full  ' src={`https://s2.coinmarketcap.com/static/img/coins/${dim}x${dim}/${logo}.png`} alt={`logo-${logo}`} />
  )
}

export default Logo