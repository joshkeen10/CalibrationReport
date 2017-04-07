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
   `select`+top1switch+`l.Name, c1.LocationId, c1.DateCreated, c1.DateModified, Round(c1.RubberPositionX,3) as RubberPositionX,
      Round(c1.RubberPositionY,3) as RubberPositionY, Round(c1.RubberPositionZ,3) as RubberPositionZ,
      Round(c1.HomePositionX,3) as HomePositionX, Round(c1.HomePositionY,3) as HomePositionY, Round(c1.HomePositionZ,3) as HomePositionZ, c1.CalibrationId,
      Round(c1.FixedRadarTilt,3) as FixedRadarTilt, Round(c1.FixedRadarRoll,3) as FixedRadarRoll, c1.CalibrationClass, l.SoftwareVersion
      from calibration c1
        inner join location l
          on l.locationID = c1.locationID and c1.calibrationclass = 'AutoRecalibration'
      where c1.LocationId = '`+locationid+`'
      order by c1.datemodified desc`

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
