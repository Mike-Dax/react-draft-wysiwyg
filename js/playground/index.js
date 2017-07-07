/* @flow */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import draftToHtml from 'draftjs-to-html' // eslint-disable-line import/no-extraneous-dependencies
import draftToMarkdown from 'draftjs-to-markdown' // eslint-disable-line import/no-extraneous-dependencies
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import { Editor } from '../src'

import ImageRenderer from './ImageRenderer'
import ImageControl from './ImageControl'

import './styles.css'

class Playground extends Component {
  state: any = {
    editorContent: undefined,
    editorState: EditorState.createEmpty()
  }

  onEditorChange: Function = editorContent => {
    this.setState({
      editorContent
    })
  }

  onEditorStateChange: Function = editorState => {
    this.setState({
      editorState
    })
  }

  onContentStateChange: Function = () => {}

  clearContent: Function = () => {
    this.setState({
      contentState: convertToRaw(ContentState.createFromText(''))
    })
  }

  imageUploadCallBack: Function = file =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest() // eslint-disable-line no-undef
      xhr.open('POST', 'https://api.imgur.com/3/image')
      xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca')
      const data = new FormData() // eslint-disable-line no-undef
      data.append('image', file)
      xhr.send(data)
      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText)
        resolve(response)
      })
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText)
        reject(error)
      })
    })

  customBlockRenderer: Function = (block, config, currentStateProvided) => {
    if (block.getType() === 'atomic') {
      const contentState = config.getEditorState().getCurrentContent()
      const entity = contentState.getEntity(block.getEntityAt(0))
      console.log(block)
      if (entity && entity.type === 'IMAGE') {
        return {
          component: ImageRenderer(config),
          editable: false
        }
      }
    }
    return undefined
  }

  render() {
    const { editorContent } = this.state

    const toolbar = {
      options: [
        'inline',
        'blockType',
        'list', //'colorPicker',
        'link',
        'history'
      ],
      inline: {
        inDropdown: false,
        className: undefined,
        options: [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'monospace',
          'superscript',
          'subscript'
        ],
        bold: { className: undefined },
        italic: { className: undefined },
        underline: { className: undefined },
        strikethrough: { className: undefined },
        monospace: { className: undefined },
        superscript: { className: undefined },
        subscript: { className: undefined }
      },
      blockType: {
        inDropdown: true,
        options: ['Normal', 'H2'],
        className: undefined,
        dropdownClassName: undefined
      },
      list: {
        inDropdown: false,
        className: undefined,
        options: ['unordered', 'ordered', 'indent', 'outdent'],
        unordered: { className: undefined },
        ordered: { className: undefined },
        indent: { className: undefined },
        outdent: { className: undefined }
      },
      colorPicker: {
        className: undefined,
        popClassName: undefined,
        colors: [
          'rgb(97,189,109)',
          'rgb(26,188,156)',
          'rgb(84,172,210)',
          'rgb(44,130,201)',
          'rgb(147,101,184)',
          'rgb(71,85,119)',
          'rgb(204,204,204)',
          'rgb(65,168,95)',
          'rgb(0,168,133)',
          'rgb(61,142,185)',
          'rgb(41,105,176)',
          'rgb(85,57,130)',
          'rgb(40,50,78)',
          'rgb(0,0,0)',
          'rgb(247,218,100)',
          'rgb(251,160,38)',
          'rgb(235,107,86)',
          'rgb(226,80,65)',
          'rgb(163,143,132)',
          'rgb(239,239,239)',
          'rgb(255,255,255)',
          'rgb(250,197,28)',
          'rgb(243,121,52)',
          'rgb(209,72,65)',
          'rgb(184,49,47)',
          'rgb(124,112,107)',
          'rgb(209,213,216)'
        ]
      },
      link: {
        inDropdown: false,
        className: undefined,
        popClassName: undefined,
        options: ['link', 'unlink'],
        link: { className: undefined },
        unlink: { className: undefined }
      },
      history: {
        inDropdown: false,
        className: undefined,
        options: ['undo', 'redo'],
        undo: { className: undefined },
        redo: { className: undefined }
      }
    }

    return (
      <div className="playground-root">
        <div className="playground-label">
          Toolbar is alwasy <sup>visible</sup>
        </div>
        <button onClick={this.clearContent} tabIndex={0}>
          Force Editor State
        </button>
        <div className="playground-editorSection">
          <div className="playground-editorWrapper">
            <Editor
              tabIndex={0}
              hashtag={{}}
              toolbarClassName="playground-toolbar"
              wrapperClassName="playground-wrapper"
              editorClassName="playground-editor"
              toolbar={toolbar}
              onEditorStateChange={this.onEditorStateChange}
              onContentStateChange={this.onEditorChange}
              placeholder="testing"
              spellCheck
              toolbarCustomButtons={[<ImageControl />]}
              customBlockRenderFunc={this.customBlockRenderer}
              onFocus={() => {}}
              onBlur={() => {}}
              onTab={() => true}
              mention={{
                separator: ' ',
                trigger: '@',
                caseSensitive: true,
                suggestions: [
                  { text: 'A', value: 'AB', url: 'href-a' },
                  { text: 'AB', value: 'ABC', url: 'href-ab' },
                  { text: 'ABC', value: 'ABCD', url: 'href-abc' },
                  { text: 'ABCD', value: 'ABCDDDD', url: 'href-abcd' },
                  { text: 'ABCDE', value: 'ABCDE', url: 'href-abcde' },
                  { text: 'ABCDEF', value: 'ABCDEF', url: 'href-abcdef' },
                  { text: 'ABCDEFG', value: 'ABCDEFG', url: 'href-abcdefg' }
                ]
              }}
            />
          </div>
          <textarea
            className="playground-content no-focus"
            value={JSON.stringify(editorContent)}
          />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Playground />, document.getElementById('app')) // eslint-disable-line no-undef
