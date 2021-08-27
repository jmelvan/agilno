import React from 'react';
import { connect } from 'react-redux';
import { getEvents } from '../../features/events/eventsSlice';
import SportSingle from '../sportSingle';
import './style.scss';

class Sports extends React.Component {

  componentDidMount() {
    this.props.getEvents();
  }

  render() {
    const { sports } = this.props;

    return(
      <div className="sports">
        <h2 className="sports__h2">All events</h2>
        {
          sports && Object.keys(sports).map((sport, i) => {
            return <SportSingle key={i} name={sport} competitions={sports[sport].competitions} results={sports[sport].results} />
          })
        }
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
    getEvents: () => dispatch(getEvents())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sports);
