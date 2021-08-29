import React from 'react';
import { connect } from 'react-redux';
import MyBetslipBet from '../myBetslipBet';
import helpers from '../../helpers';
import { cashout } from '../../features/events/eventsSlice';
import { updateUserInStore, getUserBets } from '../../features/user/userSlice';
import './style.scss';

class MyBetslip extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      totalPotWin: '',
      totalOdds: 1
    }
  }

  componentDidMount() {
    const { betslip } = this.props;

    betslip.type == 'multiple' && this.calculateMultipleTotalOdds();
  }

  calculateMultipleTotalOdds() {
    const { betslip } = this.props;
    // initialize one so we can multiply
    var totalOdds = 1;
    // loop through bets in betslip search for stakes
    betslip.pairs.map(bet => {
      // if betslip type is multiple, we need to multiply all odds
      totalOdds *= bet.quota_value;
    });

    this.setState({ totalOdds: totalOdds }, this.calculateWin(totalOdds));
  }

  // function to calculate win after new stake inputed
  calculateWin(totalOdds) {
    var newWin = parseFloat((this.props.betslip.total_stake * parseFloat(totalOdds)).toFixed(2)); // calculate win
    this.setState({ totalPotWin: newWin ? newWin : '' })
  }

  // function to proccess cashout
  processCashout() {
    const { cashout, betslip_id, updateUserInStore, getUserBets } = this.props;
    // dispatch cashout, then update states because user balance changes and my-betslips changes from win to cashedout
    cashout(betslip_id)
      .then(() => updateUserInStore())
      .then(() => getUserBets());
  }

  render() {
    const { betslip } = this.props;

    return(
      <div className="betslip my">
          <div className="betslip-header">
            <div className="betslip-header__title">Bet Slip</div>
          </div>
          <div className="betslip__bets">
            {
              betslip.pairs && betslip.pairs.map((bet, i) => <MyBetslipBet key={i} bet={bet} betslip_type={betslip.type} /> )
            }
          </div>
          <div className="my-betslip__summary">
            <h3 className="my-betslip__summary__h4">Status: <span>{ betslip.status }</span></h3>
            {
              betslip.type == 'multiple' &&
                <div className="betslip__total-bet">
                  <div>Total bet:</div>
                  <div className="betslip__total-bet__value">{ helpers.balanceFormatter(betslip.total_stake) }</div>
                </div>
            }
            {
              betslip.type == 'multiple' &&
                <div className="betslip__total-win">
                  <div>Total Potential Win:</div>
                  <div className="betslip__total-win__value">{ helpers.balanceFormatter(this.state.totalPotWin) }</div>
                </div>
            }
          </div>
          {
            betslip.status == 'win' && 
              <div className="betslip__cta-wrapper">
                <div className="betslip__cta" onClick={() => this.processCashout()}>
                  Cashout
                </div>
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
    cashout: (betslip_id) => dispatch(cashout({ betslip_id: betslip_id })),
    updateUserInStore: () => dispatch(updateUserInStore()),
    getUserBets: () => dispatch(getUserBets())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBetslip);
