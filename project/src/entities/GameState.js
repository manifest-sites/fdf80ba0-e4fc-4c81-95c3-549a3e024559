import { createEntityClient } from "../utils/entityWrapper";
import schema from "./GameState.json";
export const GameState = createEntityClient("GameState", schema);
