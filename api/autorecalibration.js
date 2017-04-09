var express = require('express');
var router = express.Router();
var sql = require ('mssql');

//Connection String
const config = {
  user: 'tmadmin',
  password: 'TrackMan123',
  server: 'kmqed1sonq.database.windows.net',
  database: 'TrackMan.Baseball',
  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};

// Get request with parameters.
router.get('/location', function(req, res){

  var locationid = req.query.locationid;
  var data = [];
  //var locationid = '8263EBD5-5EDC-11E4-9FA6-00155D51AA0D';
  var querystring =
    `select l.Name, c1.LocationId, c1.DateCreated, c1.DateModified, dbo.MtoIn(Round(c1.RubberPositionX,3)) as RubberPositionX,
    dbo.MtoIn(Round(c1.RubberPositionY,3)) as RubberPositionY, dbo.MtoIn(Round(c1.RubberPositionZ,3)) as RubberPositionZ,
    dbo.MtoIn(Round(c1.HomePositionX,3)) as HomePositionX, dbo.MtoIn(Round(c1.HomePositionY,3)) as HomePositionY,
    dbo.MtoIn(Round(c1.HomePositionZ,3)) as HomePositionZ, c1.CalibrationId,
    Round(degrees(c1.FixedRadarTilt),3) as FixedRadarTilt, Round(degrees(c1.FixedRadarRoll),3) as FixedRadarRoll,
    c1.CalibrationClass, l.SoftwareVersion, l.OEMVersion
    from calibration c1
    inner join
          (select min(datecreated) as datecreated, min(datemodified) as datemodified, locationID from calibration
          where calibrationclass = 'autorecalibration'
          group by locationID) c2
    on c2.locationID = c1.locationID and c1.datemodified = c2.datemodified
    inner join location l
    on l.locationID = c1.locationID
    where c1.LocationId = '`+locationid+`'
    order by c1.datemodified desc`;

  sql.connect(config, err => {
      // ... error checks

      const request = new sql.Request();

      request.stream = true; // You can set streaming differently for each request
      //request.query('select TOP 5 calibrationclass, CalibrationId from dbo.calibration ') // or request.execute(procedure)

      request.query(querystring);

      request.on('recordset', columns => {
          // Emitted once for each recordset in a query

          //console.dir(columns)
      });

      request.on('row', row => {
          // Emitted for each row in a recordset

          data.push(row)
      });

      request.on('error', err => {
          // May be emitted multiple times

      });

      request.on('done', result => {
          // Always emitted as the last one
          console.log("Auto Recalibration API call was success");
          res.status(200).json(data);
          sql.close();
      });
  });

  sql.on('error', err => {
      // ... error handler

  });
});

module.exports = router;

/* GET home page. */
router.get('/locations', function(req, res) {
  var data = [];
  var querystring =
  `select l.Name, c1.LocationId, c1.DateCreated, c1.DateModified, dbo.MtoIn(Round(c1.RubberPositionX,3)) as RubberPositionX,
  dbo.MtoIn(Round(c1.RubberPositionY,3)) as RubberPositionY, dbo.MtoIn(Round(c1.RubberPositionZ,3)) as RubberPositionZ,
  dbo.MtoIn(Round(c1.HomePositionX,3)) as HomePositionX, dbo.MtoIn(Round(c1.HomePositionY,3)) as HomePositionY,
  dbo.MtoIn(Round(c1.HomePositionZ,3)) as HomePositionZ, c1.CalibrationId,
  Round(degrees(c1.FixedRadarTilt),3) as FixedRadarTilt, Round(degrees(c1.FixedRadarRoll),3) as FixedRadarRoll,
  c1.CalibrationClass, l.SoftwareVersion, l.OEMVersion
  from calibration c1
  inner join
        (select min(datecreated) as datecreated, min(datemodified) as datemodified, locationID from calibration
        where calibrationclass = 'autorecalibration'
        group by locationID) c2
  on c2.locationID = c1.locationID and c1.datemodified = c2.datemodified and year(c1.datemodified) = '2017'
  inner join location l
  on l.locationID = c1.locationID
  order by c1.datemodified desc`;

  sql.connect(config, err => {
      // ... error checks

      const request = new sql.Request()

      request.stream = true // You can set streaming differently for each request
      //request.query('select TOP 5 calibrationclass, CalibrationId from dbo.calibration ') // or request.execute(procedure)

      request.query(querystring)

      request.on('recordset', columns => {
          // Emitted once for each recordset in a query

          //console.dir(columns)
      })

      request.on('row', row => {
          // Emitted for each row in a recordset

          data.push(row)
      })

      request.on('error', err => {
          // May be emitted multiple times

      })

      request.on('done', result => {
          // Always emitted as the last one
          console.log("Auto Recalibration API call was success");
          res.status(200).json(data);
          sql.close();


      })
  })

  sql.on('error', err => {
      // ... error handler

  })

})

module.exports = router;
