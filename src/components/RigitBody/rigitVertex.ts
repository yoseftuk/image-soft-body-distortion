import {Vector} from "../../types";

const FORCE_BASE = 0.14;
const FRICTION = .97;

class RigitVertex {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    i: number;
    j: number;
    private linkedVertices: {vertex: RigitVertex, distance: number, force: number}[] = [];

    constructor(x: number, y: number, i: number, j: number) {
        this.position = {x, y};
        this.velocity = {x: 0, y: 0};
        this.acceleration = {x: 0, y: 0};
        this.i = i;
        this.j = j;
    }

    linkVertex(vertex: RigitVertex, distance: number, force = 1) {
        this.linkedVertices.push({vertex, distance, force});
    }

    private getForce() {
        return this.linkedVertices.reduce((sumForce, {vertex, distance, force: f}) => {
            const actualDistance = Math.sqrt((this.position.x - vertex.position.x)**2 + (this.position.y-vertex.position.y)**2);
            // const ff = Math.sign(distance - actualDistance) > 0 ? f : f*.5;
            const force = (distance - actualDistance) * FORCE_BASE * f;

            return {
                x: sumForce.x + force * (this.position.x-vertex.position.x) / actualDistance,
                y: sumForce.y + force * (this.position.y-vertex.position.y) / actualDistance,
            }
        }, {x: 0, y: 0});
    }

    update() {
        this.acceleration = this.getForce();
        this.velocity.x = (this.velocity.x + this.acceleration.x) * FRICTION;
        this.velocity.y = (this.velocity.y + this.acceleration.y) * FRICTION;
    }

    move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

export default RigitVertex;