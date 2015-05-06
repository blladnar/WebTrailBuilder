
if(Meteor.isClient) {

  Template.trailList.helpers({
    trail: function() {
      return Trails.find({});
    }
  });
}
