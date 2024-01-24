import { useEffect, useReducer } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Board from '../../components/Board';
import Counter from '../../components/Counter';
import Tooltip from '../../components/Tooltip';
import CircleButton from '../../components/Buttons/CircleButton';
import { highlightMoves } from '../../utils/gameProcessUtils';
import { SquareValues, State } from '../../types/gameTypes';
import { storeData } from '../../services/apiServices';
import style from './game.module.css';
import ActionModal from '../../components/ActionModal';
import Piece from '../../components/Piece';
import BackButton from '../../components/Buttons/BackButton';

type Action = 
    | { type: "setAll"; value: State }
    | { type: "setValues"; value: State["values"] }
    | { type: "setPieces"; value: [State["whitePiece"], State["blackPiece"]] }
    | { type: "setCurrentTurn"; value: State["currentTurn"] }
    | { type: "setTurnPass"; value: State["turnPass"] }
    | { type: "setGameEnd"; value: State["gameEnd"] }
    | { type: "setId"; value: State["id"] }
    | { type: "setIsSaveDisabled"; value: State["isSaveDisabled"] }
    | { type: "setShowModal"; value: State["showModal"] }
    | { type: "restart" }

const initialWhite = [33, 44];
const initialBlack = [34, 43];
const initialValues: SquareValues[][] = Array.from({length: 8}, (_, i) => Array.from({length: 8}, (_, j) => {
    const id = parseInt(`${i}${j}`);

    if (initialWhite.includes(id)) {
      return { id: `${i}${j}`, value: 0, isValid: false, flipPieces: [], isPlaced: false, isFlipped: false };
    } else if (initialBlack.includes(id)) {
        return { id: `${i}${j}`, value: 1, isValid: false, flipPieces: [], isPlaced: false, isFlipped: false };
    } else {
      return { id: `${i}${j}`, value: null, isValid: false, flipPieces: [], isPlaced: false, isFlipped: false };
    }
}));
const initialState: State = {
    values: initialValues,
    whitePiece: initialWhite.length,
    blackPiece: initialBlack.length,
    currentTurn: 1,
    turnPass: false,
    gameEnd: false,
    id: "",
    isSaveDisabled: false,
    showModal: false,
}

function stateReducer(state: State, action: Action): State {
    switch (action.type) {
        case "setAll":
            return { ...state, ...action.value }
        case "setValues":
            return { ...state, values: action.value }
        case "setPieces":
            const [whitePiece, blackPiece] = action.value
            return { ...state, whitePiece: whitePiece, blackPiece: blackPiece }
        case "setCurrentTurn":
            return { ...state, currentTurn: action.value }
        case "setTurnPass":
            return { ...state, turnPass: action.value }
        case "setGameEnd":
            return { ...state, gameEnd: action.value }
        case "setId":
            return { ...state, id: action.value }
        case "setIsSaveDisabled":
            return { ...state, isSaveDisabled: action.value }
        case "setShowModal":
            return { ...state, showModal: action.value }
        case "restart":
            return initialState;
        default:
            throw new Error("Unknown action");
    }
}

export default function Game() {
    const [state, dispatch] = useReducer(stateReducer, initialState);

    const setAll = (values: State) => dispatch({ type: "setAll", value: values });

    const setValues = (values: SquareValues[][] ) => dispatch({ type: "setValues", value: values });

    const setPieces = (whitePiece: number, blackPiece: number) => dispatch({ type: "setPieces", value: [whitePiece, blackPiece] });

    const setCurrentTurn = (currentTurn: 0 | 1) => dispatch({ type: "setCurrentTurn", value: currentTurn });

    const setTurnPass = (turnPass: boolean) => dispatch({ type: "setTurnPass", value: turnPass });

    const setGameEnd = (gameEnd: boolean) => dispatch({ type: "setGameEnd", value: gameEnd });

    const setId = (id: string) => dispatch({ type: "setId", value: id });

    const setIsSaveDisabled = (isSaveDisabled: boolean) => dispatch({ type: "setIsSaveDisabled", value: isSaveDisabled });

    const setShowModal = (showModal: boolean) => dispatch({ type: "setShowModal", value: showModal });

    const restart = () => {
        const id = state.id === "" ? "" : state.id;
        dispatch({ type: "restart" });
        setId(id);
        const highlightedValues = highlightMoves(initialState.values, initialState.currentTurn);
        setValues(highlightedValues);
    }

    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            setAll(location.state);
        }
    }, [location.state])

    const navigate = useNavigate();
  
    const goToMainMenu = () => { 
        navigate('/');
    }

    async function handleSaveGame() {
        setIsSaveDisabled(true);

        const response = await storeData(state, state.id);

        if (response) {
            setId(response.id);
            setIsSaveDisabled(false);
            setShowModal(true);
        } else {
            setIsSaveDisabled(false);
        }
    }

    return (
        <div className={style.gameContainer}>
            <div className={style.topSection}>
                <BackButton onClick={goToMainMenu} size='xl' />
                <h3 className={style.currentTurn}>{state.currentTurn ? "Player's Turn" : "Computer's Turn"}</h3>
            </div>
            <div className={style.infoContainer}>
                <div className={style.id}>
                    <p>{state.id}</p>
                </div>
                <div className={style.optionButtons}>
                    <Tooltip description={"Save game"}>
                        <CircleButton onClick={() => handleSaveGame()} isDisabled={state.isSaveDisabled} icon="save" />
                    </Tooltip>
                    <Tooltip description={"Restart"}>
                        <CircleButton onClick={() => restart()} isDisabled={state.isSaveDisabled} icon="restart" />
                    </Tooltip>
                </div>
            </div>
            <Board values={state.values} currentTurn={state.currentTurn} turnPass={state.turnPass} gameEnd={state.gameEnd} setValues={setValues} setPieces={setPieces} setCurrentTurn={setCurrentTurn} setTurnPass={setTurnPass} setGameEnd={setGameEnd} setIsSaveDisabled={setIsSaveDisabled} />
            <div className={style.counterContainer}>
                <Counter piece={state.blackPiece} color="black" currentTurn={state.currentTurn ? 1 : 0} />
                <Counter piece={state.whitePiece} color="white" currentTurn={state.currentTurn ? 0 : 1} />
            </div>
            <ActionModal title={state.blackPiece > state.whitePiece ? "Congratulations you won!" : state.blackPiece < state.whitePiece ? "Too bad, you lose, better luck next time!" : "The game end with a draw."} buttonText="Start New Game" onClose={() => setGameEnd(false)} onClick={() => restart()} shouldShowModal={state.gameEnd} >
                <div className={style.pieceContainer}>
                    <p><b>{state.blackPiece}</b></p>
                    <Piece color="black" />
                    <Piece color="white" />
                    <p><b>{state.whitePiece}</b></p>
                </div>
            </ActionModal>
            <ActionModal title="Game successfully being saved!" buttonText='OK' onClick={() => setShowModal(false)} shouldShowModal={state.showModal}>
                <div className={style.modalId}>
                    <p><b>Use the auto-generated unique ID below to load your game</b></p>
                    <p>{state.id}</p>
                </div>
            </ActionModal>
        </div>
    );
}