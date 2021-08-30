import React from 'react';
import { getPlayers, addPlayer, deletePlayer } from '../../features/players/playersSlice';
import { connect } from 'react-redux';

class AdminPlayers extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      closing: false,
      popup: false,
      name: '',
      surname: '',
      country: '',
      selectedSport: "undefined",
      selectedTeam: "undefined"
    }
    this.handleInput = this.handleInput.bind(this);
  }

  startClosing() {
    this.setState({ closing: true }, () => this.close());
  }

  close() {
    setTimeout(() => {
      this.setState({ closing: false, popup: false });
    }, 350)
  }

  delete(id) {
    const { deletePlayer, getPlayers } = this.props;
    deletePlayer(id).then(() => getPlayers());
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  addNew() {
    const { addPlayer, getPlayers } = this.props;
    const { selectedTeam, name, surname, country, selectedSport } = this.state;
    
    // check conditions
    if(name == '' || surname == '' || country == '' || selectedSport == "undefined") return alert('Please fill in all fields.');
    
    // dispatch add team
    addPlayer(name, surname, selectedSport, country, selectedTeam == "undefined" ? null : selectedTeam).then(() => {
      this.setState({ name: '', surname: '', country: '', selectedSport: "undefined", selectedTeam: "undefined" }); // return defaults
      this.startClosing(); // close popup
      getPlayers(); // refresh teams
    })
  }

  getTypeFromSport(sport_name) {
    const { sports } = this.props;

    for(let sport of sports)
      if(sport.name == sport_name)
        return sport.type;
    return 0;
  }

  getTeamsInSport(sport_name) {
    var teams = [];

    for(let team of this.props.teams)
      if(team.sport_name == sport_name)
        teams.push(team);

    return teams;
  }

  render() {
    const { teams, sports, players } = this.props;
    const { popup, closing, country, name, surname, selectedSport, selectedTeam } = this.state;

    return(
      <React.Fragment>
        <div className="slider-wrapper">
          <div className="slider-title">Players <div className="add-new hover--opacity" onClick={() => this.setState({ popup: true })}>Add new</div></div>
          <div className="slider">
            {
              players && players.length ? 
                players.map((player, i) => {
                  return <div key={i} className="admin-item admin-sport">
                    <div className="admin-item__name">{ player.name + ' ' + player.surname }</div>
                    <div className="admin-item__config">
                      <div>Sport:</div>
                      <div>{ player.sport_name }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Country:</div>
                      <div>{ player.country }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Team:</div>
                      <div>{ player.team_name }</div>
                    </div>
                    <div className="admin-item__delete hover--opacity" onClick={() => this.delete(player.id)}>Delete</div>
                  </div>
                }) 
              : <div className="slider__empty">No players</div>
            }
          </div>
          <div className={"popup-wrapper" + (popup ? " opened" : "") + (closing ? " closing" : "")}>
            <div className="close-popup" onClick={() => this.startClosing()}></div>
            <div className="admin-popup">
              <div className="admin-popup__title">Add Player</div>
              <div className="admin-popup__row grid-2">
                <input className="admin-popup__input" type="text" name="name" placeholder="Name" value={name} onChange={this.handleInput} />
                <input className="admin-popup__input" type="text" name="surname" placeholder="Surname" value={surname} onChange={this.handleInput} />
              </div>
              <div className="admin-popup__row">
                <select name="selectedSport" onChange={this.handleInput} value={selectedSport}>
                  <option value="undefined" default disabled>Select Sport</option>
                  {
                    sports && sports.map((sport, i ) => {
                      return <option key={i} value={sport.name}>{ sport.name }</option>
                    })
                  }
                </select>
              </div>
              {
                (selectedSport != "undefined" && this.getTypeFromSport(selectedSport) == 'team') ?
                <div className="admin-popup__row">
                  <select name="selectedTeam" onChange={this.handleInput} value={selectedTeam}>
                    <option value="undefined" default>Select Team</option>
                    {
                      this.getTeamsInSport(selectedSport).map((team, i ) => {
                        return <option key={i} value={team.id}>{ team.name }</option>
                      })
                    }
                  </select>
                </div>
                : ""
              }
              <div className="admin-popup__row">
                <input className="admin-popup__input" type="text" name="country" placeholder="Country" value={country} onChange={this.handleInput} />
              </div>
              <div className="popup__cta admin-popup__cta hover--opacity" onClick={() => this.addNew()}>Add Player</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { teams: { teams }, sports: { sports }, players: { players } } = state;
  
  return { 
    teams,
    sports,
    players
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPlayers: () => dispatch(getPlayers()),
    deletePlayer: (id) => dispatch(deletePlayer({ id: id })),
    addPlayer: (name, surname, sport_name, country, team_id) => 
      dispatch(addPlayer({ name: name, surname: surname, sport_name: sport_name, country: country, team_id: team_id }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPlayers);
