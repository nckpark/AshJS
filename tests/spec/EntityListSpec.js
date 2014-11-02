define(['ash/EntityList', 'ash/Entity'], function(EntityList, Entity) {
  
  describe('EntityList', function() {
    var entity_list;

    beforeEach(function() {
      entity_list = new EntityList();
    });

    describe('add(entity)', function() {
      it("should add a new entity to the list.", function() {
        var entity = new Entity();
        entity_list.add(entity);
        expect(entity_list.length()).toBe(1);
      });

      it("should allow the same entity to be added twice.", function() {
        var entity = new Entity();
        entity_list.add(entity);
        entity_list.add(entity);
        expect(entity_list.length()).toBe(2);
      });
    });

    describe('remove(entity)', function() {
      it("should remove a previously added entity from the list.", function() {
        var entity = new Entity();
        entity_list.add(entity);

        entity_list.remove(entity);
        expect(entity_list.length()).toBe(0);
      });

      it("should only remove the first copy of a entity from the list.", function() {
        var entity = new Entity();
        entity_list.add(entity);
        entity_list.add(entity);

        entity_list.remove(entity);
        expect(entity_list.length()).toBe(1);
      });

      it("should do nothing if passed a entity not present on the list.", function() {
        var entity = new Entity();
        entity_list.add(entity);
        var remove_unknown_entity = function() { entity_list.remove(new Entity()); }

        expect(remove_unknown_entity).not.toThrow();
        expect(entity_list.length()).toBe(1);
      });
    });

    describe('removeAll()', function() {
      it("should remove all entities from the list.", function() {
        entity_list.add(new Entity());
        entity_list.add(new Entity());

        entity_list.removeAll();
        expect(entity_list.length()).toBe(0);
      });
    });

    describe('at(index)', function() {
      it("should return the entity at the passed index int the list.", function() {
        var entity0 = new Entity();
        var entity1 = new Entity();
        entity_list.add(entity0);
        entity_list.add(entity1);

        expect(entity_list.at(0)).toBe(entity0);
        expect(entity_list.at(1)).toBe(entity1);
      });

      it("should return undefined if passed an index out of bounds.", function() {
        var return_val = entity_list.at(0);
        expect(return_val).toBe(undefined);
      });
    });

    describe('contains(entity)', function() {
      it("should return true if the passed entity has been added to the list.", function() {
        var entity = new Entity();
        entity_list.add(entity);
        
        expect(entity_list.contains(entity)).toBe(true);
      });

      it("should return false if the passed entity has not been added to the list, or has been removed.", function() {
        var entity = new Entity();
        expect(entity_list.contains(entity)).toBe(false);

        entity_list.add(entity);
        entity_list.remove(entity);
        expect(entity_list.contains(entity)).toBe(false);
      });
    });

    describe('length()', function() {
      it("should return the number of items on the list.", function() {
        expect(entity_list.length()).toBe(0);
        entity_list.add(new Entity());
        expect(entity_list.length()).toBe(1);

        var entity = new Entity();
        entity_list.add(entity);
        expect(entity_list.length()).toBe(2);
        entity_list.remove(entity);        
        expect(entity_list.length()).toBe(1);
      });
    });

  });

});