define(['ash/SystemList', 'ash/System'], function(SystemList, System) {
  
  describe('SystemList', function() {
    var system_list;

    beforeEach(function() {
      system_list = new SystemList();
    });

    describe('add(system)', function() {
      it("should add a new system to the list, in the correct priority order.", function() {
        var high_priority_system = new System();
        high_priority_system.priority = 10;
        system_list.add(high_priority_system);
        expect(system_list.length()).toBe(1);

        var low_priority_system = new System();
        low_priority_system.priority = 0;
        system_list.add(low_priority_system);
        expect(system_list.length()).toBe(2);

        expect(system_list.at(0)).toBe(low_priority_system);
        expect(system_list.at(1)).toBe(high_priority_system);
      });

      it("should allow the same system to be added twice.", function() {
        var system = new System();
        system_list.add(system);
        system_list.add(system);
        expect(system_list.length()).toBe(2);
      });
    });

    describe('remove(system)', function() {
      it("should remove a previously added system from the list.", function() {
        var system = new System();
        system_list.add(system);

        system_list.remove(system);
        expect(system_list.length()).toBe(0);
      });

      it("should only remove the first copy of a system from the list.", function() {
        var system = new System();
        system_list.add(system);
        system_list.add(system);

        system_list.remove(system);
        expect(system_list.length()).toBe(1);
      });

      it("should do nothing if passed a system not present on the list.", function() {
        var system = new System();
        system_list.add(system);
        var remove_unknown_system = function() { system_list.remove(new System()); }

        expect(remove_unknown_system).not.toThrow();
        expect(system_list.length()).toBe(1);
      });
    });

    describe('removeAll()', function() {
      it("should remove all entities from the list.", function() {
        system_list.add(new System());
        system_list.add(new System());

        system_list.removeAll();
        expect(system_list.length()).toBe(0);
      });
    });

    describe('at(index)', function() {
      it("should return the system at the passed index int the list.", function() {
        var system0 = new System();
        var system1 = new System();
        system_list.add(system0);
        system_list.add(system1);

        expect(system_list.at(0)).toBe(system0);
        expect(system_list.at(1)).toBe(system1);
      });

      it("should return undefined if passed an index out of bounds.", function() {
        var return_val = system_list.at(0);
        expect(return_val).toBe(undefined);
      });
    });

    describe('contains(system)', function() {
      it("should return true if the passed system has been added to the list.", function() {
        var system = new System();
        system_list.add(system);
        
        expect(system_list.contains(system)).toBe(true);
      });

      it("should return false if the passed system has not been added to the list, or has been removed.", function() {
        var system = new System();
        expect(system_list.contains(system)).toBe(false);

        system_list.add(system);
        system_list.remove(system);
        expect(system_list.contains(system)).toBe(false);
      });
    });

    describe('get(type)', function() {
      function TestSystem() { };
      TestSystem.prototype = new System();

      it("should return a list of the passed type previously added to the list.", function() {
        test_system = new TestSystem();
        system_list.add(test_system);
        system_list.add(new System());

        var returned_system = system_list.get(TestSystem);
        expect(returned_system).toBe(test_system);
      });

      it("should return undefined if no system of the passed type is present on the list.", function() {
        system_list.add(new System());

        var return_val = system_list.get(TestSystem);
        expect(return_val).toBe(undefined);
      });
    });

    describe('length()', function() {
      it("should return the number of items on the list.", function() {
        expect(system_list.length()).toBe(0);
        system_list.add(new System());
        expect(system_list.length()).toBe(1);

        var system = new System();
        system_list.add(system);
        expect(system_list.length()).toBe(2);
        system_list.remove(system);        
        expect(system_list.length()).toBe(1);
      });
    });

  });

});