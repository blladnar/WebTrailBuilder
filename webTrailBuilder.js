Landmarks = new Mongo.Collection("landmarks");
Trails = new Mongo.Collection("Trails");

var trailIdentifier = "";

function isEmpty(str) {
  return (!str || 0 === str.length);
}

if(Meteor.isClient) {
  Template.newTrail.helpers({
    autoredirect: function () {
      Router.go('trailbuilder', {"trailID":Session.get('trailID')});
      return null;
    }
  })
  Template.trailbuilder.helpers({
    landmarks: function () {
      return Landmarks.find({'trailID':Session.get('trailID')});
    },
    trail: function() {
      return Trails.find({'trailID':Session.get('trailID')})
    }

  });


  Template.trailbuilder.events({
    "submit .new-landmark": function (event) {
      // This function is called when the new task form is submitted

      var name = event.target.landmarkName.value;
      var distance = event.target.distance.value;

      Landmarks.insert({
        name: name,
        distance: distance,
        trailID: Session.get('trailID'),
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.distance.value = "";
      event.target.landmarkName.value = "";
      event.target.landmarkName.focus();

      // Prevent default form submit
      return false;
    },

    "submit .generate-trail": function (event) {
      var status = Trails.findOne({'trailID':trailIdentifier});
      if(typeof status === ''){
        Trails.insert({
            name:"My Trail",
            trailID:trailIdentifier
          });
      }

      alert(generateTrailJSONWithTrailID(trailIdentifier));

      return false;

    },

    "submit .save-trailname" : function (event) {
      trailIdentifier = Session.get('trailID');

      var status = Trails.findOne({'trailID':trailIdentifier});
      if(typeof status === 'undefined'){
        Trails.insert({
          name:event.target.name.value,
          trailID:trailIdentifier
        });
      }
      else {
        var status = Trails.findOne({'trailID':trailIdentifier});

        Trails.update({_id:status._id},{ $set:{'name' : event.target.name.value}});
      }

      Router.go('trailbuilder', {"trailID":trailIdentifier});

        return false;
    }

  });

}

function generateTrailJSONWithTrailID(trailID) {
  var trailJSON = {};
  var trail = Trails.findOne({'trailID':trailID});
  trailJSON["name"] = trail.name;

  var landmarks = Landmarks.find({'trailID':trailID},{'fields':{'_id':0, 'name':1, 'distance':1}}).fetch();
  trailJSON["landmarks"] = landmarks;

  return JSON.stringify(trailJSON, null, 2);
}

if(Meteor.isServer) {

  Router.map(function(){

    this.route('serverRoute', {
      where: 'server',
      path: '/trail/:trailID.:format',
      action: function() {
        this.response.writeHead(200, {'Content-Type': 'application/json'});
        this.response.end(generateTrailJSONWithTrailID(this.params.trailID));
      }
    });

    this.route('serverTrails', {
      where: 'server2',
      path:'/trails.:format',
      action: function() {
        this.response.writeHead(200, {'Content-Type': 'application/json'});
        this.response.end(generateTrailJSONWithTrailID(this.params.trailID));
      }
    })

  });
}
