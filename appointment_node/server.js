var express = require('express'),
    appointments = require('./routes/appointments');
 
var app = express();
 
app.get('/appointments', wines.findAll);
app.get('/appointment/:code', wines.findById);
app.get('/profAppointments/:prof', wines.findByProf);
app.get('/profAppointments/:prof/date/:date', wines.findByProf); //dateformat: yyyymmdd
 
app.listen(3000);
console.log('Listening on port 3000...');