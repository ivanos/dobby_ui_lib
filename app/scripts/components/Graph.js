import Component from "../Component";

var i = 0;

class Graph extends Component {
    constructor($el) {
        super($el);

        this.graph = {
            nodes: [],
            edges: []
        };

        this.nodesMap = new Map();
        this.edgesMap = new Map();
    }

    refreshGraphData() {
        this.graph.nodes = [...this.nodesMap.values()];
        this.graph.edges = [...this.edgesMap.values()];
    }

    setNodes(nodes) {
        let newNodes = [...nodes].filter(n => !this.nodesMap.has(n));
        let nodesToRemove = [...this.nodesMap.keys()].filter(n => !nodes.has(n));

        newNodes.forEach(data => {
            let node = new Node(data, data.id || i++);
            this.nodesMap.set(data, node);
        });

        nodesToRemove.forEach(node => {
            this.nodesMap.delete(node);
        });

        this.refreshGraphData();
    }

    addNode(data) {
        this.setNodes([data]);
    }

    createEdge(source, target, data) {
        let {id: sourceId} = this.nodesMap.get(source),
            {id: targetId} = this.nodesMap.get(target);

        return new Edge(sourceId, targetId, data);
    }

    setEdges(edges) {
        let links = new Set([...edges].map(({data}) => data));
        let newEdges = [...edges].filter(({data}) => !this.edgesMap.has(data));
        let edgesToRemove = [...this.edgesMap.keys()].filter(edge => !links.has(edge));

        console.log(edges, newEdges, edgesToRemove);

        newEdges.forEach(({source, target, data}) => {
            var edge = this.createEdge(source, target, data);
            this.edgesMap.set(data, edge);
        });

        edgesToRemove.forEach(edge => {
            this.edgesMap.delete(edge);
        });

        this.refreshGraphData();
    }

    addEdge(sourceNode, targetNode, data) {
        this.setEdges([{sourceNode, targetNode, data}]);
    }
}

class Node {
    constructor(data, id) {
        this.id = id;
        this.x = Math.random();
        this.y = Math.random();
        this.size = 1;
        this.color = "#FFF";
        this.data = data;
        this.radius = 50;
    }
}

class Edge {
    constructor(sourceId, targetId, data) {
        this.id = [sourceId, targetId].join("|");
        this.source = sourceId;
        this.target = targetId;
        this.weight = 1;
        this.data = data;
    }
}

export default Graph;

export {
    Node,
    Edge
}
