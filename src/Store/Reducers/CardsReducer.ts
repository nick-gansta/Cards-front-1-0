import {apiCards} from "../../Dal/Api";
import {AppThunk} from "../Store";
import {initialApp, setAlertList} from "./AppReducer";


type CardType = {
    answer: string
    cardsPack_id: string
    comments: string
    created: string
    grade: number
    more_id: string
    question: string
    rating: number
    shots: number
    type: string
    updated: string
    user_id: string
    __v: number
    _id: string
}
const initialState = {
    cards: [] as Array<CardType>,
    cardsTotalCount: 0,
    maxGrade: 0,
    minGrade: 0,
    page: 0,
    pageCount: 0,
    packUserId: '',
    currentPack: ''
}

export type CardInitStateType = typeof initialState

export const cardsReducer = (state: CardInitStateType = initialState, action: CardsActionType): CardInitStateType => {
    switch (action.type) {
        case "CARDS/GET-CARDS": {
            return {
                ...state,
                cards: action.data.cards,
                cardsTotalCount: action.data.cardsTotalCount,
                maxGrade: action.data.maxGrade,
                minGrade: action.data.minGrade,
                page: action.data.page,
                pageCount: action.data.pageCount,
                packUserId: action.data.packUserId,
            }
        }
        case "CARDS/CHANGE-VALUE-CARD": {
            return {
                ...state,
                cards: state.cards.map(el => el._id === action.id ? {
                    ...el,
                    question: action.question,
                    answer: action.answer
                } : el)
            }
        }
        case "CARDS/CHANGE-CURRENT-PACK": {
            return {
                ...state, currentPack: action.id
            }
        }
        case "CARDS/DELETE-CARD": {
            return {
                ...state,
                cards: state.cards.filter(el => el._id !== action.id)
            }
        }
        default: {
            return state
        }
    }
}
//types
export type CardsActionType =
    | ReturnType<typeof changeValueCard>
    | ReturnType<typeof deleteCard>
    | ReturnType<typeof changeCurrentPack>
    | ReturnType<typeof getCards>

//actions
const getCards = (data: CardInitStateType) => {
    return {type: 'CARDS/GET-CARDS', data} as const
}
const changeValueCard = (id: string, question: string, answer: string) => {
    return {type: 'CARDS/CHANGE-VALUE-CARD', id, question, answer} as const
}
export const deleteCard = (id: string) => {
    return {type: 'CARDS/DELETE-CARD', id} as const
}
export const changeCurrentPack = (id: string) => {
    return {type: 'CARDS/CHANGE-CURRENT-PACK', id} as const
}

//thunks
export const getCardsTC = (id: string): AppThunk => (dispatch) => {
    dispatch(initialApp())
    apiCards.getCards(id)
        .then((res) => {
            dispatch(initialApp())
            dispatch(getCards(res.data))
            dispatch(changeCurrentPack(id))
        })
}
export const addedCardsTC = (id: string, question: string, answer: string): AppThunk => (dispatch) => {
    apiCards.addCard(id, question, answer)
        .then((res) => {
            dispatch(getCardsTC(id))
        })
}
export const deleteCardsTC = (id: string): AppThunk => (dispatch) => {
    apiCards.deleteCard(id)
        .then((res) => {
            dispatch(deleteCard(id))

            dispatch(setAlertList({id: 1, type: 'success', title: '  Your card has been successfully deleted'}))
        })
        .catch((error) => {
            dispatch(setAlertList({id: 1, type: 'error', title: 'It is impossible to delete someone else value'}))
        })
}
export const changeCardsTC = (id: string, question: string, answer: string): AppThunk => (dispatch) => {
    apiCards.changeCard(id, question, answer)
        .then((res) => {
            dispatch(changeValueCard(id, question, answer))
        })
        .catch((error) => {
            dispatch(setAlertList({id: 1, type: 'error', title: 'It is impossible to change someone else value'}))
        })
}