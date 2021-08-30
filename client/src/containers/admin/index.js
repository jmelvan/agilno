import React from 'react';
import { checkUserLogin, updateUserInStore } from '../../features/user/userSlice';
import { logout } from '../../features/user/userAPI';
import { getSports } from '../../features/sports/sportsSlice';
import { getCompetitions } from '../../features/competitions/competitionsSlice';
import { getAllEvents, finishAll } from '../../features/events/eventsSlice';
import { getQuotas } from '../../features/quotas/quotasSlice';
import { getTeams } from '../../features/teams/teamsSlice';
import { getPlayers } from '../../features/players/playersSlice';
import { connect } from 'react-redux';
import AdminSports from '../../components/adminSports';
import AdminCompetitions from '../../components/adminCompetitions';
import AdminEvents from '../../components/adminEvents';
import AdminQuotas from '../../components/adminQuotas';
import AdminTeams from '../../components/adminTeams';
import AdminPlayers from '../../components/adminPlayers'
import './style.scss';

class Admin extends React.Component {

  componentDidMount() {
    const { updateUserInStore, checkUserLogin, getSports, getCompetitions, getAllEvents, getQuotas, getTeams, getPlayers } = this.props
    // check again user role, but this time refreshed from server
    updateUserInStore().then(() => checkUserLogin().unwrap().then(user => {
      if(user.role != 'admin') window.location.replace('/');
      getSports();
      getCompetitions();
      getAllEvents();
      getQuotas();
      getTeams();
      getPlayers();
    }))
  }

  finishAllEvents() {
    const { finishAll } = this.props;
    // dispatch finish all events, then after finished, refresh events list
    finishAll().then(() => {
      window.confirm('All events finished.') && window.location.reload();
    });
  }

  render() {

    return(
      <React.Fragment>
        <div className="admin-header container">
          <div className="admin-title">Admin</div>
          <div className="admin-header__right">
            <div className="admin-header__cta green hover--opacity" onClick={() => this.finishAllEvents()}>Finish all events</div>
            <div className="admin-header__cta hover--opacity" onClick={() => logout()}>Logout</div>
          </div>
        </div>
        <section className="admin-content-holder container maxw">
          <AdminSports />
          <AdminCompetitions />
          <AdminEvents />
          <AdminQuotas />
          <AdminTeams />
          <AdminPlayers />
        </section>
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
    updateUserInStore: () => dispatch(updateUserInStore()),
    getSports: () => dispatch(getSports()),
    getCompetitions: () => dispatch(getCompetitions()),
    getAllEvents: () => dispatch(getAllEvents()),
    getQuotas: () => dispatch(getQuotas()),
    getTeams: () => dispatch(getTeams()),
    getPlayers: () => dispatch(getPlayers()),
    finishAll: () => dispatch(finishAll())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
