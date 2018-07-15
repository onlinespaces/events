import { toastr } from 'react-redux-toastr';
import moment from 'moment';
import { DELETE_EVENT, FETCH_EVENTS} from "./eventConstants";
import { asyncActionError, asyncActionStart, asyncActionFinish } from "../async/asyncActions";
import { fetchSampleData} from '../../app/data/mockApi';
import { createNewEvent } from '../../app/common/util/helpers';

export const createEvent = (event) => {
    return async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
        const newEvent = createNewEvent(user, photoURL, event);
        try {
            let createdEvent = await firestore.add(`events`, newEvent);
            await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
                eventId: createdEvent.id,
                userUid: user.uid,
                eventDate: event.date,
                host: true
            });
            toastr.success('Success', 'Event has been created');
        } catch(error) {
            toastr.error('Error', 'Something went wrong');
        }
    }
};

export const updateEvent = (event) => {
    return async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();

        if(event.date !== getState().firestore.ordered.events[0].date) {
            event.date = moment(event.date).toDate();
        }

        try {
            await firestore.update(`events/${event.id}`, event);
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

export const cancelToggle = (cancelled, eventId) =>
    async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const message = cancelled ? 'Are you sure you want to cancel the event?' : 'Do you want to reactivate the event?';
        try {
            toastr.confirm(message, {
                onOk: () =>
                    firestore.update(`events/${eventId}`, {
                        cancelled: cancelled
                    })
            });
        } catch(error) {
            console.log(error);
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