
describe('flowchart', function () {

	// 
	// Create a mock DOM element.
	//
	var createMockElement = function(attr, parent) {
		return {
			attr: function() {
				return attr;
			},

			parent: function () {
				return parent;
			},		
		};
	}

	//
	// Create a mock scope and add any arguments as mock nodes.
	//
	var createMockScope = function (mockNodes) {

		var mockScope = {
			chart: {
				nodes: mockNodes
			},			
		};

		return mockScope;
	}

	it('findParentConnector returns null when at root 1', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		expect(testObject.findParentConnector(null)).toBe(null);
	});

	it('findParentConnector returns null when at root 2', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		expect(testObject.findParentConnector([])).toBe(null);
	});

	it('findParentConnector returns element when it has connector class', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		var mockElement = createMockElement(testObject.connectorClass);

		expect(testObject.findParentConnector(mockElement)).toBe(mockElement);
	});

	it('findParentConnector returns parent when it has connector class', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		var mockParent = createMockElement(testObject.connectorClass);
		var mockElement = createMockElement('', mockParent);

		expect(testObject.findParentConnector(mockElement)).toBe(mockParent);
	});

	it('hitTestForConnector returns null when no element hit', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		// Mock out the document.
		testObject.document = {
			elementFromPoint: function () {
				return null;
			},
		};

		expect(testObject.hitTestForConnector(0, 0, 'input')).toBe(null);
	});


	it('hitTestForConnector returns null when the hit element has no parent connector', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		var mockElement = {
			attr: function () {

			},

			parent: function () {
				return null;
			},
		};

		// Mock out the document and jQuery.
		testObject.document = {
			elementFromPoint: function () {
				return mockElement;
			},
		};

		testObject.jQuery = function (input) {
			return input;
		};

		expect(testObject.hitTestForConnector(0, 0, 'input')).toBe(null);
	});

	it('hitTestForConnector returns the connector when found', function () {

		var mockScope = {};

		var testObject = new FlowChartController(mockScope);

		var mockConnector = {};

		var mockElement = {
			attr: function () {
				return testObject.connectorClass;
			},

			parent: function () {
				return null;
			},

			scope: function () {
				return {
					connector: mockConnector,
				};
			},
		};

		// Mock out the document and jQuery.
		testObject.document = {
			elementFromPoint: function () {
				return mockElement;
			},
		};

		testObject.jQuery = function (input) {
			return input;
		};

		expect(testObject.hitTestForConnector(0, 0, 'input')).toBe(mockConnector);
	});	

	it('test dragging is started on node mouse down', function () {

		var mockNode = {
			selected: false,
		};

		var mockScope = createMockScope([mockNode]);

		var mockDragging = {
			startDrag: jasmine.createSpy(),
		};

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.nodeMouseDown(mockEvt, 0);

		expect(mockDragging.startDrag).toHaveBeenCalled();

	});

	it('test node is selected when clicked', function () {

		var mockNode = {
			selected: false,
		};

		var mockScope = createMockScope([mockNode]);

		var mockDragging = {
			startDrag: function (evt, config) {
				config.clicked();
			},
		};

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.nodeMouseDown(mockEvt, 0);

		expect(mockNode.selected).toBe(true);
	});

	it('test can deslect all nodes', function () {

		var mockNode1 = {
			selected: true,
		};

		var mockNode2 = {
			selected: true,
		};

		var mockScope = createMockScope([mockNode1, mockNode2]);

		var mockDragging = {
			startDrag: function (evt, config) {
				config.clicked();
			},
		};

		var testObject = new FlowChartController(mockScope, mockDragging);

		testObject.deselectAllNodes();

		expect(mockNode1.selected).toBe(false);
		expect(mockNode2.selected).toBe(false);
	});

	it('test other nodes are deselected when a node is clicked', function () {

		var mockSelectedNode = {
			selected: true,
		};

		var mockClickedNode = {
			selected: false,
		};

		var mockScope = createMockScope([mockSelectedNode, mockClickedNode]);

		var mockDragging = {
			startDrag: function (evt, config) {
				config.clicked();
			},
		};

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.nodeMouseDown(mockEvt, 1);

		expect(mockSelectedNode.selected).toBe(false);
		expect(mockClickedNode.selected).toBe(true);
	});

	it('test nodes are deselected when background is clicked', function () {

		var mockSelectedNode = {
			selected: true,
		};

		var mockScope = createMockScope([mockSelectedNode]);

		var mockDragging = {
			startDrag: function (evt, config) {
				config.clicked();
			},
		};

		var testObject = new FlowChartController(mockScope, mockDragging);

		var mockEvt = {};

		mockScope.mouseDown(mockEvt);

		expect(mockSelectedNode.selected).toBe(false);
	});	
});