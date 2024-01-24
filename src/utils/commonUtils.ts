import { SquareValues, State } from '../types/gameTypes';

export function cloneValues(values: SquareValues[][]): SquareValues[][] {
  return values.map((row) =>
    row.map(({ id, value, isValid, flipPieces, isPlaced, isFlipped }) => ({
      id,
      value,
      isValid,
      flipPieces,
      isPlaced,
      isFlipped,
    }))
  );
}

export function cloneState(state: State): State {
  return {
    values: cloneValues(state.values),
    whitePiece: state.whitePiece,
    blackPiece: state.blackPiece,
    currentTurn: state.currentTurn,
    turnPass: state.turnPass,
    gameEnd: state.gameEnd,
    id: state.id,
    isSaveDisabled: state.isSaveDisabled,
    showModal: state.showModal,
  }
}

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function validate(data: State, id: string) {
  const clonedData = cloneState(data);

  if (clonedData as State) {
    if (clonedData.id === id) {
      return clonedData;
    } else {
      return "Something went wrong.";
    }
  } else {
    return "Something went wrong.";
  }
}