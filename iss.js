
const request = require('request');


const fetchMyIP = function(callback) {
  request(`https://api.ipify.org?format=json`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;



    callback(null, ip);
  });
};



const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    const data = JSON.parse(body);

    if (!data.success) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      callback(Error(message), null);
      return;
    }


    const lat = JSON.parse(body).latitude;
    const long = JSON.parse(body).longitude;

    const geoLocation = {
      'longitude': long,
      'latitude': lat
    };

    callback(null, geoLocation);

  });
};

const fetchISSFlyOverTimes = function(coords, callback) {

  const lat = coords.latitude;
  const long = coords.longitude;
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${lat}&lon=${long}`;

  request(url, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    const data = JSON.parse(body);
    if (response.statusCode !== 200) {
      const message = `Success status was ${data.message}. Try again.`;
      callback(Error(message), null);
      return;
    }
    callback(null, data.response);

  });
};



const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };


