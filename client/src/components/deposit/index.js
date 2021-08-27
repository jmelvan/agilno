import React from 'react';
import { connect } from 'react-redux';
import { toggleDeposit, deposit } from '../../features/user/userSlice';
import helpers from '../../helpers';
import './style.scss';

class Deposit extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      closing: false,
      card_number: '',
      card_expire: '',
      card_cvv: '',
      amount: '',
      submitAvailable: false
    }
  }

  componentDidUpdate() {
    const { depositSuccessMsg } = this.props;
    const { card_number, card_expire, card_cvv } = this.state;
    
    depositSuccessMsg && card_number != '' && card_expire != '' && card_cvv != '' && this.emptyFields();
  }

  startClosing() {
    this.setState({ closing: true }, () => this.close());
  }

  close() {
    setTimeout(() => {
      this.setState({ closing: false });
      this.props.toggleDeposit();
    }, 350)
  }

  // function to empty fields after successfull deposit
  emptyFields() { this.setState({ card_number: '', card_expire: '', card_cvv: '', amount: '' }) }

  // function to handle change of inputs
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value }, () => {
      const { card_number, card_expire, card_cvv, amount } = this.state;
      
      if(card_number != '' && card_expire != '' && card_cvv != '' && amount != '')
        this.setState({ submitAvailable: true });
      else
        this.setState({ submitAvailable: false });
    })
  }

  render() {
    const { isDepositOpened, depositErrorMsg, depositSuccessMsg, deposit } = this.props;
    const { submitAvailable, closing, card_number, card_expire, card_cvv, amount } = this.state;

    return(
      <div className={"popup-wrapper" + (isDepositOpened ? " opened" : "") + (closing ? " closing" : "")}>
        <div className="close-popup" onClick={() => this.startClosing()}></div>
        <div className="deposit">
          <div className="close-icon hover--opacity" onClick={() => this.startClosing()}><div></div></div>
          <h2 className="popup__h2">Deposit</h2>
          {depositErrorMsg && helpers.popupMsg('error', depositErrorMsg)}
          {depositSuccessMsg && helpers.popupMsg('success', depositSuccessMsg)}
          <div className="grid">
            <input className="popup__input" name="card_number" type="number" placeholder="Card number" 
              onChange={e => this.handleChange(e)} />
            <input className="popup__input" name="card_expire" type="text" placeholder="MM/YY" 
              onChange={e => this.handleChange(e)} />
            <input className="popup__input" name="card_cvv" type="text" placeholder="CVV" 
              onChange={e => this.handleChange(e)} />
            <input className="popup__input" name="amount" type="number" placeholder="Amount" 
              onChange={e => this.handleChange(e)} />
            <div className={"popup__cta deposit__cta hover--opacity" + (submitAvailable ? "" : " disabled")}
              onClick={() => deposit({ card_number: card_number, card_expire: card_expire, card_cvv: card_cvv, amount: amount })}>Deposit</div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user: { isDepositOpened, depositErrorMsg, depositSuccessMsg } } = state;
  
  return { 
    isDepositOpened,
    depositErrorMsg,
    depositSuccessMsg
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDeposit: () => dispatch(toggleDeposit()),
    deposit: (data) => dispatch(deposit(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
