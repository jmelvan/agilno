import React from 'react';
import Header from '../../components/header';
import Profile from '../../components/profile';
import Deposit from '../../components/deposit';
import MyBetslip from '../../components/myBetslip';
import { checkUserLogin, getUserBets } from '../../features/user/userSlice';
import { connect } from 'react-redux';
import './style.scss';

class MyBets extends React.Component {

  componentDidMount() {
    this.props.checkUserLogin().then(() => {
      this.props.getUserBets();
    })
  }

  render() {
    const { betslips } = this.props;

    return(
      <React.Fragment>
        <Header />
        <section className="content-holder container maxw">
          <div className="grid">
            {
              betslips && Object.keys(betslips).map((betslip, i) => <MyBetslip key={i} betslip={betslips[betslip]} betslip_id={betslip} /> )
            }
          </div>
        </section>
        <Profile />
        <Deposit />
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { user: { isLoggedIn, betslips } } = state;
  
  return { 
    isLoggedIn,
    betslips
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    checkUserLogin: () => dispatch(checkUserLogin()),
    getUserBets: () => dispatch(getUserBets())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBets);
