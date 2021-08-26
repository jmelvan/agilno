// helper function to build request query for API
const buildQuery = (params) => {
  var query = {
    query: params
  };
  
  return query;
}

const balanceFormatter = (balance) => {
  var formatter = new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'HRK',
  });

  return formatter.format(balance);
}

const loadFromStorage = (key) => {
  return new Promise((resolve, reject) => {
    var item = localStorage.getItem(key);
    item ? resolve(item) : reject();
  })
}

const helpers = {
  buildQuery,
  balanceFormatter,
  loadFromStorage
}

export default helpers;