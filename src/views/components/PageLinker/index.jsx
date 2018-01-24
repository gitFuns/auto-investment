import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './index.scss'

const PageLinker = (props) => {

  return (
    <div className="PageLinkerContainer">
      {
        props.showLeft !== false && (
          <div className="left">
            <Link to={props.leftLinkUrl}>
              <img src={props.leftLinkIcon} alt="" />
              <span>{props.leftLinkText}</span>
            </Link>
          </div>
        )
      }
      {
        props.showRight !== false && (
          <div className="right">
            <Link to={props.rightLinkUrl}>
              <img src={props.rightLinkIcon} alt="" />
              <span>{props.rightLinkText}</span>
            </Link>
          </div>
        )
      }
    </div>
  )
}

PageLinker.propTypes = {
  showLeft: PropTypes.bool,
  showRight: PropTypes.bool,
  leftLinkIcon: PropTypes.string,
  leftLinkText: PropTypes.string,
  leftLinkUrl: PropTypes.string,
  rightLinkIcon: PropTypes.string,
  rightLinkText: PropTypes.string,
  rightLinkUrl: PropTypes.string
}

export default PageLinker
