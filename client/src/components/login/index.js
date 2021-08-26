import React from 'react';
import { login } from './features/user/userSlice';
import { connect } from 'react-redux';

class App extends React.Component {
  constructor(props){
    super(props);
    
  }

  render() {
    const { dispatch, isLoggedIn } = this.props;
    
    return(
      <div>
        <div>{isLoggedIn ? "in" : "out"}</div>
        <button onClick={() => dispatch(login())}>test</button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { user: { isLoggedIn } } = state;
  
  return { 
    isLoggedIn
  }
}

export default connect(mapStateToProps)(App);