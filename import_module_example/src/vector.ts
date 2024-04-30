import { Vector2 } from "./vector2";
import { Vector3 } from "./vector3";


const vec2a = new Vector2(1, 2);
const vec2b = new Vector2(2, 1);

console.log(vec2a.add(vec2b));

const vec3a = new Vector3(1, 2, 3);
const vec3b = new Vector3(3, 2, 1);

console.log(vec3a.add(vec3b));