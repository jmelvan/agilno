import React from 'react';
import Header from '../../components/header';
import LoginRegisterPopup from '../../components/loginRegisterPopup';
import Profile from '../../components/profile';
import Deposit from '../../components/deposit';
import Sports from '../../components/sports';
import Betslip from '../../components/betslip';
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
        <section className="content-holder container maxw">
          <Sports />
          <Betslip />
        </section>
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
