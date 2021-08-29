import axios from 'axios';
import betslip from '../components/betslip';
import config from '../config';

// function to build request to rest API
const buildRequest = (params, action, auth) => {
  return new Promise((resolve, reject) =>{
    var data = { query: params }, options = {}; // build query
    auth && (options.headers = authHeader()); // if auth true, set auth header
    // post request
    axios.post(config.api + action, data, options)
      .then(response => {
        // resolve at the end
        resolve(response.data);
      })
      .catch(err => reject(err.response.data)) // if error, reject error message sent from server
  })
}

// function to return authorization header with jwt token
const authHeader = () => {
  // get user from localStorage
  let user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token)
    return { 'Authorization': 'Bearer ' + user.token };
  else
    return {};
}

// function to turn events into valid object for this app
const getSports = () => {
  return new Promise((resolve, reject) => {
    // get all unfinished events from server
    axios.get(config.api + '/event').then(res => {
      // get all quotas so we can push them to events
      axios.get(config.api + '/event/quotas').then(odds => {
        // extract events
        var events = assignOdds(res.data, odds.data);
        // create valid object from all events
        var sports = extractSports(events);
        // resolve sports
        resolve(sports);
      });
    }).catch(err => reject(err));
  })
}

// function to assing odds to single event
const assignOdds = (events, odds) => {
  // loop through all odds and all events
  for(let odd of odds)
    for(let event of events)
      if(event.event_id == odd.event_id) { // if event id's match, assing odd
        !event.odds && (event.odds = {}); // if odd array doesn't already exist
        event.odds[odd.type] = odd; // push odd
      }
  // return object at the end
  return events;
}

// function that extracts sports from unfinished events (so we don't show existing sports without events)
const extractSports = (events) => {
  var unique = [], sports = {};
  // loop through every event
  for(let event of events)
    unique.indexOf(event.sport_name) == -1 && unique.push({ sport: event.sport_name, results: event.quota_types }); // check if sport is in array
  // loop through unique sports
  unique.map(obj => {
    sports[obj.sport] = {};
    // every sport has same result possibilities, we need to save them for latter
    sports[obj.sport].results = obj.results;
    // extract competitions foreach unique sport
    sports[obj.sport].competitions = extractCompetitions(events, obj.sport);
  })

  // return object of sports
  return sports;
}

// function to extract competitions for single sport from unfinished events
const extractCompetitions = (events, sport_name) => {
  var unique = [], competitions = {};
  // loop through events
  for(let event of events)
    if(event.sport_name == sport_name) // if has the same sport name as one in argument and competition name is unique, push name to competititons
      unique.indexOf(event.competition_name) == -1 && unique.push(event.competition_name);
  // extract events dates foreach competition
  unique.map(competition => {
    competitions[competition] = {};
    competitions[competition].dates = extractDates(events, competition);
  })
  // return competitions object for sport
  return competitions
}

// function to extract dates for single competition from unfinished events
const extractDates = (events, competition_name) => {
  var unique = [], dates = {};
  // loop through events
  for(let event of events)
    if(event.competition_name == competition_name){ // extract unique dates for every competition
      var date = formatDate(new Date(parseInt(event.start_time)));
      unique.indexOf(date) == -1 && unique.push(date);
    }
  // sort unique dates from lower to upper
  unique.sort((a, b) => a.replace('.', '') - b.replace('.', ''));
  // extract events foreach date
  unique.map(date => {
    dates[date] = {};
    dates[date].events = extractEvents(events, date);
  })
  // return dates object for competition
  return dates;
}

// function to extract events for single date in competition from unfinished events
const extractEvents = (events, date) => {
  var events_list = [];
  // loop through events
  for(let event of events){
    var event_date = formatDate(new Date(parseInt(event.start_time)));
    // if date matches, push event to event list for that day
    if(event_date == date) events_list.push(event);
  }
  // return events list for specified date
  return events_list;
}

// function to get user bets
const getBets = () => {
  return new Promise((resolve, reject) => {
    buildRequest(undefined, '/user/bets', true).then(bets => {
      // after we got user bets from server we need to format them so we can easily use them in app
      var betslips = formBetslips(bets);
      // resolve at the end
      resolve(betslips);
    }).catch(err => reject(err));
  })
}

// function to format bets in betslips
const formBetslips = (bets) => {
  var unique = extractUniqueBetslips(bets),
    betslips = {};
  // map through unique betslips
  unique.map(betslip => {
    betslips[betslip] = {}; // create empty object foreach unique betslip id
    betslips[betslip].pairs = extractPairs(bets, betslip);
    // every bet from query has fields status, total stake and type which is refered actually for betslip fields and not pair fields
    // we need to get one of statuses, total stakes and types and set it as betslip status (only one because all are the same for all bets in single betslip)
    betslips[betslip].status = betslips[betslip].pairs[0].betslip_status;
    betslips[betslip].total_stake = betslips[betslip].pairs[0].total_stake;
    betslips[betslip].type = betslips[betslip].pairs[0].betslip_type;
  })
  // return betslips object
  return betslips;
}

// extract unique bestlips from bets
const extractUniqueBetslips = (bets) => {
  var unique = [];
  // loop through all bets and check for betslip id in unique
  for(let bet of bets)
    unique.indexOf(bet.betslip_id) == -1 && unique.push(bet.betslip_id)
  // return unieuq betslips
  return unique
}

// function to extract pairs for single betslip
const extractPairs = (bets, betslip_id) => {
  var pairs = [];
  // loop through all bets and check betslip id
  for(let bet of bets)
    if(bet.betslip_id == betslip_id)
      pairs.push(bet);
  // return betslip pairs (bets)
  return pairs;
}

// function to format date, return format: dd.mm.YYYY
const formatDate = (d) => {
  let y = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  let m = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  let dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  return dd + '.' + m + '.' + y;
}

// function that formats user balance
const balanceFormatter = (balance) => {
  var formatter = new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'HRK',
  });

  return formatter.format(balance);
}

// function to update store changes to local storage
const updateLocalStorage = (key, values) => {
  // load old value first
  loadFromStorage(key).then(item => {
    item = JSON.parse(item); // parse old value
    // loop through new value keys
    Object.keys(values).map(item_key => {
      item[item_key] = values[item_key]; // for every changed value key, set new value
    })
    // save new values back to local storage under same key
    localStorage.setItem(key, item);
  })
}

// function with promise to load item from storage
const loadFromStorage = (key) => {
  return new Promise((resolve, reject) => {
    var item = localStorage.getItem(key);
    item ? resolve(JSON.parse(item)) : reject();
  })
}

// function that returns popup element and success or error msg
const popupMsg = (type, msg) => {
  return <div className={"popup__" + type}>{msg}</div>
}

const helpers = {
  buildRequest,
  balanceFormatter,
  getSports,
  updateLocalStorage,
  loadFromStorage,
  authHeader,
  popupMsg,
  getBets
}

export default helpers;