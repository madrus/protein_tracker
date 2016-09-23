import { Meteor } from 'meteor/meteor';

ProteinData = new Meteor.Collection('proteinData');
History = new Meteor.Collection('historyData');

ProteinData.allow({
  insert: function (userId, data) {
    return true; // always allow
  },
  update: function (userId, data) {
    return true; // always allow
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
    console.log(`addProtein: userId = ${this.userId}`);

    if (!this.isSimulation) {
      var Future = Npm.require('fibers/future');
      var future = new Future();
      Meteor.setTimeout(function () {
        future.return();
      }, 3 * 1000);
      future.wait();
    } else {
      amount = 500;
    }

    ProteinData.update({ userId: this.userId }, { $inc: { total: amount } });
    History.insert({
      value: amount,
      date: new Date().toTimeString(),
      userId: this.userId
    });
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('allProteinData');
  Meteor.subscribe('allHistory');

  Deps.autorun(function () {
    if (Meteor.user()) {
      console.log(`User logged in: ${Meteor.user().profile.name}`);
    } else {
      console.log(`User logged out`);
    }
  })

  Template.userDetails.helpers({
    user: function () {
      var userId = Meteor.userId();
      console.log(`userId = ${userId}`);

      var data = ProteinData.findOne({ userId: userId });
      if (!data) {
        console.log(`no data found`);
        data = {
          userId: userId,
          total: 0,
          goal: 200
        };
        ProteinData.insert(data);
      }
      return data;
    },
    lastAmount: function () {
      return Session.get('lastAmount');
    }
  });

  Template.history.helpers({
    historyItem: function () {
      return History.find({}, { sort: { date: -1 } });
    }
  });

  Template.userDetails.events({
    'click #addAmount': function (e) {
      e.preventDefault();

      var amount = parseInt($('#amount').val());
      Meteor.call('addProtein', amount, function (err, id) {
        if (err)
          return alert(err.reason);
      });
      Session.set('lastAmount', amount);
    },
    'click #quickSubtract': function (e) {
      e.preventDefault();
      console.log(`quickSubtract: userId = ${this.userId}`);
      ProteinData.update(this.userId, { $inc: { total: -100 } });
    }
  });
}

//////////////////////////////////

if (Meteor.isServer) {
  Meteor.publish('allProteinData', function () {
    console.log(`allProteinData: userId = ${this.userId}`);
    return ProteinData.find({ userId: this.userId });
  });

  Meteor.publish('allHistory', function () {
    console.log(`allHistory: userId = ${this.userId}`);
    return History.find({ userId: this.userId }, { sort: { date: -1 }, limit: 5 });
  });

  Meteor.startup(() => {
    // code to run on server at startup
  });
}
