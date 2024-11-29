import { JSONObject } from "@devvit/public-api";

export interface CellProps extends JSONObject {
    letter: string;
    x: number;
    y: number;
    startColor: string;
    endColor: string;
    startHighlightColor: string;
    endHighlightColor: string;
    solved: boolean
}
export default CellProps;