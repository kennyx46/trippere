import React, { Component } from 'react'
import { FormControl, Button } from 'react-bootstrap'

import FieldGroup from './FieldGroup'

import { gql, graphql } from 'react-apollo'

import R from 'ramda'

function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate()
}

class Details extends Component {

  state = {
    userInfo: {
      name: '',
      surname: '',
      birthdate: new Date(),
      gender: ''
    },
    dateInfo: {
      year: {
        from: 1900,
        to: 2017
      },
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November'
      ]
    }
  }

  componentWillReceiveProps(nextProps) {
    const user = R.head(nextProps.data.allUsers)
    if (user) {
      const userInfo = {...user}
      userInfo.birthdate = new Date(user.birthdate)
      userInfo.year = userInfo.birthdate.getFullYear()
      userInfo.month = userInfo.birthdate.getMonth()
      userInfo.date = userInfo.birthdate.getDate()
      this.setState({
        userInfo
      })
    }
  }

  onNextClick = (e) => {
    const {userInfo} = this.state

    if (this.props.data.allUsers && this.props.data.allUsers[0]) {
      userInfo.id = this.props.data.allUsers[0].id
    }

    this.props.onNext(userInfo)
  }

  handleChange = (field, val) => {
    const userInfo = this.state.userInfo
    userInfo[field] = val
    this.setState({userInfo})
  }

  render() {

    const years = R.range(this.state.dateInfo.year.from, this.state.dateInfo.year.to + 1)

    let maxDate = 31

    if (this.state.userInfo.year && this.state.userInfo.month) {
      let days = daysInMonth(parseInt(this.state.userInfo.month), parseInt(this.state.userInfo.year))
      if (days < 31) {
        maxDate = days
      }
    }

    const dates = R.range(1, maxDate + 1)

    const {userInfo} = this.state

    return (<div id="details">
      <h1>My details</h1>
      <hr/>
      <div>
        <h2>Name</h2>
        <div className="name-wrapper row">
          <div className="col-sm-6">
            <FieldGroup
              id="formControlsText"
              type="text"
              value={userInfo.name}
              onChange={(e) => this.handleChange('name', e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="col-sm-6">
            <FieldGroup
              id="formControlsText"
              type="text"
              value={userInfo.surname}
              onChange={(e) => this.handleChange('surname', e.target.value)}
              placeholder="Surname"
            />
          </div>
        </div>
        <h2>Age and Gender</h2>
        <div className="age-wrapper row">
          <div className="col-sm-6">
            <div className="row">
              <div className="col-sm-4">
                <FormControl componentClass="select" placeholder="select"
                  className="col-sm-4"
                  value={userInfo.date}
                  onChange={e => this.handleChange('date', e.target.value)}>
                  <option value="select">Date</option>
                  {dates.map((date, index) => (<option value={date} key={index}>{date}</option>))}
                </FormControl>
              </div>
              <div className="col-sm-4">
                <FormControl componentClass="select" placeholder="select"
                  className="col-sm-4"
                  value={userInfo.month}
                  onChange={e => this.handleChange('month', e.target.value)}>
                  <option value="select">Month</option>
                  {this.state.dateInfo.months
                    .map((month, index) => (<option value={index + 1} key={index}>{month}</option>))}
                </FormControl>
              </div>
              <div className="col-sm-4">
                <FormControl componentClass="select" placeholder="select"
                  className="col-sm-4"
                  value={userInfo.year}
                  onChange={e => this.handleChange('year', e.target.value)}>
                  <option value="select">Year</option>
                  {years.map((year) => (<option value={year} key={year}>{year}</option>))}
                  <option value="other">...</option>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <FormControl
              componentClass="select"
              placeholder="select"
              value={userInfo.gender}
              onChange={(e) => this.handleChange('gender', e.target.value)}>
              <option value="select">gender</option>
              <option value="Male">Male</option>
              <option value="Male">Female</option>
            </FormControl>
          </div>
        </div>
        <div className="button-wrapper">
          <Button bsStyle="primary" className="details-button" onClick={this.onNextClick}>Next</Button>
        </div>
      </div>
    </div>)
  }

}

export default graphql(gql`{
    allUsers {
      name
      surname
      gender
      id
      birthdate
    }
  }
`)(Details)