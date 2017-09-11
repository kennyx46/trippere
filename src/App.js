import React, { Component } from 'react';

import 'bootstrap-css-only/css/bootstrap.css'
import 'bootstrap-css-only/css/bootstrap-theme.css'

import './App.css';

import Details from './components/Details'
import Photos from './components/Photos'

import { gql, graphql, compose } from 'react-apollo'

class App extends Component {

  state = {
    user: {
      details: null,
      photos: null
    },
    isPhotoEditMode: false
  }

  componentDidMount() {}

  save = (data, isPhotoMode) => {
    let storingKey = 'photos'
    if (!isPhotoMode) {
      storingKey = 'user'
      this.setState({isPhotoEditMode: true})
    }
    this.saveData({[storingKey]: data})
  }

  saveData = (data) => {
    // either data.user or data.photos
    let dat

    if (data.photos) {
      dat = new FormData()
      data.photos.forEach((file) => {
        dat.append('data', file)
      })
    } else {
      dat = data.user
      dat.birthdate = new Date(dat.year, dat.month, dat.date)
    }

    if (data.user) {
      if (data.user.id) {
        this.props.updateUser({variables: dat})
      } else {
        this.props.createUser({variables: dat})
      }
    } else {
      fetch("https://api.graph.cool/file/v1/cj7c6z1d206g90163lyglktyh", {
        method: "POST",
        body: dat
      })
    }

  }

  render() {
    return (
      <div className="App">
        {this.state.isPhotoEditMode ?
          <Photos onNext={this.save}/> :
          <Details onNext={this.save}/>
        }
      </div>
    );
  }
}



export default compose(
  graphql(gql`
    mutation createUserMutation($name: String!, $surname: String!, $gender: Gender!, $birthdate: DateTime!) {
      createUser(
        name: $name,
        surname: $surname,
        gender: $gender,
        birthdate: $birthdate
      ) {
        id
      }
    }
  `, { name: 'createUser' }),
  graphql(gql`
    mutation updateUserMutation($id: ID!, $name: String!, $surname: String!, $gender: Gender!, $birthdate: DateTime!) {
      updateUser(
        id: $id,
        name: $name,
        surname: $surname,
        gender: $gender,
        birthdate: $birthdate
      ) {
        id
      }
    }
  `, { name: 'updateUser' }),
  graphql(gql`
    mutation updateUserMutation($id: ID!, $images: [File!]!) {
      updateUser(
        id: $id,
        images: $images
      ) {
        id
      }
    }
  `, { name: 'updateUserImages' }),
)(App)