import React from 'react';
import Events from '../events';
import './style.scss';

class Competition extends React.Component {

  render() {
    const { name, dates, results } = this.props;

    return(
      <div className="competition">
        <div className="competition__header">{ name }</div>
        { Object.keys(dates).map((date, i) => <Events key={i} date={date} events={dates[date].events} results={results} />) }
      </div>
    )
  }
}

export default Competition;
