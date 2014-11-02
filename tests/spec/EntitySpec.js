define(['ash/Entity'], function(Entity) {
  
  describe('Entity', function() {
    var entity;
    function TestComponent() { };

    beforeEach(function() {
      entity = new Entity();
    });

    describe('add(component)', function() {
      it("should add the passed component to the entity.", function() {
        entity.add(new TestComponent());
        expect(entity.has(TestComponent)).toBe(true);
      });

      it("should replace a component added earlier if new component is of the same type.", function() {
        var first_component = new TestComponent();
        entity.add(first_component);
        var second_component = new TestComponent();
        entity.add(second_component);

        var active_component = entity.get(TestComponent);
        expect(active_component).toBe(second_component);
        expect(active_component).not.toBe(first_component);
      });

      it("should trigger the entity's componentAdded signal.", function() {
        var subscriber_spy = jasmine.createSpy("subscriber_spy");
        entity.addSubscriber('componentAdded', subscriber_spy);

        entity.add(new TestComponent());
        expect(subscriber_spy).toHaveBeenCalled();
      });
    });

    describe('remove(componentType)', function() {
      it("should remove a previously added component of the passed type from the entity.", function() {
        entity.add(new TestComponent());
        expect(entity.has(TestComponent)).toBe(true);
       
        entity.remove(TestComponent);
        expect(entity.has(TestComponent)).toBe(false);
      });

      it("should do nothing if passed a component type of which it has no components.", function() {
        var subscriber_spy = jasmine.createSpy("subscriber_spy");
        entity.addSubscriber('componentRemoved', subscriber_spy);
        var test_remove_func = function() { entity.remove(TestComponent); }

        expect(test_remove_func).not.toThrow();
        expect(subscriber_spy).not.toHaveBeenCalled();
      });

      it("should trigger the entity's componentRemoved signal.", function() {
        var subscriber_spy = jasmine.createSpy("subscriber_spy");
        entity.addSubscriber('componentRemoved', subscriber_spy);
        entity.add(new TestComponent());

        entity.remove(TestComponent);
        expect(subscriber_spy).toHaveBeenCalled();
      });
    });

    describe('has(componentType)', function() {
      it("should return true/false depending on if entity has a component of the passed type.", function() {
        expect(entity.has(TestComponent)).toBe(false);
        entity.add(new TestComponent());
        expect(entity.has(TestComponent)).toBe(true);
      });
    });

    describe('get(componentType)', function() {
      it("should return the last added component of the passed type.", function() {
        var test_component = new TestComponent();
        entity.add(test_component);

        var returned_component = entity.get(TestComponent);
        expect(returned_component).toBe(test_component);
      });

      it("should return undefined if no component of the passed type has been added.", function() {
        var return_value = entity.get(TestComponent);
        expect(return_value).toBe(undefined);
      });
    });

    describe('getAll()', function() {
      it("should return an array made up of all the entity's components.", function() {
        var test_component = new TestComponent();
        entity.add(test_component);
        var OtherComponent = function() { };
        other_component = new OtherComponent();
        entity.add(other_component);

        var returned_array = entity.getAll();
        expect(returned_array.length).toBe(2);
        expect(returned_array).toContain(test_component);
        expect(returned_array).toContain(other_component);
      });
    });

    describe('clone()', function() {
      it("should return a new entity with a deep copy of the components and component properties of this entity.", function() {
        var original_component = new TestComponent();
        original_component.some_property = 5;
        entity.add(original_component);

        var cloned_entity = entity.clone();
        expect(cloned_entity).not.toBe(entity);
        expect(cloned_entity.has(TestComponent)).toBe(true);
        var cloned_component = cloned_entity.get(TestComponent);
        expect(cloned_component).not.toBe(original_component);
        expect(cloned_component.some_property).toBe(5);
        // Ensure properties have been deep copied
        original_component.some_property = 10; 
        expect(cloned_component.some_property).toBe(5);
      });

      it("should not copy entity id, name, or subscribers.", function() {
        var subscriber_spy = jasmine.createSpy("subscriber_spy");
        entity.addSubscriber(subscriber_spy);
        entity.id = 25;
        entity.name = "testname";
        
        var cloned_entity = entity.clone();
        expect(cloned_entity.id).toBe(undefined);
        expect(cloned_entity.name).toEqual("");

        cloned_entity.add(new TestComponent());
        expect(subscriber_spy).not.toHaveBeenCalled();
      });
    });

    describe('addSubscriber(signalType, callback)', function() {
      it("should add subscribers for signalType 'componentAdded' or 'componentRemoved', and return true.", function() {
        var add_component_subscriber_spy = jasmine.createSpy("add_component_subscriber_spy");
        var return_val = entity.addSubscriber('componentAdded', add_component_subscriber_spy);
        expect(return_val).toBe(true);

        var remove_component_subscriber_spy = jasmine.createSpy("remove_component_subscriber_spy");
        return_val = entity.addSubscriber('componentRemoved', remove_component_subscriber_spy);
        expect(return_val).toBe(true);

        entity.add(new TestComponent());
        expect(add_component_subscriber_spy).toHaveBeenCalled();
        entity.remove(TestComponent);
        expect(remove_component_subscriber_spy).toHaveBeenCalled();
      });

      it("should return false if signalType is not 'componentAdded' or 'componentRemoved'.", function() {
        var return_value = entity.addSubscriber("blah", null);
        expect(return_value).toBe(false);
      });
    });

    describe('removeSubscriber(signalType, callback', function() {
      it("should remove the passed subscriber callback from signalType 'componentAdded' or 'componentRemoved', and return true.", function() {
        var add_component_subscriber_spy = jasmine.createSpy("add_component_subscriber_spy");
        entity.addSubscriber('componentAdded', add_component_subscriber_spy);
        var remove_component_subscriber_spy = jasmine.createSpy("remove_component_subscriber_spy");
        entity.addSubscriber('componentRemoved', remove_component_subscriber_spy);

        var return_val;
        return_val = entity.removeSubscriber('componentAdded', add_component_subscriber_spy);
        expect(return_val).toBe(true);
        return_val = entity.removeSubscriber('componentRemoved', remove_component_subscriber_spy);
        expect(return_val).toBe(true);

        entity.add(new TestComponent());
        expect(add_component_subscriber_spy).not.toHaveBeenCalled();
        entity.remove(TestComponent);
        expect(remove_component_subscriber_spy).not.toHaveBeenCalled();
      });

      it("should return false if signalType is not 'componentAdded' or 'componentRemoved'.", function() {
        var return_value = entity.removeSubscriber("blah", null);
        expect(return_value).toBe(false);
      });
    });

  });

});