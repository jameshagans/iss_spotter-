const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss_promised'); 


const printPassTimes = function(passTimes) {
  console.log('risetimes: ', passTimes)
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};
nextISSTimesForMyLocation()
  .then((data) => {
    printPassTimes(data); 
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
