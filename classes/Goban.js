import { Position } from "./Position.js";
import starPoints from '../clean/values/star_points.json'assert {type: 'json'};
import iVal from '../clean/values/intersection.json'assert {type: 'json'};

export class Goban {
    constructor(size, container, position, gameTree, focus) {
        this.size = size;

        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.position = position ? position : new Position(size);

        this.focus = focus;
        this.focusWidth = this.focus[1][0] - this.focus[0][0];
        this.focusHeight = this.focus[1][1] - this.focus[0][1];

        this.offsetX = null;
        this.offsetY = null;

        this.lineThickness = null;
        this.lineSpacing = null;
        this.starPointRadius = null;
        this.stoneRadius = null;
        this.boardWidth = null;

        this.editState = null;

        this.render();
        this.intersectionListener();
    }

    render() {
        // Compute optimal canvas dimensions according to container element dimensions.
        const candidateLineThickness = this.container.offsetWidth / (22 * this.focusWidth + 28.2);

        if ((22 * this.focusHeight + 28.2) * candidateLineThickness <= this.container.offsetHeight) {
            this.lineThickness = candidateLineThickness;
        } else {
            this.lineThickness = this.container.offsetHeight / (22 * this.focusHeight + 28.2)
        }

        this.lineSpacing = 22 * this.lineThickness;
        this.starPointRadius = 2 * this.lineThickness;
        this.stoneRadius = 10.5 * this.lineThickness;
        this.boardWidth = 424.2 * this.lineThickness;

        this.canvas.width = (22 * this.focusWidth + 28.2) * this.lineThickness;
        this.canvas.height = (22 * this.focusHeight + 28.2) * this.lineThickness;

        this.container.appendChild(this.canvas);

        // Derive offsets from previous results
        this.offsetX = - (22 * this.focus[0][0] - 13.6) * this.lineThickness;
        this.offsetY = - (22 * this.focus[0][1] - 13.6) * this.lineThickness;

        // Draw lines
        const gridWidth = this.lineThickness + (this.size - 1) * this.lineSpacing;

        for (let i = 0; i < this.size; i++) {
            this.ctx.fillRect(this.offsetX, this.offsetY + i * this.lineSpacing, gridWidth, this.lineThickness);
            this.ctx.fillRect(this.offsetX + i * this.lineSpacing, this.offsetY, this.lineThickness, gridWidth);
        }

        // Draw star points
        starPoints[this.size].forEach(coordinate => {
            const x = this.offsetX + this.lineThickness / 2 + (coordinate[0] - 1) * this.lineSpacing;
            const y = this.offsetY + this.lineThickness / 2 + (coordinate[1] - 1) * this.lineSpacing;

            this.ctx.beginPath();
            this.ctx.arc(x, y, this.starPointRadius, 0, 2 * Math.PI);
            this.ctx.fill();
        });

        // Draw stones
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const intersection = this.position.getIntersection(i, j);
                const black = intersection == 1;
                const white = intersection == 2;

                if (black || white) {
                    const x = this.offsetX + this.lineThickness / 2 + (i) * this.lineSpacing;
                    const y = this.offsetY + this.lineThickness / 2 + (j) * this.lineSpacing;

                    this.ctx.beginPath();

                    this.ctx.arc(x, y, this.stoneRadius, 0, 2 * Math.PI);

                    if (black) {
                        this.ctx.fillStyle = 'black';
                        this.ctx.lineWidth = this.lineThickness;
                        this.ctx.stroke();
                        this.ctx.fill();
                    }
                    if (white) {
                        this.ctx.fillStyle = 'black';
                        this.ctx.lineWidth = this.lineThickness;
                        this.ctx.stroke();
                        this.ctx.fillStyle = 'white';
                        this.ctx.fill();
                    }
                }
            }
        }
    }

    intersectionListener() {
        this.canvas.onclick = e => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    const iLoc = [
                        this.offsetX + i * this.lineSpacing,
                        this.offsetY + j * this.lineSpacing
                    ];
                    if (
                        iLoc[0] - 4 * this.lineThickness < x &&
                        iLoc[0] + 4 * this.lineThickness > x &&
                        iLoc[1] - 4 * this.lineThickness < y &&
                        iLoc[1] + 4 * this.lineThickness > y
                    ) {
                        this.clickHandler(i, j);
                    }
                }
            }
        }
    }

    clickHandler(i, j) {
        switch (this.editState) {
            case 'editBlack':
                if (this.position.getIntersection(i, j) === iVal.BLACK) {
                    this.position.setIntersection(i, j, iVal.EMPTY);
                } else {
                    this.position.setIntersection(i, j, iVal.BLACK);
                }
                break;
            case 'editWhite':
                if (this.position.getIntersection(i, j) === iVal.WHITE) {
                    this.position.setIntersection(i, j, iVal.EMPTY);
                } else {
                    this.position.setIntersection(i, j, iVal.WHITE);
                }
                break;
        
            default:
                alert(`intersection ${i}, ${j}`)
                break;
        }

        this.render();
    }
}
