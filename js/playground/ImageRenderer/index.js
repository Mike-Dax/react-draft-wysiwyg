import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ImageRenderer = config =>
  class Image extends Component {
    static propTypes: Object = {
      block: PropTypes.object,
      contentState: PropTypes.object
    }

    render(): Object {
      const { block, contentState } = this.props
      const entity = contentState.getEntity(block.getEntityAt(0))
      const { src } = entity.getData()

      return (
        <img
          src={src}
          alt=""
          style={{
            width: '100%'
          }}
        />
      )
    }
  }

export default ImageRenderer
