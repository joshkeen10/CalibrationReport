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
router.get('/calibration', function(req, res){

   var locationid = req.query.locationid;

   var top1switch = " ";
   console.log(req.query.top1)
   if (req.query.top1 == "TRUE"){
     top1switch = " top 1 "
    };

   var data = [];

   var querystring =
    `select`+top1switch+`l.Name, c1.LocationId, c1.DateCreated, c1.DateModified,
      dbo.MtoIn(Round(c1.RubberPositionX,3)) as RubberPositionX,
      dbo.MtoIn(Round(c1.RubberPositionY,3)) as RubberPositionY, dbo.MtoIn(Round(c1.RubberPositionZ,3)) as RubberPositionZ,
      dbo.MtoIn(Round(c1.HomePositionX,3)) as HomePositionX,
      dbo.MtoIn(Round(c1.HomePositionY,3)) as HomePositionY, dbo.MtoIn(Round(c1.HomePositionZ,3)) as HomePositionZ, c1.CalibrationId,
      Round(degrees(c1.FixedRadarTilt),3) as FixedRadarTilt, Round(degrees(c1.FixedRadarRoll),3) as FixedRadarRoll,
      c1.CalibrationClass, l.SoftwareVersion, l.OEMVersion
      from calibration c1
	     inner join location l
		 on l.locationID = c1.locationID and c1.calibrationclass = 'AutoRecalibration' and year(c1.datemodified) = '2017'
     where c1.LocationId = '`+locationid+`'
     order by c1.datemodified`

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
        console.log("By Calibration API call was success");
        res.status(200).json(data);
        sql.close();
        });
   });

   sql.on('error', err => {
        // ... error handler

   });
});

module.exports = router;

// Get request with parameters.
router.get('/deltas', function(req, res){

   var locationid = req.query.locationid;

   var data = [];

   var querystring =
    `select jk.Name, jk.LocationID, jk.DateModified, jk.CalibrationID, jk.SoftwareVersion, jk.OEMVersion,
	  ifnull(dbo.MtoIn(jk.RubberPositionX - lag(jk.RubberPositionX) over (order by jk.datemodified)),0) as RPXDelta,
	  ifnull(dbo.MtoIn(jk.RubberPositionY - lag(jk.RubberPositionY) over (order by jk.datemodified)),0) as RPYDelta,
	  ifnull(dbo.MtoIn(jk.RubberPositionZ - lag(jk.RubberPositionZ) over (order by jk.datemodified)),0) as RPZDelta,
	  ifnull(dbo.MtoIn(jk.HomePositionX - lag(jk.HomePositionX) over (order by jk.datemodified)),0) as HPXDelta,
	  ifnull(dbo.MtoIn(jk.HomePositionY - lag(jk.HomePositionY) over (order by jk.datemodified)),0) as HPYDelta,
	  ifnull(dbo.MtoIn(jk.HomePositionZ - lag(jk.HomePositionZ) over (order by jk.datemodified)),0) as HPZDelta,
	  ifnull((jk.FixedRadarTilt - lag(jk.FixedRadarTilt) over (order by jk.FixedRadarTilt)),0) as TiltDelta,
	  ifnull((jk.FixedRadarRoll - lag(jk.FixedRadarRoll) over (order by jk.FixedRadarRoll)),0) as RollDelta
    from
    (
      select l.Name, c1.LocationId, c1.DateCreated, c1.DateModified, Round(c1.RubberPositionX,3) as RubberPositionX,
      Round(c1.RubberPositionY,3) as RubberPositionY, Round(c1.RubberPositionZ,3) as RubberPositionZ,
      Round(c1.HomePositionX,3) as HomePositionX, Round(c1.HomePositionY,3) as HomePositionY, Round(c1.HomePositionZ,3) as HomePositionZ, c1.CalibrationId,
      Round(degrees(c1.FixedRadarTilt),3) as FixedRadarTilt, Round(degrees(c1.FixedRadarRoll),3) as FixedRadarRoll, c1.CalibrationClass, l.SoftwareVersion, l.OEMVersion
      from calibration c1
	    inner join location l
		  on l.locationID = c1.locationID and c1.calibrationclass = 'AutoRecalibration' and year(c1.datemodified) = '2017'
      where c1.LocationId = '`+locationid+`'
    ) jk
    order by jk.datemodified`

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
        console.log("By Calibration API call was success");
        res.status(200).json(data);
        sql.close();
        });
   });

   sql.on('error', err => {
        // ... error handler

   });
});

module.exports = router;
