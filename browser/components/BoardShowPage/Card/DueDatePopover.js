import React, {Component} from 'react'
import $ from 'jquery'
import Form from '../../Form'
import Button from '../../Button'
import DialogBox from '../../DialogBox'
import moment from 'moment'

export default class DueDatePopover extends Component {
  constructor(props){
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.dateOnChange = this.dateOnChange.bind(this)
    this.dateOnBlur = this.dateOnBlur.bind(this)
    this.timeOnChange = this.timeOnChange.bind(this)
    this.timeOnBlur = this.timeOnBlur.bind(this)
    this.removeDueDate = this.removeDueDate.bind(this)
    this.updateCard = this.updateCard.bind(this)

    let date = moment().add(1, 'days').format('MM/DD/YYYY')
    let time = '12:00 PM'
    if (this.props.card.dueDate) {
      let currentDueDate = moment(this.props.card.dueDate)
      date = currentDueDate.format('MM/DD/YYYY')
      time = currentDueDate.format('hh:mm A')
    }

    this.state = {
      date: date,
      time: time
    }
  }

  onSubmit(event){
    event.preventDefault()
    let newDueDate = {dueDate: `${this.state.date} ${this.state.time}`}
    this.updateCard(newDueDate)
  }

  removeDueDate(event){
    event.preventDefault()
    let nullDueDate = {dueDate: null}
    this.updateCard(nullDueDate)
  }

  updateCard(data){
    $.ajax({
      method: 'put',
      url: `/api/cards/${this.props.card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType:"json",
      data: JSON.stringify(data)
    }).then( () => {
      boardStore.reload()
      this.props.onClose()
    })
  }

  dateOnChange(event){
    this.setState({date: event.target.value})
  }

  dateOnBlur(event){
    if (!moment(this.state.date).isValid()) {
      this.setState({
        date: moment().add(1, 'days').format('MM/DD/YYYY')
      })
    }
  }

  timeOnChange(event){
    this.setState({time: event.target.value})
  }

  timeOnBlur(event){
    if (!moment(this.state.time, 'hh:mm').isValid()) {
      this.setState({
        time: '12:00 AM'
      })
    } else {
      this.setState({
        time: moment(this.state.time, 'hh:mm').format('hh:mm A')
      })

    }
  }


  render (){
    return <DialogBox className="CardModal-CopyCardDialog dueDate" heading='Change Due Date' onClose={this.props.onClose}>
      <Form onSubmit={this.onSubmit}>
        <div className="CardModal-CopyCardDialog-FlexRow">
          <label>Date<input type='text' value={this.state.date} onChange={this.dateOnChange} onBlur={this.dateOnBlur}></input></label>
          <label>Time<input type='text' value={this.state.time} onChange={this.timeOnChange} onBlur={this.timeOnBlur}></input></label>
        </div>
        <p>There will be a calendar and such here.  Perhaps its own component?</p>
        <div className="CardModal-CopyCardDialog-FlexRow">
          <Button type='primary' submit>Save</Button>
        </div>
      </Form>
      <Form onSubmit={this.removeDueDate}>
        <Button submit type='danger'>Remove</Button>
      </Form>
    </DialogBox>
  }
}
