import React from 'react';
import { connect } from 'react-redux';
import { toggleBet } from '../../features/events/eventsSlice';
import { ReactComponent as Lock } from '../../resources/icons/lock.svg';
import './style.scss';

class EventSingle extends React.Component {

  getTime(){
    const { event } = this.props;

    let h = new Date(parseInt(event.start_time)).getHours();
    let m = new Date(parseInt(event.start_time)).getMinutes();
    return (h<10?'0':'') + h + ':' + (m<10?'0':'') + m + ' h';
  }

  render() {
    const { event, results, toggleBet, bets } = this.props;

    return(
      <div className="event">
        <div className="event__info">
          <h5 className="event__info__h5">
            { 
              event.competition_type == 'individual' ? 
                event.host_player : event.host 
            } &nbsp;&ndash;&nbsp; {
              event.competition_type == 'individual' ? 
                event.guest_player : event.guest 
            }
          </h5>
          <h6 className="event_info__h6">{ this.getTime() }</h6>
        </div>
        <div className="event__quotas">
          {
            results.map((result, i) => {
              if(event.odds && event.odds[result]){
                return (
                  <div key={i} 
                    className={"event__quota hover--opacity" + ((bets[event.odds[result].event_id] && bets[event.odds[result].event_id].odd.type == result) ? " active" : "")} 
                    onClick={() => toggleBet(event.odds[result], event)}
                  >
                    <div className="event__quota__type">{ result }</div>
                    <div className="event__quota__value">{ event.odds[result].value.toFixed(2) }</div>
                  </div>
                )
              } else 
                return <div className="event__quota--empty"><Lock /></div>
            })
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { events: { bets } } = state;
  
  return {
    bets
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleBet: (odd, event) => dispatch(toggleBet({event: event, odd: odd}))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventSingle);
