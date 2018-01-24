import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const HeaderContainer = (props) => {
  return (
    <div className="HeaderContainer">
      {props.children}
    </div>
  )
}

HeaderContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.any])
}

export default HeaderContainer
