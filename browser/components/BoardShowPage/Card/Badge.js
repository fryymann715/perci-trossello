import React, {Component} from 'react'
import $ from 'jquery'
import Link from '../../Link'
import Icon from '../../Icon'
import moment from 'moment'
import './Badge.sass'
import './CardModal.sass'
import PopoverMenuButton from '../../PopoverMenuButton'
import DueDatePopover from './DueDatePopover'

export default class Badge extends Component {
  constructor(props){
    super(props)
    this.dueStatus = this.dueStatus.bind(this)
  }

  dueStatus() {
    const dueDate = moment(this.props.card.due_date)
    const pastDue = moment().isAfter(dueDate)
    const status = {
      styling: '',
      preText: '',
      postText: ''
    }

    if (pastDue) {
      if (dueDate.isBefore(moment().subtract(1, 'days'), 'day')) {
        status.styling = 'Badge-due-past-long'
        status.preText = dueDate.format('MMM D [at] h:mm')
        status.postText = '(past due)'
      } else {
        status.styling = 'Badge-due-past-recent'
        status.preText = dueDate.calendar(moment(), 'D hh:mm A');
        status.postText = '(recently past due)'
      }
    } else {
      if (dueDate.isAfter(moment().add(1, 'days'), 'day')) {
        status.styling = 'Badge-due-future-distant'
        status.preText = dueDate.format('MMM D [at] h:mm')
      } else {
        status.styling = 'Badge-due-future-near'
        status.preText = dueDate.calendar(moment(), 'D hh:mm A');
        status.postText = '(due soon)'
      }
    }
    if (this.props.card.complete){
      status.styling = 'Badge-due-complete'
      status.postText = ''
    }
    return status
  }

  render(){
    const { card, shownOn } = this.props
    let status = this.dueStatus()
    let styling = 'Badge-due ' + status.styling
    let renderBadge

    if(shownOn === 'front'){
      let shortDate = moment(card.due_date).format('MMM D')
      renderBadge = <div className={styling}><Icon type="clock-o"/><span>{shortDate}</span></div>
    } else {
      let longDate = status.preText
      const dueDatePopover = <DueDatePopover card={card}/>
      styling += ' Badge-due-large'
      renderBadge = (
          <div className='CardModal-CardBadges'>
            <div className='CardModal-CardBadges-header'>Due Date</div>
            <PopoverMenuButton key={card.id} type='unstyled' popover={dueDatePopover} className='CardModal-CardBadges-labels-Label Badge-buttonHack'>
              <div className={styling}><span>{longDate + ' ' + status.postText}</span></div>
            </PopoverMenuButton>
          </div>
      )
    }

    return renderBadge

  }

}
