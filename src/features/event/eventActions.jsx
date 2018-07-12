import { toastr } from 'react-redux-toastr';
import {CREATE_EVENT, DELETE_EVENT, UPDATE_EVENT, FETCH_EVENTS} from "./eventConstants";
import { asyncActionError, asyncActionStart, asyncActionFinish } from "../async/asyncActions";
import { fetchSampleData} from "../../app/data/mockApi";

export const createEvent = (event) => {
    return async dispatch => {
        try {
            dispatch({
                type: CREATE_EVENT,
                payload: {
                    event
                }
            });
            toastr.success('Success', 'Event has been created');
        } catch(error) {
            toastr.error('Error', 'Something went wrong');
        }
    }
};

export const updateEvent = (event) => {
    return async dispatch => {
        try {
            dispatch({
                type: UPDATE_EVENT,
                payload: {
                    event
                }
            });
            toastr.success('Success', 'Event has been updated');
        } catch(error) {
            toastr.error('Error', 'Something went wrong when updating');
        }
    }
};

export const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        payload: {
            eventId
        }
    }
};

export const fetchEvents = (events) => {
    return {
        type: FETCH_EVENTS,
        payload: events
    }
};

export const loadEvents = () => {
    return async dispatch => {
        try {
            dispatch(asyncActionStart());
            let events = await fetchSampleData();
            dispatch(fetchEvents(events));
            dispatch(asyncActionFinish());
        } catch(err) {
            dispatch(asyncActionError());
        }
    }
};