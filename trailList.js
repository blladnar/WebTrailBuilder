
if(Meteor.isClient) {

  Template.trailList.helpers({
    trail: function() {
      return Trails.find({});
    }
  });

  Template.trailList.events({
    "click .delete-trail" : function(event) {
  //    alert("Delete this trail" + this);

      Trails.remove({_id:this._id})
      return false;
    }
  })
}
