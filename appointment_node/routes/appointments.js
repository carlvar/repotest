var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('appointmentsdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'appointmentsdb' database");
        db.collection('appointments', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'appointments' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving appointment: ' + id);
    db.collection('appointments', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findByProf = function(req, res) {
    var prof = req.params.prof;
    var date = req.params.date;
    console.log('Retrieving appointments for: ' + prof);
    db.collection('appointments', function(err, collection) {
    	if (date != null)
        collection.find({'prof':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};


exports.findAll = function(req, res) {
    db.collection('appointments', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addAppointment = function(req, res) {
    var appointment = req.body;
    console.log('Adding appointment ' + JSON.stringify(appointment));
    db.collection('appointments', function(err, collection) {
        collection.insert(appointment, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateAppointment = function(req, res) {
    var id = req.params.id;
    var appointment = req.body;
    console.log('Updating appointment: ' + id);
    console.log(JSON.stringify(appointment));
    db.collection('appointments', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, appointment, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating appointment: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(appointment);
            }
        });
    });
}
 
exports.deleteAppointment = function(req, res) {
    var id = req.params.id;
    console.log('Deleting appointment: ' + id);
    db.collection('appointments', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var appointments = [
    {
        code: "201202061235",
        category: "0001",
        client: "Federico Gómez"
    },
    {
        code: "201202061255",
        category: "0001",
        client: "Antonio López"
    }];
 
    db.collection('appointments', function(err, collection) {
        collection.insert(appointments, {safe:true}, function(err, result) {});
    });
 
};