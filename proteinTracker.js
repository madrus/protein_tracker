import { Meteor } from 'meteor/meteor';

ProteinData = new Meteor.Collection('proteinData');
History = new Meteor.Collection('historyData');

ProteinData.allow({
  insert: function (userId, data) {
    if (data.userId === userId) {
      return true; // allow
    }
    return false;
  },
  update: function (userId, data) {
    if (data.userId === userId) {
      return true; // allow
    }
    return false;
  }
});

ProteinData.deny({
  update: function (userId, data) {
    if (data.total < 0)
      return true; // deny
    return false; // allow
  }
});

Meteor.methods({
  addProtein: function (amount) {
    var userId = Meteor.userId();
    // console.log(`addProtein: userId = ${userId}`);
    // if (!this.isSimulation) {
    //   var Future = Npm.require('fibers/future');
    //   var future = new Future();
    //   Meteor.setTimeout(function () {
    //     future.return();
    //   }, 3 * 1000);
    //   future.wait();
    // } else {
    //   amount = 500;
    // }
    ProteinData.update({ _id: userId }, { $inc: { total: amount } });
    History.insert({
      userId: this.userId,
      value: amount,
      date: new Date().toTimeString()
    });
  },
  initializeData: function (userId) {
    var data = {
      _id: userId,
      total: 0,
      goal: 200
    };

    ProteinData.insert(data);
  }
});

if (Meteor.isClient) {
  Router.configure({
    layoutTemplate: 'main'
  });

  Router.route('/', {
    name: 'home',
    template: 'home'
  });

  Router.route('/settings');

  Meteor.subscribe('allProteinData');
  Meteor.subscribe('allHistory');

  Deps.autorun(function () {
    var userId = Meteor.userId();
    if (Meteor.user()) {
      console.log(`User logged in: ${Meteor.user().profile.name}`);
    } else {
      console.log(`User logged out`);
    }
  })

  Template.userDetails.helpers({
    user: function () {
      var userId = Meteor.userId();
      var data = ProteinData.findOne({ _id: userId });
      // print_data(data);
      if (!data) {
        Meteor.call('initializeData', userId, function (err, id) {
          if (err)
            return alert(err.reason);
        });
      }
      return data;
    },
    lastAmount: function () {
      return Session.get('lastAmount');
    }
  });

  Template.history.helpers({
    historyItem: function () {
      var userId = Meteor.userId();
      var historyData = History.find({ userId: userId }, { sort: { date: -1 } });
      return historyData;
    }
  });

  // in Template we have access to this._id  
  Template.userDetails.events({
    'click #addAmount': function (e) {
      e.preventDefault();

      var amount = parseInt($('#amount').val());
      Meteor.call('addProtein', amount, function (err) {
        if (err)
          return alert(err.reason);
      });
      Session.set('lastAmount', amount);
    },
    'click #quickSubtract': function (e) {
      e.preventDefault();

      var amount = -100;
      Meteor.call('addProtein', amount, function (err) {
        if (err)
          return alert(err.reason);
      });
      Session.set('lastAmount', amount);
    }
  });
}

//////////////////////////////////

if (Meteor.isServer) {
  Meteor.publish('allProteinData', function () {
    return ProteinData.find({ _id: this.userId });
  });

  Meteor.publish('allHistory', function () {
    return History.find({ userId: this.userId }, { sort: { date: -1 }, limit: 5 });
  });

  Meteor.startup(() => {
    // code to run on server at startup
  });
}

//////////////////////////////////

function print_data(data) {
  if (data) {
    _.map(_.keys(data), function (key) {
      console.log(`key: ${key}, value: ${data[key]}`);
    });
  } else {
    console.log('data is empty');
  }
}
