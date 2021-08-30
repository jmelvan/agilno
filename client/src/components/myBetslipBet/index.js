import React from 'react';
import { connect } from 'react-redux';
import helpers from '../../helpers';

class MyBetslipBet extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      stake: props.bet.quota_stake,
      win: undefined,
      result_text: {
        '1': (props.bet.competition_type == 'individual' ? props.bet.host_player : props.bet.host_name),
        '2': (props.bet.competition_type == 'individual' ? props.bet.guest_player : props.bet.guest_name),
        'x': 'Draw'
      }
    }
  }

  componentDidMount() {
    this.calculateStakeWin();
  }

  // function to calculate win after new stake inputed
  calculateStakeWin() {
    const { stake } = this.state;
    const { bet: { quota_value } } = this.props;

    var newWin = parseFloat((stake * parseFloat(quota_value)).toFixed(2)); // calculate win
    this.setState({ win: newWin ? newWin : '' });
  }

  render() {
    const { bet, betslip_type } = this.props;
    const { result_text, stake, win } = this.state;

    return(
      <div className="betslip__bet">
        <div className="bet__header">
          <div className={"bet__opponents" + (bet.bet_status == 'win' ? ' winning' : '')}>
          { 
            bet.competition_type == 'individual' ? bet.host_player : bet.host_name
          } &nbsp;&ndash;&nbsp; { 
            bet.competition_type == 'individual' ? bet.guest_player : bet.guest_name
          }
          </div>
        </div>
        <div className="bet__header">
          <div className="bet__match-result">
            <div className="bet__match-result__title">Match result</div>
            <div className="bet__match-result__value">{ result_text[bet.quota_type] }</div>
          </div>
          <div className="bet__odd-wrapper">
            <div className="bet__odd">{ bet.quota_value.toFixed(2) }</div>
          </div>
        </div>
        {
          betslip_type == 'single' && 
            <div className="betslip__total-bet">
              <div>Stake:</div>
              <div className="betslip__total-bet__value">{ helpers.balanceFormatter(stake) }</div>
            </div>
        }
        {
          betslip_type == 'single' && 
            <div className="betslip__total-bet">
              <div>Win:</div>
              <div className="betslip__total-bet__value">{ helpers.balanceFormatter(win) }</div>
            </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {  } = state;
  
  return { 
    
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBetslipBet);
