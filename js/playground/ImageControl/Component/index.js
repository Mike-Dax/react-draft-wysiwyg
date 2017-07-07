/* @flow */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Option from './../../Option'
import Spinner from './../../Spinner'
import './styles.css'

import imageIcon from './image.svg'

class LayoutComponent extends Component {
  static propTypes: Object = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    doCollapse: PropTypes.func,
    onChange: PropTypes.func
  }

  state: Object = {
    imgSrc: '',
    dragEnter: false,
    uploadHighlighted: true,
    showImageLoading: false
  }

  componentWillReceiveProps(props: Object): void {
    if (this.props.expanded && !props.expanded) {
      this.setState({
        imgSrc: '',
        dragEnter: false,
        uploadHighlighted: true,
        showImageLoading: false
      })
    } else {
      this.setState({
        uploadHighlighted: true
      })
    }
  }

  onDragEnter: Function = (event: Object): void => {
    this.stopPropagation(event)
    this.setState({
      dragEnter: true
    })
  }

  onImageDrop: Function = (event: Object): void => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({
      dragEnter: false
    })
    this.uploadImage(event.dataTransfer.files[0])
  }

  showImageUploadOption: Function = (): void => {
    this.setState({
      uploadHighlighted: true
    })
  }

  addImageFromState: Function = (): void => {
    const { imgSrc } = this.state
    const { onChange } = this.props
    onChange(imgSrc)
  }

  addImageFromSrcLink: Function = (imgSrc: string): void => {
    const { onChange } = this.props
    onChange(imgSrc)
  }

  showImageURLOption: Function = (): void => {
    this.setState({
      uploadHighlighted: false
    })
  }

  toggleShowImageLoading: Function = (): void => {
    const showImageLoading = !this.state.showImageLoading
    this.setState({
      showImageLoading
    })
  }

  updateValue: Function = (event: Object): void => {
    this.setState({
      [`${event.target.name}`]: event.target.value
    })
  }

  selectImage: Function = (event: Object): void => {
    if (event.target.files && event.target.files.length > 0) {
      this.uploadImage(event.target.files[0])
    }
  }

  uploadCallback: Function = file => {
    console.log(file, 'upload time!!')
  }

  uploadImage: Function = (file: Object): void => {
    this.toggleShowImageLoading()
    this.uploadCallback(file)
      .then(({ data }) => {
        this.setState({
          showImageLoading: false,
          dragEnter: false
        })
        this.addImageFromSrcLink(data.link)
      })
      .catch(() => {
        this.setState({
          showImageLoading: false,
          dragEnter: false
        })
      })
  }

  fileUploadClick = event => {
    this.fileUpload = true
    event.stopPropagation()
  }

  stopPropagation: Function = (event: Object): void => {
    if (!this.fileUpload) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      this.fileUpload = false
    }
  }

  renderAddImageModal(): Object {
    const {
      imgSrc,
      uploadHighlighted,
      showImageLoading,
      dragEnter
    } = this.state
    const { doCollapse } = this.props

    const urlEnabled = true
    const uploadEnabled = true
    const uploadCallback = this.uploadCallback

    return (
      <div
        className={classNames('rdw-image-modal')}
        onClick={this.stopPropagation}
      >
        <div className="rdw-image-modal-header">
          {uploadEnabled &&
            uploadCallback &&
            <span
              onClick={this.showImageUploadOption}
              className="rdw-image-modal-header-option"
            >
              File Upload
              <span
                className={classNames('rdw-image-modal-header-label', {
                  'rdw-image-modal-header-label-highlighted': uploadHighlighted
                })}
              />
            </span>}
          {urlEnabled &&
            <span
              onClick={this.showImageURLOption}
              className="rdw-image-modal-header-option"
            >
              URL
              <span
                className={classNames('rdw-image-modal-header-label', {
                  'rdw-image-modal-header-label-highlighted': !uploadHighlighted
                })}
              />
            </span>}
        </div>
        {uploadHighlighted
          ? <div onClick={this.fileUploadClick}>
              <div
                onDragEnter={this.onDragEnter}
                onDragOver={this.stopPropagation}
                onDrop={this.onImageDrop}
                className={classNames('rdw-image-modal-upload-option', {
                  'rdw-image-modal-upload-option-highlighted': dragEnter
                })}
              >
                <label
                  htmlFor="file"
                  className="rdw-image-modal-upload-option-label"
                >
                  Drop File or Click to Select
                </label>
              </div>
              <input
                type="file"
                id="file"
                accept={'image/gif,image/jpeg,image/jpg,image/png,image/svg'}
                onChange={this.selectImage}
                className="rdw-image-modal-upload-option-input"
              />
            </div>
          : <div className="rdw-image-modal-url-section">
              <input
                className="rdw-image-modal-url-input"
                placeholder="Enter url"
                name="imgSrc"
                onChange={this.updateValue}
                onBlur={this.updateValue}
                value={imgSrc}
              />
            </div>}
        <span className="rdw-image-modal-btn-section">
          <button
            className="rdw-image-modal-btn"
            onClick={this.addImageFromState}
            disabled={!imgSrc}
          >
            Add
          </button>
          <button className="rdw-image-modal-btn" onClick={doCollapse}>
            Cancel
          </button>
        </span>
        {showImageLoading
          ? <div className="rdw-image-modal-spinner">
              <Spinner />
            </div>
          : undefined}
      </div>
    )
  }

  render(): Object {
    const { expanded, onExpandEvent } = this.props

    const icon = imageIcon
    const className = undefined
    const title = 'Image'

    return (
      <div
        className="rdw-image-wrapper"
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-image-control"
      >
        <Option
          className={classNames(className)}
          value="unordered-list-item"
          onClick={onExpandEvent}
          title={title}
        >
          <img src={icon} alt="" />
        </Option>
        {expanded ? this.renderAddImageModal() : undefined}
      </div>
    )
  }
}

export default LayoutComponent
