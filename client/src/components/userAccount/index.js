import React from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import helpers from '../../helpers';
import { logout } from '../../features/user/userAPI';
import { toggleProfile, toggleDeposit } from '../../features/user/userSlice';
import { ReactComponent as ProfileImg } from '../../resources/icons/profile.svg';
import { ReactComponent as MyBets } from '../../resources/icons/my-bets.svg';
import { ReactComponent as MyProfile } from '../../resources/icons/my-profile.svg';

class UserAccount extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      user_dropdown: false
    }
  }

  render() {
    const { balance, name, surname, email, toggleProfile, toggleDeposit } = this.props;
    const { user_dropdown } = this.state;
    
    return(
      <React.Fragment>
        <div className="user__balacne">
          <h5 className="user__balance__h5">{ helpers.balanceFormatter(balance) }</h5>
          <h6 className="user__balance__h6">Balance</h6>
        </div>
        <div className="user__deposit hover--opacity" onClick={() => toggleDeposit()}>
          Deposit
        </div>
        <div className="user__img" onClick={() => this.setState({ user_dropdown: !user_dropdown })}>
          <ProfileImg />
        </div>
        <div className={"user__dropdown" + (user_dropdown ? " opened" : "")}>
          <div className="user__dropdown__item user__dropdown__personal">
            <div className="user__dropdown__img-wrapper" ><ProfileImg /></div>
            <div className="user__personal__data">
              <h3 className="user__personal__h3">{ name } { surname }</h3>
              <h5 className="user__personal__h5">{ email }</h5>
            </div>
          </div>
          <div className="user__dropdown__item">
            <Link to='/my-bets'>
              <div className="user__dropdown__nav-item"><div><MyBets /></div>My bets</div>
            </Link>
            <div className="user__dropdown__nav-item" onClick={() => toggleProfile()}><div><MyProfile /></div>My profile</div>
          </div>
          <div className="user__dropdown__item">
            <div className="user__dropdown__nav-item hover--opacity logout" onClick={() => logout()} >Log out</div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { user: { balance, name, surname, email } } = state;
  
  return { 
    balance,
    name,
    surname,
    email
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleProfile: () => dispatch(toggleProfile()),
    toggleDeposit: () => dispatch(toggleDeposit())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAccount);
