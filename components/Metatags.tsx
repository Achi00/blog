import React from 'react'
import Head from 'next/head'

const Metatags = ({ title, description, image}) => {
  return (
    <Head>
        <title>{title}</title>
        <meta name='twitter:card' content='front-end'/>
        <meta name='twitter:site' content='front-end'/>
        <meta name='twitter:title' content={title}/>
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
  
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
    </Head>
  )
}

export default Metatags