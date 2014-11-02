define(['ash/Signal'], function(Signal) {

  describe('Signal', function() {
    var signal;

    beforeEach(function() {
      signal = new Signal();
    });

    describe('addSubscriber', function() {
      it('should cause added callback function to be called when signal is dispatched.', function() {
        callback_spy = jasmine.createSpy("callback_spy");
        signal.addSubscriber(callback_spy);

        signal.dispatch();
        expect(callback_spy).toHaveBeenCalled();
      });

      it('should allow the same callback to subscribe and be called multiple times.', function() {
        callback_spy = jasmine.createSpy("callback_spy");
        signal.addSubscriber(callback_spy);
        signal.addSubscriber(callback_spy);

        signal.dispatch();
        expect(callback_spy.calls.count()).toEqual(2);
      });
    });

    describe('removeSubscriber', function() {
      it('should remove previously added callback function from list of functions called when signal is dispatched.', function() {
        callback_spy = jasmine.createSpy("callback_spy");
        signal.addSubscriber(callback_spy);
        signal.removeSubscriber(callback_spy);

        signal.dispatch();
        expect(callback_spy.calls.any()).toEqual(false);
      });

      it('should do nothing when passed a subscriber callback that has not been added.', function() {
        callback_spy = jasmine.createSpy("callback_spy");
        var no_op_remove = function() { signal.removeSubscriber(callback_spy); };
        expect(no_op_remove).not.toThrow();
      });
    });

    describe('dispatch', function() {
      it('should call all callback functions added to this signal as subscribers.', function() {
        callback_spy_one = jasmine.createSpy("callback_spy_one");
        signal.addSubscriber(callback_spy_one);
        callback_spy_two = jasmine.createSpy("callback_spy_two");
        signal.addSubscriber(callback_spy_two);

        signal.dispatch();
        expect(callback_spy_one).toHaveBeenCalled();
        expect(callback_spy_two).toHaveBeenCalled();
      });

      it('should pass arguments on to subscriber callbacks.', function() {
        callback_spy = jasmine.createSpy("callback_spy");
        signal.addSubscriber(callback_spy);

        var test_arg = 'test_arg';
        signal.dispatch(test_arg);
        expect(callback_spy).toHaveBeenCalledWith(test_arg);
      });
    });
  });

});