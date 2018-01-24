import React from 'react'
import { getReminder } from 'src/service'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'

import './index.scss'

class PageRemark extends React.Component {
  constructor (props) {
    super(props)

    this.state = { init: false }
  }

  componentWillMount () {
    getReminder().then(res => {
      this.setState({ init: true }, () => {
        this.containerEle.innerHTML = res.data.info
      })
    })
  }

  render () {
    let linkUrl = '/autoInvestExplain'

    if (!this.state.init) {
      return <Loading />
    }

    return (
      <div className="PageRemarkContainer">
        <div className="content" ref={(containerEle) => this.containerEle = containerEle} />
        <Link className="link" to={linkUrl}>查看更多</Link>
      </div>
    )
  }
}


export default PageRemark
