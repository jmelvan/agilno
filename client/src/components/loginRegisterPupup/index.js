import React from 'react';
import { connect } from 'react-redux';
import { login, register } from '../../features/user/userSlice';
import { closePopup, toggleRegister } from '../../features/login/loginSlice';
import './style.scss';

class Header extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      closing: false,
      email: undefined,
      password: undefined
    }
  }

  startClosing() {
    this.setState({ closing: true }, () => this.close());
  }

  close() {
    setTimeout(() => {
      this.setState({ closing: false });
      this.props.closePopup();
    }, 350)
  }

  forgotPassword() {
    return <p className="popup__p">Forgot password? <span onClick={() => toggleRegister()}>Click here</span></p>
  }

  showError(errorMsg) {
    return <div className="popup__error">{errorMsg}</div>
  }

  render() {
    const { login, openPopup, isRegistered, toggleRegister, errorMsg } = this.props;
    
    return(
      <div className={"popup-wrapper" + ( openPopup ? " opened" : "") + ( this.state.closing ? " closing" : "")}>
        <div className="close-popup" onClick={() => this.startClosing()}></div>
        <div className="form">
          <h2 className="popup__h2">{ isRegistered ? "Login" : "Register" }</h2>
          {errorMsg && this.showError(errorMsg)}
          <input className="popup__input" name="email" type="text" placeholder="Email" onChange={e => this.setState({ email: e.target.value || undefined })} />
          <input className="popup__input" name="password" type="password" placeholder="Password" onChange={e => this.setState({ password: e.target.value || undefined })} />
          { isRegistered && this.forgotPassword() }
          <div className="popup__cta" onClick={() => isRegistered ? login(this.state.email, this.state.password) : register()}>{ isRegistered ? "Login" : "Proceed" }</div>
          <p className="popup__p">
            { isRegistered ? "Still don't have account? " : "Already have account? " }
            <span onClick={() => toggleRegister()}>{ isRegistered ? "Register" : "Login" }</span>
          </p>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { login: { openPopup, isRegistered, errorMsg } } = state;
  
  return { 
    openPopup,
    isRegistered,
    errorMsg
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    closePopup: () => dispatch(closePopup()),
    login: (email, password) => dispatch(login({ email: email, password: password })),
    toggleRegister: () => dispatch(toggleRegister())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
