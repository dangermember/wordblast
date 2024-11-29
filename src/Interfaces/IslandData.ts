import { JSONArray } from "@devvit/public-api";
import Vertex from "../Types/Vertex.js";

export interface IslandData extends JSONArray {
    index: number;
    size: number;
    vertices: Vertex[];
}
