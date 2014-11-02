define(['ash/NodeList', 'ash/Node'], function(NodeList, Node) {
  
  describe('NodeList', function() {
    var node_list;

    beforeEach(function() {
      node_list = new NodeList();
    });

    describe('add(node)', function() {
      it("should add a new node to the list, and trigger the nodeAdded signal.", function() {
        var callback_spy = jasmine.createSpy("callback_spy");
        var node = new Node();
        node_list.addSubscriber('nodeAdded', callback_spy);
        node_list.add(node);

        expect(callback_spy).toHaveBeenCalledWith(node);
        expect(node_list.length()).toBe(1);
      });

      it("should allow the same node to be added twice.", function() {
        var node = new Node();
        node_list.add(node);
        node_list.add(node);

        expect(node_list.length()).toBe(2);
      });
    });

    describe('remove(node)', function() {
      it("should remove a previously added node from the list, and trigger the nodeRemoved signal.", function() {
        var callback_spy = jasmine.createSpy("callback_spy");
        node_list.addSubscriber('nodeRemoved', callback_spy);
        var node = new Node();
        node_list.add(node);

        node_list.remove(node);
        expect(node_list.length()).toBe(0);
        expect(callback_spy).toHaveBeenCalledWith(node);
      });

      it("should only remove the first copy of a node from the list.", function() {
        var node = new Node();
        node_list.add(node);
        node_list.add(node);

        node_list.remove(node);
        expect(node_list.length()).toBe(1);
      });

      it("should do nothing if passed a node not present on the list.", function() {
        var node = new Node();
        node_list.add(node);
        var remove_unknown_node = function() { node_list.remove(new Node()); }

        expect(remove_unknown_node).not.toThrow();
        expect(node_list.length()).toBe(1);
      });
    });

    describe('removeAll()', function() {
      it("should remove all nodes from the list, triggering the nodeRemoved signal for each one.", function() {
        var callback_spy = jasmine.createSpy("callback_spy");
        node_list.addSubscriber('nodeAdded', callback_spy);
        node_list.add(new Node());
        node_list.add(new Node());

        node_list.removeAll();
        expect(node_list.length()).toBe(0);
        expect(callback_spy.calls.count()).toBe(2);
      });
    });

    describe('at(index)', function() {
      it("should return the node at the passed index int the list.", function() {
        var node0 = new Node();
        var node1 = new Node();
        node_list.add(node0);
        node_list.add(node1);

        expect(node_list.at(0)).toBe(node0);
        expect(node_list.at(1)).toBe(node1);
      });

      it("should return undefined if passed an index out of bounds.", function() {
        var return_val = node_list.at(0);
        expect(return_val).toBe(undefined);
      });
    });

    describe('contains(node)', function() {
      it("should return true if the passed node has been added to the list.", function() {
        var node = new Node();
        node_list.add(node);
        
        expect(node_list.contains(node)).toBe(true);
      });

      it("should return false if the passed node has not been added to the list, or has been removed.", function() {
        var node = new Node();
        expect(node_list.contains(node)).toBe(false);

        node_list.add(node);
        node_list.remove(node);
        expect(node_list.contains(node)).toBe(false);
      });
    });

    describe('length()', function() {
      it("should return the number of items on the list.", function() {
        expect(node_list.length()).toBe(0);
        node_list.add(new Node());
        expect(node_list.length()).toBe(1);

        var node = new Node();
        node_list.add(node);
        expect(node_list.length()).toBe(2);
        node_list.remove(node);        
        expect(node_list.length()).toBe(1);
      });
    });

    describe('empty()', function() {
      it("should return true if no items are on the list, false otherwise.", function() {
        expect(node_list.empty()).toBe(true);
        
        var node = new Node();
        node_list.add(node);
        expect(node_list.empty()).toBe(false);

        node_list.remove(node);
        expect(node_list.empty()).toBe(true);
      });
    });

    describe('addSubscriber(signalType, callback)', function() {
      it("should subscribe a new callback function to the passed signal type, and return true.", function() {
        var node_added_callback_spy = jasmine.createSpy("node_added_callback_spy");
        var return_val = node_list.addSubscriber('nodeAdded', node_added_callback_spy);
        expect(return_val).toBe(true);
        
        var node_removed_callback_spy = jasmine.createSpy("node_removed_callback_spy");
        return_val = node_list.addSubscriber('nodeAdded', node_removed_callback_spy);
        expect(return_val).toBe(true);

        var node = new Node();
        node_list.add(node);
        expect(node_added_callback_spy).toHaveBeenCalledWith(node);

        node_list.remove(node);
        expect(node_removed_callback_spy).toHaveBeenCalledWith(node);
      });

      it("should return false if passed a signal type other than 'nodeAdded' or 'nodeRemoved'", function() {
        var return_val = node_list.addSubscriber('blah', null);
        expect(return_val).toBe(false);
      });
    });

    describe('removeSubscriber(signalType, callback)', function() {
      it("should remove a previously added callback subscription, and return true.", function() {
        var node_added_callback_spy = jasmine.createSpy("node_added_callback_spy");
        node_list.addSubscriber('nodeAdded', node_added_callback_spy);
        
        var return_val = node_list.removeSubscriber('nodeAdded', node_added_callback_spy);
        expect(return_val).toBe(true);

        node_list.add(new Node());
        expect(node_added_callback_spy).not.toHaveBeenCalled();
      });

      it("should return false if passed a signalType other than 'nodeAdded' or 'nodeRemoved'.", function() {
        var return_val = node_list.removeSubscriber('blah', null);
        expect(return_val).toBe(false);
      });

      it("should return true and take no action if passed a callback that was never subscribed.", function() {
        var return_val = node_list.removeSubscriber('nodeAdded', function() { });
        expect(return_val).toBe(true);
      });
    });

  });

});