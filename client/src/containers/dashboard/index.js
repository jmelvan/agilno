import React from 'react';
import Header from '../../components/header';
import LoginRegisterPupup from '../../components/loginRegisterPupup';
import { checkUserLogin } from '../../features/user/userSlice';
import { connect } from 'react-redux';

class Dashboard extends React.Component {

  componentDidMount() {
    this.props.checkUserLogin();
  }

  render() {

    return(
      <React.Fragment>
        <Header />
        <LoginRegisterPupup />
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
