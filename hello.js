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
		'click #addBackground': function () {
			// increment the counter when button is clicked
			Dispatcher.dispatch('ADD_BACKGROUND');
		},
		'click #blinkBackground': function () {
			Dispatcher.dispatch('BLINK_BACKGROUND');
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
