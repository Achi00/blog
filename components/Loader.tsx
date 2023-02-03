import { divide } from 'lodash'
import React from 'react'

const Loader = ({ show }) => {
  return show ? <div className="loader"></div> : null
}

export default Loader