import React from 'react';
import { getAllEvents, deleteEvent, addEvent, finishOne } from '../../features/events/eventsSlice';
import { getQuotas } from '../../features/quotas/quotasSlice';
import { connect } from 'react-redux';

class AdminCompetitions extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      closing: false,
      popup: false,
      selectedCompetition: "undefined",
      selectedHost: "undefined",
      selectedGuest: "undefined",
      day: '',
      month: '',
      year: '',
      minute: '',
      hour: ''
    }
    this.handleInput = this.handleInput.bind(this);
  }

  formatTime(timestamp){
    var date = new Date(parseInt(timestamp))
    let h = date.getHours(),
      m = date.getMinutes(),
      dd = date.getDate(),
      mm = date.getMonth()+1,
      yy = date.getFullYear()
    return dd + '.' + mm + '.' + yy + ' ' + h + ':' + m + ' h';
  }

  startClosing() {
    this.setState({ closing: true }, () => this.close());
  }

  close() {
    setTimeout(() => {
      this.setState({ closing: false, popup: false });
    }, 350)
  }

  delete(id) {
    const { deleteEvent, getAllEvents } = this.props;
    deleteEvent(id).then(() => getAllEvents());
  }

  finish(id) {
    const { finishOne, getAllEvents } = this.props;
    finishOne(id).then(() => getAllEvents());
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  addNew() {
    const { addEvent, getAllEvents } = this.props;
    const { selectedCompetition, selectedHost, selectedGuest, day, month, year, hour, minute } = this.state

    if(selectedHost == "undefined" || 
      selectedGuest == "undefined" || 
      selectedCompetition == "undefined" ||
      day == '' || month == '' || year == '' || hour == '' || minute == '' ) return alert('Please fill in all fields.');
    
    // regex check for numbers
    const reg = new RegExp('^[0-9]+$');
    // fields to check
    var arr = [day, month, year, hour, minute];
      
    // check if numbers
    for(let el of arr)
      if(!reg.test(el)) return alert('Please enter valid date.')

    if(parseInt(day) > 31 || parseInt(day) < 0 || parseInt(month) > 12 || parseInt(month) < 0 || year.length != 4) return alert('Please enter valid date.')
    
    var start_time = new Date(year, month-1, day, hour, minute);

    addEvent(selectedHost, selectedGuest, start_time.getTime(), selectedCompetition).then(() => {
      this.setState({ day: '', month: '', year: '', hour: '', minute: '', 
        selectedHost: "undefined", selectedGuest: "undefined", selectedCompetition: "undefined" }); // return defaults
      this.startClosing(); // close popup
      getAllEvents(); // refresh events list
      getQuotas(); // refresh quotas list
    })
  }

  getCompetitionType(id) {
    const { competitions } = this.props;
    for(let competition of competitions)
      if(competition.id == id)
        return { type: competition.type, sport: competition.sport_name };
    return 0;
  }

  // function to get hosts list from competition id
  getHostsByCompetition(id) {
    const { teams, players } = this.props;
    var conditions = this.getCompetitionType(id);
    var hosts = [];
    // check conditions
    if(conditions.type == 'individual') {
      for(let player of players)
        if(player.sport_name == conditions.sport)
          hosts.push(player);
    } else { // else, types are national or club, and they are both team category
      for(let team of teams)
        if(team.sport_name == conditions.sport && team.type == conditions.type)
          hosts.push(team);
    }
    // return hosts
    return hosts;
  }

  // function to get guest after selected host_id
  getGuestsByHost(host_id, competition_id) {
    var hosts = this.getHostsByCompetition(competition_id);
    // filter hosts, remove selected host
    var guests = hosts.filter(host => host.id != host_id);
    return guests;
  }

  render() {
    const { competitions, events } = this.props;
    const { popup, closing, selectedCompetition, selectedHost, selectedGuest, day, month, year, hour, minute } = this.state;

    return(
      <React.Fragment>
        <div className="slider-wrapper">
          <div className="slider-title">Events <div className="add-new hover--opacity" onClick={() => this.setState({ popup: true })}>Add new</div></div>
          <div className="slider">
            {
              events && events.length ? 
                events.map((event, i) => {
                  return <div key={i} className={"admin-item" + (event.event_result != null ? " finished" : "")}>
                    <div className="admin-item__name">
                      { 
                        event.competition_type == 'individual' ? 
                          event.host_player : event.host 
                      } &nbsp;&ndash;&nbsp; {
                        event.competition_type == 'individual' ? 
                          event.guest_player : event.guest 
                      }  
                    </div>
                    <div className="admin-item__config">
                      <div>Result:</div>
                      <div>{ event.event_result == null ? "Unfinished" : event.event_result }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Event id:</div>
                      <div>{ event.event_id }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Competition:</div>
                      <div>{ event.competition_name }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Competition type:</div>
                      <div>{ event.competition_type }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Sport:</div>
                      <div>{ event.sport_name }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Time:</div>
                      <div>{ this.formatTime(event.start_time) }</div>
                    </div>
                    <div className="admin-item__config">
                      <div className="admin-item__delete hover--opacity" onClick={() => this.delete(event.event_id)}>Delete</div>
                      {/* { 
                        event.event_result == null ? 
                          <div className="admin-item__finish hover--opacity" onClick={() => this.finish(event.event_id)}>Finish</div> 
                        : "" 
                      } */}
                    </div>
                  </div>
                })
              : <div className="slider__empty">No events</div>
            }
          </div>
          <div className={"popup-wrapper" + (popup ? " opened" : "") + (closing ? " closing" : "")}>
            <div className="close-popup" onClick={() => this.startClosing()}></div>
            <div className="admin-popup">
              <div className="admin-popup__title">Add Event</div>
              <div className="admin-popup__row">
                <select name="selectedCompetition" onChange={this.handleInput} value={selectedCompetition}>
                  <option value="undefined" default disabled>Select competition</option>
                  {
                    competitions && competitions.map((competition, i ) => {
                      return <option key={i} value={competition.id}>{ competition.name }</option>
                    })
                  }
                </select>
              </div>
              {
                selectedCompetition != "undefined" ? 
                  <div className="admin-popup__row">
                    <select name="selectedHost" onChange={this.handleInput} value={selectedHost}>
                      <option value="undefined" default disabled>Select host</option>
                      {
                        this.getHostsByCompetition(selectedCompetition).map((host, i) => {
                          return <option key={i} value={host.id}>{ host.name }</option>
                        })
                      }
                    </select>
                  </div>
                : ""
              }
              {
                selectedHost != "undefined" ?
                  <div className="admin-popup__row">
                    <select name="selectedGuest" onChange={this.handleInput} value={selectedGuest}>
                      <option value="undefined" default disabled>Select guest</option>
                      {
                        this.getGuestsByHost(selectedHost, selectedCompetition).map((guest, i) => {
                          return <option key={i} value={guest.id}>{ guest.name }</option>
                        })
                      }
                    </select>
                  </div>
                : ""
              }
              <div className="admin-popup__row grid-3">
                <input className="admin-popup__input" type="text" name="day" placeholder="Day" value={day} onChange={this.handleInput} />
                <input className="admin-popup__input" type="text" name="month" placeholder="Month" value={month} onChange={this.handleInput} />
                <input className="admin-popup__input" type="text" name="year" placeholder="Year" value={year} onChange={this.handleInput} />
              </div>
              <div className="admin-popup__row grid-2">
                <input className="admin-popup__input" type="text" name="hour" placeholder="Hour" value={hour} onChange={this.handleInput} />
                <input className="admin-popup__input" type="text" name="minute" placeholder="Minute" value={minute} onChange={this.handleInput} />
              </div>
              <div className="popup__cta admin-popup__cta hover--opacity" onClick={() => this.addNew()}>Add Event</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { events: { events }, competitions: { competitions }, teams: { teams }, players: { players } } = state;
  
  return { 
    competitions,
    events,
    teams, 
    players
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getQuotas: () => dispatch(getQuotas()),
    getAllEvents: () => dispatch(getAllEvents()),
    deleteEvent: (id) => dispatch(deleteEvent({ id: id })),
    finishOne: (id) => dispatch(finishOne({ id: id })),
    addEvent: (host_id, guest_id, start_time, competition_id) => 
      dispatch(addEvent({ host_id: host_id, guest_id: guest_id, start_time: start_time, competition_id: competition_id }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminCompetitions);
