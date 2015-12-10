if (Meteor.isClient) {
	EventEx = new EventEmitterEx();

	// counter starts at 0
	Session.setDefault('counter', 0);

	Template.hello.helpers({
		PixiJSViewContainer: function () {
			return PixiJSViewContainer;
		},
		counter: function () {
			return Session.get('counter');
		}
	});

	Template.hello.events({
		'click button': function () {
			// increment the counter when button is clicked
			Session.set('counter', Session.get('counter') + 1);
			Dispatcher.dispatch('TEST_TRIGGER');
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}