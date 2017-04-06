var sql = require ('mssql');





const config = {

      user: 'tmadmin',

      password: 'TrackMan123',

      server: 'kmqed1sonq.database.windows.net',

      database: 'TrackMan.Baseball',
      options: {

        encrypt: true // Use this if you're on Windows Azure

    }

};

var test = [];
sql.connect(config, err => {
    // ... error checks

    const request = new sql.Request()
    request.stream = true // You can set streaming differently for each request
    //request.query('select TOP 5 calibrationclass, CalibrationId from dbo.calibration ') // or request.execute(procedure)
    // request.query(`select dbo.getlocationname(jok.locationid) as Location, jok.locationid, jok.calibrationid, jok.datecreated, jok.datemodified,
    //         jok.rubberpositionx, jok.rubberpositiony, jok.rubberpositionz, jok.homepositionx, jok.homepositiony, jok.homepositionz, jok.referenceradarpositionx,
    //         jok.referenceradarpositiony, jok.referenceradarpositionz, jok.invalidated, jok.fixedradartilt, jok.fixedradarroll, jok.imagemarkers, jok.onsiteoperator,
    //         jok.sourcecalibrationid, jok.corrections, jok.calibrationclass
    //   from
    //         (select jk.locationid, c.calibrationid, c.datecreated, c.datemodified,
    //         dbo.MtoFt(c.rubberpositionx) as RubberPositionX, dbo.MtoFt(c.rubberpositiony) as RubberPositionY, dbo.MtoFt(c.rubberpositionz) as RubberPositionZ,
    //         dbo.MtoFt(c.homepositionx) as HomePositionX, dbo.MtoFt(c.homepositiony) as HomePositionY, dbo.MtoFt(c.homepositionz) as HomePositionZ,
    //         c.referenceradarpositionx, c.referenceradarpositiony, c.referenceradarpositionz, c.invalidated,
    //         degrees(c.fixedradartilt) as FixedRadarTilt, degrees(c.fixedradarroll) as FixedRadarRoll,
    //         c.imagemarkers, c.onsiteoperator, c.sourcecalibrationid, c.corrections, c.calibrationclass,
    //         rank() over (partition by c.locationid order by c.datemodified desc) as [Rank]
    //   from
    //         (select locationid from location) jk
    //   inner join calibration c
    //         on jk.locationid = c.locationid and c.calibrationclass = 'AutoRecalibration'
    //    ) jok
    //    where jok.[Rank] = 1
    //    order by jok.datemodified desc`)

    request.query(`select TOP 1 * from dbo.Calibration `)

    request.on('recordset', columns => {
        // Emitted once for each recordset in a query

        //console.dir(columns)
    })

    request.on('row', row => {
        // Emitted for each row in a recordset

        test.push(row)
    })

    request.on('error', err => {
        // May be emitted multiple times

    })

    request.on('done', result => {
        // Always emitted as the last one
        console.log(test)


    })
})

sql.on('error', err => {
    // ... error handler
})
