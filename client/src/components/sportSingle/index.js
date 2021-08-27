import React from 'react';
import Competition from '../competition';
import './style.scss';

class SportSingle extends React.Component {

  render() {
    const { name, competitions, results } = this.props;

    return(
      <div className="sport">
        <div className="sport__header">{ name }</div>
        { 
          Object.keys(competitions).map((competition, i) => {
            return <Competition key={i} name={competition} dates={competitions[competition].dates} results={results} />
          })
        }
      </div>
    )
  }
}

export default SportSingle;
