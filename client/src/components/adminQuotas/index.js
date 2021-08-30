import React from 'react';
import { getQuotas, addQuota, deleteQuota } from '../../features/quotas/quotasSlice';
import { connect } from 'react-redux';

class AdminQuotas extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      closing: false,
      popup: false,
      type: '',
      value: '',
      selectedEvent: "undefined",
      selectedType: "undefined"
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
    const { deleteQuota, getQuotas } = this.props;
    deleteQuota(id).then(() => getQuotas());
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  addNew() {
    const { addQuota, getQuotas } = this.props;
    const { selectedType, value, selectedEvent } = this.state;
    // regex for checking if admin set odd value as number
    const reg = new RegExp('([0-9]*[.])?[0-9]+');
    // check conditions
    if(selectedType == "undefined" || value == '' || selectedEvent == "undefined") return alert('Please fill in all fields.');
    if(!reg.test(parseFloat(value))) return alert("Please enter number for value. Don't use letters or symbols.");

    // dispatch add quota
    addQuota(selectedEvent, selectedType, value).then(() => {
      this.setState({ selectedType: "undefined", value: '', selectedEvent: "undefined" }); // return defaults
      this.startClosing(); // close popup
      getQuotas(); // refresh sport list
    })
  }

  // function to get possible types (results) from event id for event
  getPossibleTypes(event_id) {
    const { events } = this.props;

    for(let event of events)
      if(event.event_id == event_id)
        return event.quota_types;
    return 0
  }

  render() {
    const { quotas, events } = this.props;
    const { popup, closing, type, value, selectedEvent, selectedType } = this.state;

    return(
      <React.Fragment>
        <div className="slider-wrapper">
          <div className="slider-title">Odds <div className="add-new hover--opacity" onClick={() => this.setState({ popup: true })}>Add new</div></div>
          <div className="slider">
            {
              quotas && quotas.length ?
                quotas.map((quota, i) => {
                  return <div key={i} className="admin-item admin-sport">
                    <div className="admin-item__name">
                      { 
                        quota.competition_type == 'individual' ? 
                          quota.host_player : quota.host_name
                      } &nbsp;&ndash;&nbsp; {
                        quota.competition_type == 'individual' ? 
                          quota.guest_player : quota.guest_name
                      }  
                    </div>
                    <div className="admin-item__config">
                      <div>Event id:</div>
                      <div>{ quota.event_id }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Type:</div>
                      <div>{ quota.type }</div>
                    </div>
                    <div className="admin-item__config">
                      <div>Value:</div>
                      <div>{ quota.value }</div>
                    </div>
                    <div className="admin-item__delete hover--opacity" onClick={() => this.delete(quota.id)}>Delete</div>
                  </div>
                })
              : <div className="slider__empty">No odds</div>
            }
          </div>
          <div className={"popup-wrapper" + (popup ? " opened" : "") + (closing ? " closing" : "")}>
            <div className="close-popup" onClick={() => this.startClosing()}></div>
            <div className="admin-popup">
              <div className="admin-popup__title">Add Sport</div>
              <div className="admin-popup__row">
                <select name="selectedEvent" onChange={this.handleInput} value={selectedEvent}>
                  <option value="undefined" default disabled>Select Event</option>
                  {
                    events && events.map((event, i ) => {
                      if(event.event_result == null)
                        return <option key={i} value={event.event_id}>Event id: { event.event_id }</option>
                    })
                  }
                </select>
              </div>
              {
                selectedEvent != "undefined" ?
                  <div className="admin-popup__row">
                    <select name="selectedType" onChange={this.handleInput} value={selectedType}>
                      <option value="undefined" default disabled>Select Odd Type</option>
                      {
                        this.getPossibleTypes(selectedEvent).map((type, i ) => {
                          return <option key={i} value={type}>Odd type: { type }</option>
                        })
                      }
                    </select>
                  </div>
                : ""
              }
              <div className="admin-popup__row">
                <input className="admin-popup__input" type="text" name="value" placeholder="Odd value" value={value} onChange={this.handleInput} />
              </div>
              <div className="popup__cta admin-popup__cta hover--opacity" onClick={() => this.addNew()}>Add Odd</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { quotas: { quotas }, events: { events } } = state;
  
  return { 
    quotas,
    events
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getQuotas: () => dispatch(getQuotas()),
    deleteQuota: (id) => dispatch(deleteQuota({ id: id })),
    addQuota: (event_id, type, value) => dispatch(addQuota({ event_id: event_id, type: type, value: value }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminQuotas);
