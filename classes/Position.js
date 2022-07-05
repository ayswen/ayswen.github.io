import iVal from "../values/intersection.json" assert {type: 'json'};

export class Position {
    constructor(size = null, data = null) {
        this.intersections = [];
        for (let i = 0; i < size; i++) {
            this.intersections.push([]);
            for (let j = 0; j < size; j++) {
                this.intersections[i].push(iVal.EMPTY);
            }
        }

        if (data) {
            data.black && data.black.forEach(i => this.setIntersection(i[0], i[1], iVal.BLACK));
            data.white && data.white.forEach(i => this.setIntersection(i[0], i[1], iVal.WHITE));
            data.ko && data.ko.forEach(i => this.setIntersection(i[0], i[1], iVal.KO));
        };
    }

    getIntersection(i, j) {
        return this.intersections[i][j];
    }

    setIntersection(i, j, value) {
        if (!Object.values(iVal).includes(value)) throw new Error("Invalid value for an intersection.");
        this.intersections[i][j] = value;
    }
}
