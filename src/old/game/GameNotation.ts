import {Game} from "./frontend/Game";


export interface GameNotation<GAME extends Game> {
    createGame(): Promise<GAME>
}
