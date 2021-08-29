import React from 'react';
import { connect } from 'react-redux';
import BetslipBet from '../betslipBet';
import { removeAllBets, placeBet, setBetslipError, removeBetslipError, removeBetslipSuccess } from '../../features/events/eventsSlice';
import { updateUserInStore } from '../../features/user/userSlice';
import { openPopup } from '../../features/login/loginSlice';
import helpers from '../../helpers';
import './style.scss';

class Betslip extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      type: 'single',
      totalStake: '',
      totalPotWin: '',
      totalOdds: 0
    }
    this.handleStakeWin = this.handleStakeWin.bind(this);
    this.handleType = this.handleType.bind(this);
  }

  componentDidUpdate(prevProps) {
    prevProps.placeBetError && this.props.removeBetslipError(); // remove error if it's shown

    if(prevProps.bets != this.props.bets)
      this.state.type == 'single' ? this.calculateSingleTotalStakeWin() : this.calculateMultipleTotalOdds();
  }

  calculateSingleTotalStakeWin() {
    const { bets } = this.props;
    // initialize zeroes so we can add
    var totalStake = 0, totalPotWin = 0;
    // loop through bets in betslip search for stakes
    Object.keys(bets).map(bet => {
      totalStake += bets[bet].stake ? parseFloat(bets[bet].stake) : 0;
      // if betslip type is single, total potential win is calculated by addition of single wins
      totalPotWin += bets[bet].stake ? parseFloat(bets[bet].stake) * parseFloat(bets[bet].odd.value) : 0;
    });
    this.setState({ totalStake: totalStake || '', totalPotWin: totalPotWin || '' });
  }

  calculateMultipleTotalOdds() {
    const { bets } = this.props;
    // initialize one so we can multiply
    var totalOdds = 1;
    // loop through bets in betslip search for stakes
    Object.keys(bets).map(bet => {
      // if betslip type is multiple, we need to multiply all odds
      totalOdds *= bets[bet].odd.value;
    });
    this.setState({ totalOdds: totalOdds });
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
    const { totalStake, totalPotWin, totalOdds } = this.state;
    // check which input is changed
    if(changedInput == 'totalPotWin'){
      var newStake = parseFloat((totalPotWin / parseFloat(totalOdds)).toFixed(2)); // calculate stake
      this.setState({ totalStake: newStake ? newStake : '' });
    } else {
      var newWin = parseFloat((totalStake * parseFloat(totalOdds)).toFixed(2)); // calculate win
      this.setState({ totalPotWin: newWin ? newWin : '' })
    }
  }

  // function to handle change of betslip type
  handleType(e) {
    // get clicked type
    var type = e.target.getAttribute('name');
    // return input states to empty
    this.setState({ type: type, totalStake: '', totalPotWin: '' }); 
    // call action based on new betslip type
    type == 'multiple' ? this.calculateMultipleTotalOdds() : this.calculateSingleTotalStakeWin();
  }

  // function to create betslip request query (fields needed: betslip type, quotas with id's and stakes, stake of betslip if multiple)
  buildBetslipRequest() {
    const { type, totalStake } = this.state;
    const { bets, placeBet, setBetslipError, removeAllBets, removeBetslipSuccess, updateUserInStore } = this.props;
    // starting condition
    if (!Object.keys(bets).length) return setBetslipError('Please add bets.');

    var quotas = [], send = true;
    // build quotas query based on betslip type
    if(type == 'single'){
      Object.keys(bets).map(bet => {
        // for successfull placing bet in type single, every pair must have stake
        if(!bets[bet].stake || bets[bet].stake == "") send = false;
        // if passed condition, pust to quotas query
        quotas.push({ id: bets[bet].odd.id, stake: bets[bet].stake });
      })
      // dispatch error if check failed
      !send && setBetslipError('Please set stake for every bet.')
    } else {
      if(!totalStake || totalStake == '') send = false;
      Object.keys(bets).map(bet => quotas.push({ id: bets[bet].odd.id }));
      // dispatch error if check failed
      !send && setBetslipError('Please set total stake.')
    }
    // dispatch place bet if all checks are passed
    if(send) {
      placeBet(type, quotas, totalStake).then(() => {
        removeAllBets();
        updateUserInStore();
        setTimeout(() => removeBetslipSuccess(), 2000);
      });
    }
  }

  render() {
    const { isLoggedIn, bets, removeAllBets, openPopup, placeBetError, placeBetSuccess } = this.props;
    const { type, totalStake, totalPotWin, totalOdds } = this.state;

    return(
      <div className="betslip-wrapper">
        <div className={"betslip " + type}>
          <div className="betslip-header">
            <div className="betslip-header__title">Bet Slip</div>
          </div>
          <div className="betslip-nav">
            <div className="betslip-nav__type-select">
              <div className={"betslip__type" + (type == 'single' ? ' active' : '')} name="single" onClick={this.handleType}>Single</div>
              <div className={"betslip__type" + (type == 'multiple' ? ' active' : '')} name="multiple" onClick={this.handleType}>Multiple</div>
            </div>
          </div>
          <div className="betslip-options">
            <div className="betslip__remove-all" onClick={() => removeAllBets()}>Remove all</div>
          </div>
          <div className={"betslip__bets" + (Object.keys(bets).length ? "" : " empty")}>
            {
              Object.keys(bets).length ? 
                Object.keys(bets).map((bet, i) => <BetslipBet key={i} bet={bets[bet]} type={type} />)
                :
                <div className="betslip__empty">Betslip is empty</div>
            }
          </div>
          {
            Object.keys(bets).length ? 
              <div className="betslip__summary">
                {
                  type == 'multiple' ?
                    <div className="multiple__stake-win">
                      <input className="bet__input" name="totalStake" type="text" placeholder="Total stake" value={totalStake} onChange={this.handleStakeWin} />
                      <input className="bet__input" name="totalPotWin" type="text" placeholder="Total win" value={totalPotWin} onChange={this.handleStakeWin} />
                    </div>
                  : ""
                }
                <h3 className="betslip__summary__h3">Summary</h3>
                {
                  type == 'multiple' ?
                    <div className="betslip__total-bet">
                      <div>Total odds:</div>
                      <div className="betslip__total-bet__value">{ totalOdds.toFixed(2) }</div>
                    </div>
                  : ""
                }
                <div className="betslip__total-bet">
                  <div>Total bet:</div>
                  <div className="betslip__total-bet__value">{ helpers.balanceFormatter(totalStake) }</div>
                </div>
                <div className="betslip__total-win">
                  <div>Total Potential Win:</div>
                  <div className="betslip__total-win__value">{ helpers.balanceFormatter(totalPotWin) }</div>
                </div>
              </div>
            : ""
          }
          {
            placeBetError && 
              <div className="betslip__msg">
                { helpers.popupMsg('error', placeBetError) }
              </div>
          }
          {
            placeBetSuccess && 
              <div className="betslip__msg">
                { helpers.popupMsg('success', placeBetSuccess) }
              </div>
          }
          <div className="betslip__cta-wrapper">
            <div className="betslip__cta" onClick={() => isLoggedIn ? this.buildBetslipRequest() : openPopup()}>
              { isLoggedIn ? "Place bet" : "Login to place bet" }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user: { isLoggedIn }, events: { bets, placeBetError, placeBetSuccess } } = state;
  
  return { 
    isLoggedIn,
    placeBetError,
    placeBetSuccess,
    bets
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeAllBets: () => dispatch(removeAllBets()),
    openPopup: () => dispatch(openPopup()),
    placeBet: (type, quotas, stake) => dispatch(placeBet({ type: type, quotas: quotas, stake: stake })),
    setBetslipError: (error) => dispatch(setBetslipError(error)),
    removeBetslipError: () => dispatch(removeBetslipError()),
    removeBetslipSuccess: () => dispatch(removeBetslipSuccess()),
    updateUserInStore: () => dispatch(updateUserInStore())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Betslip);
