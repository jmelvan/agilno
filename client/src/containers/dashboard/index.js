import React from 'react';
import Header from '../../components/header';
import LoginRegisterPopup from '../../components/loginRegisterPopup';
import Profile from '../../components/profile';
import Deposit from '../../components/deposit';
import { checkUserLogin } from '../../features/user/userSlice';
import { connect } from 'react-redux';
import './style.scss';

class Dashboard extends React.Component {

  componentDidMount() {
    this.props.checkUserLogin();
  }

  render() {

    return(
      <React.Fragment>
        <Header />
        <LoginRegisterPopup />
        <Profile />
        <Deposit />
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkUserLogin: () => dispatch(checkUserLogin())
  }
}

export default connect(null, mapDispatchToProps)(Dashboard);
