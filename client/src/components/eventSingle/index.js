import React from 'react';
import './style.scss';

class EventSingle extends React.Component {

  getTime(){
    const { event } = this.props;

    let h = new Date(parseInt(event.start_time)).getHours();
    let m = new Date(parseInt(event.start_time)).getMinutes();
    return h + ':' + m + ' h';
  }

  render() {
    const { event, results } = this.props;

    return(
      <div className="event">
        <div className="event__info">
          <h5 className="event__info__h5">{ event.host } &nbsp;&ndash;&nbsp; { event.guest }</h5>
          <h6 className="event_info__h6">{ this.getTime() }</h6>
        </div>
        <div className="event__quotas">
          {
            results.map((result, i) => {
              return (
                <div key={i} className="event__quota hover--opacity">
                  <div className="event__quota__type">{ result }</div>
                  <div className="event__quota__value">{ event.odds[result].value.toFixed(2) }</div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default EventSingle;
