/* @flow */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AtomicBlockUtils } from 'draft-js'

import LayoutComponent from './Component'

class ImageControl extends Component {
  static propTypes: Object = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    modalHandler: PropTypes.object,
    translations: PropTypes.object
  }

  constructor(props) {
    super(props)
    console.log('hello i am image control print props', props)
  }

  state: Object = {
    expanded: false
  }

  componentWillMount(): void {
    const { modalHandler } = this.props
    modalHandler.registerCallBack(this.expandCollapse)
  }

  componentWillUnmount(): void {
    const { modalHandler } = this.props
    modalHandler.deregisterCallBack(this.expandCollapse)
  }

  onExpandEvent: Function = (): void => {
    this.signalExpanded = !this.state.expanded
  }

  doExpand: Function = (): void => {
    this.setState({
      expanded: true
    })
  }

  doCollapse: Function = (): void => {
    this.setState({
      expanded: false
    })
  }

  expandCollapse: Function = (): void => {
    this.setState({
      expanded: this.signalExpanded
    })
    this.signalExpanded = false
  }

  addImage: Function = (src: string): void => {
    const { editorState, onChange } = this.props
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('IMAGE', 'MUTABLE', { src })
      .getLastCreatedEntityKey()
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    )
    onChange(newEditorState)
    this.doCollapse()
  }

  render(): Object {
    const { expanded } = this.state
    const ImageComponent = LayoutComponent
    return (
      <ImageComponent
        onChange={this.addImage}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollpase={this.doCollpase}
      />
    )
  }
}

export default ImageControl
