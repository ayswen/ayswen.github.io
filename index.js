import problem from "./dummy_data/problem.json" assert {type: 'json'};
import { Position } from "./classes/Position.js";
import { Goban } from "./classes/Goban.js";
import { GameTree } from "./classes/GameTree.js";

const container = document.querySelector('.container');
const position = new Position(problem.size, problem.position);
const board = new Goban(problem.size, container, position, null, problem.focus);

const switchEditState = editState => {
    board.editState = editState;
}

window.switchEditState = switchEditState;

const tree = new GameTree(problem.size, problem.tree);
console.log(tree.nodes);
