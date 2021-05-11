const initialState = {
    players: []
}

const GET_PLAYERS = 'GET_PLAYERS';

export const getPlayers = playerArr => {
    return {
        type: GET_PLAYERS,
        payload: playerArr
    }
}

export default function userReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_PLAYERS:
            return { ...state, user: payload };
        default:
            return state;
    }
}