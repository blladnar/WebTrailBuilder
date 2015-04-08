Landmarks = new Mongo.Collection("landmarks");
Trails = new Mongo.Collection("Trails");

var trailIdentifier = "";

function isEmpty(str) {
  return (!str || 0 === str.length);
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  return s4() + s4() + s4() + s4() +
  s4() + s4() + s4() + s4();
}

if (Meteor.isClient) {
  Router.map(function(){
    this.route('home', {path: '/'} );
    this.route('trail', {
      path: '/trail/:trailID',
      data: function(){
        // code goes here
        trailIdentifier = this.params.trailID;
        console.log("Trail Route " + trailIdentifier);
        Session.set('trailID', trailIdentifier);
      }
    });

  });


  Template.body.helpers({
    landmarks: function () {
      return Landmarks.find({'trailID':Session.get('trailID')});
    },
    trail: function() {
      return Trails.find({'trailID':Session.get('trailID')})
    }

  });





  Template.body.events({
    "submit .new-landmark": function (event) {
      // This function is called when the new task form is submitted

      var name = event.target.landmarkName.value;
      var distance = event.target.distance.value;

      Landmarks.insert({
        name: name,
        distance: distance,
        trailID: trailIdentifier,
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
      if(typeof status === 'undefined'){
        Trails.insert({
            name:"My Trail",
            trailID:trailIdentifier
          });
      }

      var trailJSON = {};
      var trail = Trails.findOne({'trailID':trailIdentifier});
      trailJSON["name"] = trail.name;
      alert(JSON.stringify(trailJSON));

      return false;

    },

    "submit .save-trailname" : function (event) {
      var status = Trails.findOne({'trailID':trailIdentifier});
      if(typeof status === 'undefined'){
        Trails.insert({
          name:"My Trail",
          trailID:trailIdentifier
        });
      }
      else {
        var status = Trails.findOne({'trailID':trailIdentifier});

        Trails.update({_id:status._id},{ $set:{'name' : event.target.name.value}});
      }

        return false;
    }

  });

}
