import React, { Component } from 'react'
import { FormControl, FormGroup, HelpBlock, ControlLabel, Glyphicon, Button } from 'react-bootstrap'

import FieldGroup from './FieldGroup'

import { gql, graphql, compose } from 'react-apollo'

import R from 'ramda'

class Photos extends Component {

  state = {
    files: [
      {url: ''},
      {url: ''},
      {url: ''},
    ],
    filesToDelete: [],
    filesToUpload: []
  }

  componentWillReceiveProps(nextProps) {
    const images = nextProps.data.allFiles
    if (images) {
      const files = this.state.files.map((file, index) => {
        return images[index] ? {...images[index]} : file
      })
      this.setState({files})
    }
  }

  onNextClick = (e) => {
    this.state.filesToDelete.forEach((file) => {
      this.deletePhoto(file)
    })
    this.props.onNext(this.state.filesToUpload, true)
  }

  handlePhoto = (e, index) => {
    const reader = new FileReader()
    reader.onload = (res) => {
      const {files, filesToDelete, filesToUpload} = this.state
      if (files[index].id) {
        filesToDelete.push(files[index])
      }
      files[index].url = res.target.result
      this.setState({files, filesToDelete, filesToUpload})
    }
    const { filesToUpload } = this.state
    filesToUpload.push(e.target.files[0])
    this.setState({filesToUpload})
    reader.readAsDataURL(e.target.files[0])
  }

  deletePhoto = (photo, index) => {
    if (photo && photo.id) {
      this.props.deletePhoto({variables: {id: photo.id}})
      let {files} = this.state
      files[index].id = ''
      files[index].url = ''
      this.setState({files})
    }
  }

  render() {
    const {files} = this.state

    return (
      <div id="photos">
        <h1>Add photos</h1>
        <hr/>
        <h2>Add your quality photos</h2>
        <p>Photos increase the chance to be picked by 80%!</p>
        <div className="photos-wrapper">
          {R.range(0, 3).map((index) =>
            <div key={index} className="photo-item"
              style={{'backgroundImage': files[index].url ? `url(${files[index].url})` : 'none'}}>
              <div className="photo">
                <Glyphicon glyph="plus-sign"></Glyphicon>
                <FieldGroup
                  onChange={(e) => this.handlePhoto(e, index)}
                  id="formControlsFile"
                  type="file"
                />
              </div>
              <Button className="remove-photo-btn" onClick={() => this.deletePhoto(files[index], index)}>
                <Glyphicon glyph="remove-sign"></Glyphicon>
                <span>Remove</span>
              </Button>
            </div>
          )}
        </div>
        <div className="button-wrapper">
          <Button bsStyle="primary" className="details-button" onClick={this.onNextClick}>Next</Button>
        </div>
      </div>
    )
  }

}


export default compose(
  graphql(gql`{
    allFiles {
      id
      name
      url
    }
  }
  `),
  graphql(gql`
    mutation DeleteFileMutation($id: ID!) {
      deleteFile(id: $id) {
        id
      }
    }
  `, { name: "deletePhoto"})
)(Photos)