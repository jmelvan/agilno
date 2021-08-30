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
    const { checkUserLogin } = this.props;

    checkUserLogin().unwrap().then(user => {
      user.role == 'admin' && window.location.replace('/admin');
    });
  }

  componentDidUpdate(prevProps) {
    const { isLoggedIn, checkUserLogin } = this.props;

    if(prevProps.isLoggedIn != isLoggedIn)
      checkUserLogin().unwrap().then(user => {
        user.role == 'admin' && window.location.replace('/admin');
      });
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

function mapStateToProps(state) {
  const { user: { isLoggedIn } } = state;

  return {
    isLoggedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkUserLogin: () => dispatch(checkUserLogin())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
