define(['ash/Family', 'ash/Entity', 'ash/Node', 'ash/NodeList'], function(Family, Entity, Node, NodeList) {
  
  describe('Family', function() {
    var family;
    var matching_entity;
    var non_matching_entity;
    function ComponentOne() { };
    function ComponentTwo() { };
    function OtherComponent() { };
    function TestNode() { 
      this.component_one = new ComponentOne();
      this.component_two = new ComponentTwo();
    }
    TestNode.prototype = new Node();

    beforeEach(function() {
      family = new Family(TestNode)

      matching_entity = new Entity();
      matching_entity.add(new ComponentOne());
      matching_entity.add(new ComponentTwo());

      non_matching_entity = new Entity();
      non_matching_entity.add(new ComponentOne());
    });

    describe('getNodeList()', function() {
      it("should return the family's NodeList.", function() {
        family.checkEntityAdd(matching_entity);
        var node_list = family.getNodeList();
        expect(node_list.constructor).toBe(NodeList);
        expect(node_list.length()).toBe(1);

        node_list.removeAll();
        node_list = family.getNodeList();
        expect(node_list.length()).toBe(0);
      });
    });

    describe('checkEntityAdd(entity)', function() {
      it("should create a new node on the family's node list and return true when passed an entity that has all components required in the node class.", function() {
        var return_value = family.checkEntityAdd(matching_entity);
        expect(return_value).toBe(true);
        var node_list = family.getNodeList();
        expect(node_list.length()).toBe(1);
      });

      it("should return false and make no changes to the family's node list when passed an entity that does not have all of the components required in the node class.", function() {
        var return_value = family.checkEntityAdd(non_matching_entity);
        expect(return_value).toBe(false);
        var node_list = family.getNodeList();
        expect(node_list.length()).toBe(0);
      });

      it("should return true if passed an entity that has already had a node added.", function() {
        family.checkEntityAdd(matching_entity);
        var return_value = family.checkEntityAdd(matching_entity);
        expect(return_value).toBe(true);
      });
    });

    describe('checkEntityRemove(entity)', function() {
      it("should return true and remove the entity's node from the family's node list if the entity was previously added.", function() {
        family.checkEntityAdd(matching_entity);
        var return_value = family.checkEntityRemove(matching_entity);
        expect(return_value).toBe(true);
        var node_list = family.getNodeList();
        expect(node_list.length()).toBe(0);
      });

      it("should return false if the entity does not have a node on the family's node list to remove.", function() {
        var return_value = family.checkEntityRemove(matching_entity);
        expect(return_value).toBe(false);
      });
    });

    describe('checkNewComponent(entity, componentType)', function() {
      it("should create a new node on the family's node list and return true when passed an entity with a newly added componentType that now qualifies it.", function() {
        non_matching_entity.add(new ComponentTwo());
        
        var return_value = family.checkNewComponent(non_matching_entity, ComponentTwo);
        expect(return_value).toBe(true);
        var node_list = family.getNodeList();
        expect(node_list.length()).toBe(1);
      });

      it("should return false and make no changes to the family's node list when passed an entity with a newly added componentType that doesn't qualify it for inclusion.", function() {
        non_matching_entity.add(new OtherComponent());
        
        var return_value = family.checkNewComponent(non_matching_entity, OtherComponent);
        expect(return_value).toBe(false);
        var node_list = family.getNodeList();
        expect(node_list.length()).toBe(0);
      });
    });

    describe('checkRemovedComponent(entity, componentType)', function() {
      it("should remove entity's node from the family's node list and return true when passed an entity that has had a required component removed.", function() {
        family.checkEntityAdd(matching_entity);

        matching_entity.remove(ComponentTwo);

        var return_value = family.checkRemovedComponent(matching_entity, ComponentTwo);
        expect(return_value).toBe(true);
        var node_list = family.getNodeList();
        expect(node_list.length()).toBe(0);
      });

      it("should return false and make no changes to the family's node list when passed an entity that has had a non-required component removed.", function() {
        matching_entity.add(new OtherComponent());
        family.checkEntityAdd(matching_entity);
        
        matching_entity.remove(OtherComponent);
        var return_value = family.checkRemovedComponent(matching_entity, OtherComponent);
        expect(return_value).toBe(false);
        var node_list = family.getNodeList();
        expect(node_list.length()).toBe(1);
      });
    });

    describe('cleanUp()', function() {
      it("should remove all nodes from the family's node list.", function() {
        family.checkEntityAdd(matching_entity);
        var node_list = family.getNodeList();
        expect(node_list.length()).toBe(1);
        family.cleanUp();
        expect(node_list.length()).toBe(0);
      });
    });

  });

});