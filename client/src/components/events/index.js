import React from 'react';
import { connect } from 'react-redux';
import EventSingle from '../eventSingle';
import './style.scss';

class Events extends React.Component {

  render() {
    const { date, events, results } = this.props;

    return(
      <div className="events-group">
        <div className="events-group__header">{ date }</div>
        <div className="events-group__header">
          <div className="results__title">Events</div> 
          { results.map((result, i) => <div key={i} className="results__name">{ result }</div>) }
        </div>
        { events.map((event, i) => <EventSingle key={i} event={event} results={results} />) }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { events: { sports } } = state;
  
  return { 
    sports
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Events);
