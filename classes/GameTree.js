import { Position } from "./Position.js";
import players from '../values/players.json'assert {type: 'json'};

export class GameTree {
    constructor(size, nodes = null) {
        this.size = size;
        this.initNodes(nodes);
    }

    next(n) {
         
    }

    initNodes(nodes) {
        if (nodes) {
            this.nodes = nodes;
            this.computeParents();
            this.computeChildren();
            this.computeTurns(this.nodes[0]);
        } else {
            this.nodes = [{
                parent: null
            }]
        }
    }

    /**
     * Recursively infer which turn it is for each node
     */
    computeTurns(node) {
        node.children.forEach(child => {
            if (!('turn' in child)) {
                child['turn'] = node.turn == players.BLACK ? players.WHITE : players.BLACK;
            }
            computeTurns(child);
        });
    }

    /**
     * The value associated with the "parent" key of each node 
     * is turned into an actual reference to the parent node.
     */
    computeParents() {
        this.nodes.forEach(node => {
            if (node.parent !== null) {
                node.parent = this.nodes[node.parent];
            }
        });
    }

    /**
     * A "children" key is added to every node. The value associated
     * with that key is an array of the node's children.
     */
    computeChildren() {
        this.nodes.forEach(node => {
            if (node.parent) {
                const parent = node.parent;
                if ('children' in parent) {
                    parent.children.push(node);
                }
                else {
                    parent['children'] = [node];
                }
            }
        });
    }


}
