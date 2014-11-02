define(['ash/Game', 'ash/Entity', 'ash/Node', 'ash/System'], function(Game, Entity, Node, System) {
  
  describe('Game', function() {
    var game;

    // Component Definitions
    function TestComponent() {
      this.updated = false;
    };

    function OtherComponent() {
      this.updated = false;
    };

    // Node Definitions
    function TestNode() { 
      this.test_component = new TestComponent();
    };
    TestNode.prototype = new Node();

    function OtherNode() {
      // OtherNode OtherComponent still called test_component to catch invalid update operations 
      // on TestComponents.
      this.test_component = new OtherComponent();
    };
    OtherNode.prototype = new Node();

    // System Definitions
    function TestSystem() { 
      var _nodes;
      this.setup = function(game) {
        _nodes = game.getNodeList(TestNode);
      };

      this.update = function(timeMs) {
        for(var i =0; i < _nodes.length(); i++) {
          _nodes.at(i).test_component.updated = true;
        }
      };
    };
    TestSystem.prototype = new System();

    function OtherSystem() {
      var _nodes;
      this.setup = function(game) {
        _nodes = game.getNodeList(OtherNode);
      };

      this.update = function(timeMs) {
        for(var i =0; i < _nodes.length(); i++) {
          // OtherNode OtherComponent still called test_component to catch invalid update operations 
          // on TestComponents.
          _nodes.at(i).test_component.updated = true;
        }
      };
    };
    OtherSystem.prototype = new System();

    // Tests

    beforeEach(function() {
      game = new Game();
    });

    describe('addEntity(entity)', function() {
      var add_test_entity;
      var add_test_component;

      beforeEach(function() {
        add_test_entity = new Entity();
        add_test_component = new TestComponent();
        add_test_entity.add(add_test_component);
      });

      it("should assign an id to the new entity.", function() {
        expect(add_test_entity.id).toBe(undefined);
        game.addEntity(add_test_entity);
        expect(add_test_entity.id).not.toBe(undefined);
      });

      it("should cause the entity to be processed by appropriate systems.", function() {
        game.addSystem(new TestSystem(), 1);

        game.addEntity(add_test_entity);
        game.update(1);
        expect(add_test_component.updated).toBe(true);
      });

      it("should not cause the entity to be processed by unrelated systems.", function() {
        game.addSystem(new OtherSystem(), 1);

        game.addEntity(add_test_entity);
        game.update(1);
        expect(add_test_component.updated).toBe(false);
      });

      it("should create new nodes on the correct node lists for this entity.", function() {
        var node_list = game.getNodeList(TestNode); // Initializes game's TestNode node list
        expect(node_list.length()).toBe(0);

        game.addEntity(add_test_entity);
        expect(node_list.length()).toBe(1);
      });
    });

    describe('removeEntity(entity)', function() {
      var remove_test_entity;
      var remove_test_component;

      beforeEach(function() {
        remove_test_entity = new Entity();
        remove_test_component = new TestComponent();
        remove_test_entity.add(remove_test_component);
      });

      it("should unset the entity's id.", function() {
        game.addEntity(remove_test_entity);
        expect(remove_test_entity.id).not.toBe(undefined);

        game.removeEntity(remove_test_entity);
        expect(remove_test_entity.id).toBe(undefined);
      });

      it("should stop this entity from being processed by relevant systems.", function() {
        game.addSystem(new TestSystem(), 1);

        game.addEntity(remove_test_entity);
        game.update(1);
        expect(remove_test_component.updated).toBe(true);
        remove_test_component.updated = false;

        game.removeEntity(remove_test_entity);
        game.update(2);
        expect(remove_test_component.updated).toBe(false);
      });

      it("should remove nodes related to this entity from node lists.", function() {
        var node_list = game.getNodeList(TestNode);
        game.addEntity(remove_test_entity);
        expect(node_list.length()).toBe(1);

        game.removeEntity(remove_test_entity);
        expect(node_list.length()).toBe(0);
      });

      it("should take no action if passed an entity not previously added to the game.", function() {
        remove_test_entity.id = 1;
        var removeEntity_call = function() { game.removeEntity(remove_test_entity); };

        expect(removeEntity_call).not.toThrow();
        expect(remove_test_entity.id).toBe(1);
      });
    });

    describe('removeAllEntities()', function() {
      var test_entity_one;
      var test_component_one;
      var test_entity_two;
      var test_component_two;

      beforeEach(function() {
        test_entity_one = new Entity();
        test_component_one = new TestComponent();
        test_entity_one.add(test_component_one);

        test_entity_two = new Entity();
        test_component_two = new TestComponent();
        test_entity_two.add(test_component_two);
      });

      it("should unset ids for all entities in the game.", function() {
        game.addEntity(test_entity_one);
        game.addEntity(test_entity_two);

        game.removeAllEntities();
        expect(test_entity_one.id).toBe(undefined);
        expect(test_entity_two.id).toBe(undefined);
      });

      it("should stop all entities from being processed by systems.", function() {
        game.addSystem(new TestSystem(), 1);
        game.addEntity(test_entity_one);
        game.addEntity(test_entity_two);

        game.update(1);
        expect(test_component_one.updated).toBe(true);
        expect(test_component_two.updated).toBe(true);
        test_component_one.updated = false;
        test_component_two.updated = false;

        game.removeAllEntities();
        game.update(2);
        expect(test_component_one.updated).toBe(false);
        expect(test_component_two.updated).toBe(false);
      });

      it("should remove all nodes from the node lists.", function() {
        game.addEntity(test_entity_one);
        game.addEntity(test_entity_two);
        var node_list = game.getNodeList(TestNode);
        expect(node_list.length()).toBe(2);

        game.removeAllEntities();
        expect(node_list.length()).toBe(0);
      });
    });

    describe('getNodeList(nodeType)', function() {
      var test_entity;
      var test_component;
      var other_entity;
      var other_component;

      beforeEach(function() {
        test_entity = new Entity();
        test_component = new TestComponent();
        test_entity.add(test_component);

        other_entity = new Entity();
        other_component = new OtherComponent();
        other_entity.add(other_component);

        game.addEntity(test_entity);
        game.addEntity(other_entity);
      });

      it("should continue to update returned node lists when entities are added or removed.", function() {
        var node_list = game.getNodeList(TestNode);
        expect(node_list.length()).toBe(1);

        var another_entity = new Entity();
        another_entity.add(new TestComponent());
        game.addEntity(another_entity);
        expect(node_list.length()).toBe(2);

        game.removeEntity(another_entity);
        expect(node_list.length()).toBe(1);
      });

      it("should continue to update returned node lists when entity components are added or removed.", function() {
        var node_list = game.getNodeList(TestNode);
        expect(node_list.length()).toBe(1);

        var another_entity = new Entity();
        game.addEntity(another_entity);
        expect(node_list.length()).toBe(1);
        
        var another_test_component = new TestComponent();
        another_entity.add(another_test_component);
        expect(node_list.length()).toBe(2);

        another_entity.remove(TestComponent);
        expect(node_list.length()).toBe(1);
      });

      it("should return an empty node list when passed a node type that doesn't match any entities currently in the game.", function() {
        game.removeEntity(other_entity);
        var node_list = game.getNodeList(OtherNode);
        expect(node_list.length()).toBe(0);
      });
    });

    describe('addSystem(system, priority)', function() {
      var test_system;

      beforeEach(function() {
        test_system = new TestSystem();
      });

      it("should call the system's setup method.", function() {
        spyOn(test_system, 'setup');
        game.addSystem(test_system, 1);

        expect(test_system.setup).toHaveBeenCalled();
      });

      it("should add the system to the game loop executed in the game update method.", function() {
        spyOn(test_system, 'update');
        game.addSystem(test_system, 1);
        game.update(1);

        expect(test_system.update).toHaveBeenCalled();
      });

      it("should set the priority of the system.", function() {
        expect(test_system.priority).toBe(0);
        game.addSystem(test_system, 1);
        expect(test_system.priority).toBe(1);
      });
    });

    describe('getSystem(systemType)', function() {
      var test_system;

      beforeEach(function() {
        test_system = new TestSystem();
      });

      it("should return the system object of systemType currently running in the game.", function() {
        game.addSystem(test_system, 1);
        var returned_system = game.getSystem(TestSystem);
        expect(returned_system).toBe(test_system);
      });

      it("should return undefined if no systemType system is currently running in the game.", function() {
        var returned_system = game.getSystem(TestSystem);
        expect(returned_system).toBe(undefined);

        game.addSystem(test_system, 1);
        game.removeSystem(test_system);
        returned_system = game.getSystem(TestSystem);
        expect(returned_system).toBe(undefined);
      });
    });

    describe('removeSystem(system)', function() {
      var test_system;      

      beforeEach(function() {
        test_system = new TestSystem();
      });

      it("should remove a passed system currenty running in the game, and call it's detach method.", function() {
        game.addSystem(test_system, 1);
        spyOn(test_system, "detach");
        spyOn(test_system, "update");

        game.removeSystem(test_system);
        expect(test_system.detach).toHaveBeenCalled();

        game.update(1);
        expect(test_system.update).not.toHaveBeenCalled();
      });

      it("should do nothing if passed a system not currently running in the game.", function() {
        spyOn(test_system, "detach");
        var removeSystem_call = function() { game.removeSystem(test_system); };
        expect(removeSystem_call).not.toThrow();
        expect(test_system.detach).not.toHaveBeenCalled();
      });
    });

    describe('removeAllSystems()', function() {
      it("should remove all systems from the game, calling each of their detach methods.", function() {
        var test_system = new TestSystem();
        var other_system = new OtherSystem();
        game.addSystem(test_system, 1);
        game.addSystem(other_system, 5);

        spyOn(test_system, "detach");
        spyOn(other_system, "detach");
        
        game.removeAllSystems()
        expect(test_system.detach).toHaveBeenCalled();
        expect(other_system.detach).toHaveBeenCalled();

        spyOn(test_system, "update");
        spyOn(other_system, "update");

        game.update(1);
        expect(test_system.update).not.toHaveBeenCalled();
        expect(other_system.update).not.toHaveBeenCalled();
      });
    });

    describe('update(timeMs)', function() {
      var test_system;
      var other_system;

      beforeEach(function() {
        test_system = new TestSystem();
        other_system = new OtherSystem();
      });

      it("should call the update method of all game systems added to the game, passing timeMs as an argument to each.", function() {
        game.addSystem(test_system, 0);

        spyOn(test_system, "update");
        spyOn(other_system, "update");

        game.update(42586);
        expect(test_system.update).toHaveBeenCalledWith(42586);
        expect(other_system.update).not.toHaveBeenCalled();
      });

      it("should call system update methods in order of system priority.", function() {
        game.addSystem(test_system, 5);
        game.addSystem(other_system, 0);

        var order_counter = 1;        

        spyOn(test_system, "update").and.callFake(function() {
          test_system.call_order = order_counter;
          order_counter++;
        });

        spyOn(other_system, "update").and.callFake(function() {
          other_system.call_order = order_counter;
          order_counter++;
        });

        game.update(1);
        expect(other_system.call_order).toBe(1);
        expect(test_system.call_order).toBe(2);
      });
    });

  });

});