Router.configure({
  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'appBody'
});

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
    this.route('home', {
      path: '/',
      data: function() {
        trailIdentifier = guid();
        Session.set('trailID', trailIdentifier);
      }
    } );

    this.route('trailList', {
      path: 'trails'
    });

    this.route('trailbuilder', {
      path: '/trail/:trailID',
      data: function(){
        // code goes here
        trailIdentifier = this.params.trailID;
        if(typeof trailIdentifier === 'undefined') {
          trailIdentifier = guid();
        }
        Session.set('trailID', trailIdentifier);
      }
    });

    this.route('newTrail', {
      path:'new',
      data: function(){
        // code goes here
        trailIdentifier = this.params.trailID;
        if(typeof trailIdentifier === 'undefined') {
          trailIdentifier = guid();
        }
        Session.set('trailID', trailIdentifier);
      }
    });

    // this.route('trailbuilder', {
    //   path:'/new',
    //   data:function() {
    //     trailIdentifier = guid();
    //     Session.set('trailID', trailIdentifier);
    //   }
    // });

  });
}
