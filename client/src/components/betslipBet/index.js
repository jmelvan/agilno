import React from 'react';
import { connect } from 'react-redux';
import { removeBet, setBetStake, removeBetslipError } from '../../features/events/eventsSlice';
import './style.scss';

class BetslipBet extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      stake: '',
      win: '',
      result_text: {
        '1': props.bet.event.host,
        '2': props.bet.event.guest,
        'x': 'Draw'
      }
    }
    this.handleStakeWin = this.handleStakeWin.bind(this);
  }

  componentDidUpdate(prevProps) {
    prevProps.placeBetError && this.props.removeBetslipError(); // remove error if it's shown
    // recalculate win if another quota for the same event is selected and stake is not empty
    if((prevProps.bet.odd.id != this.props.bet.odd.id && this.state.stake != ''))
      this.calculateStakeWin();
    
  }

  // handle stake and win inputs
  handleStakeWin(e) {
    const reg = new RegExp('([0-9]*[.])?[0-9]+'); // float numbers check
    // since it's text input, parse to numbers (text input because number input doen't handle text input)
    var number = parseFloat(e.target.value);
    // check numbers, if number is NaN (no input) than set state of input to empty or if not, set to input value
    (reg.test(number) || Number.isNaN(number)) && this.setState({
      [e.target.name]: !Number.isNaN(number) ? e.target.value : ''
    }, () => this.calculateStakeWin(e.target.name))
  }

  // function to calculate win after new stake inputed
  calculateStakeWin(changedInput) {
    const { stake, win } = this.state;
    const { bet: { odd: { value }, event: { event_id } } } = this.props
    // check which input is changed
    if(changedInput == 'win'){
      var newStake = parseFloat((win / parseFloat(value)).toFixed(2)); // calculate stake
      this.setState({ stake: newStake ? newStake : '' });
    } else {
      var newWin = parseFloat((stake * parseFloat(value)).toFixed(2)); // calculate win
      this.setState({ win: newWin ? newWin : '' })
    }
    // change bet stake in redux store (to calculate betslip summary)
    this.props.setBetStake(event_id, newStake || stake);
  }

  render() {
    const { bet, type, removeBet } = this.props;
    const { result_text, stake, win } = this.state;

    return(
      <div className="betslip__bet">
        <div className="bet__header">
          <div className="bet__opponents">{ bet.event.host } &nbsp;&ndash;&nbsp; { bet.event.guest }</div>
          <div className="bet__remove hover--opacity" onClick={() => removeBet(bet.event.event_id)}></div>
        </div>
        <div className="bet__header">
          <div className="bet__match-result">
            <div className="bet__match-result__title">Match result</div>
            <div className="bet__match-result__value">{ result_text[bet.odd.type] }</div>
          </div>
          <div className="bet__odd-wrapper">
            <div className="bet__odd">{ bet.odd.value.toFixed(2) }</div>
          </div>
        </div>
        { 
          type == 'single' && 
            <div className="bet__stake-win">
              <input className="bet__input" name="stake" type="text" placeholder="Stake" value={stake} onChange={this.handleStakeWin} />
              <input className="bet__input" name="win" type="text" placeholder="Win" value={win} onChange={this.handleStakeWin} />
            </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { events: { placeBetError } } = state;
  
  return { 
    placeBetError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeBet: (event_id) => dispatch(removeBet({ event_id: event_id })),
    setBetStake: (event_id, stake) => dispatch(setBetStake({ event_id: event_id, stake: stake })),
    removeBetslipError: () => dispatch(removeBetslipError())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetslipBet);
