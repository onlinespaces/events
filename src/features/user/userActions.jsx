import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import firebase from '../../app/config/firebase';
import cuid from 'cuid';
import { asyncActionFinish, asyncActionStart, asyncActionError } from '../async/asyncActions';
import { FETCH_EVENTS } from "../event/eventConstants";

export const updateProfile = (user) =>
    async(dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        // Omits isLoaded and isEmpty
        const {...updatedUser} = user;

        if(updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
            updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
        }

        try {
            await firebase.updateProfile(updatedUser);
            toastr.success('Success', 'Profile updated.');

        } catch(error) {
            console.log(error);
        }
    };

export const uploadProfileImage = (file) =>
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const imageName = cuid();
        const firebase = getFirebase();
        const firestore = getFirestore();
        // Is syncronous
        const user = firebase.auth().currentUser;
        const path = `${user.uid}/user_images`;

        const options = {
            name: imageName
        };

        try {
            dispatch(asyncActionStart());
            // upload the file to firebase
            let uploadedFile = await firebase.uploadFile(path, file, null, options);

            // get url of image
            let downloadURL = await uploadedFile.uploadTaskSnaphot.downloadURL;
            let userDoc = await firestore.get(`users/${user.uid}`);

            // Get user doc and see if user already has a photo. If not, then set as main.
            if(userDoc.data().photoURL) {
                await firebase.updateProfile({
                    photoURL: downloadURL
                });

                await user.updateProfile({
                    photoURL: downloadURL
                });
            }
            // Add new photo as new image in photos collection
            await firestore.add({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos'}]
            }, {
                name: imageName,
                url: downloadURL
            });
            dispatch(asyncActionFinish());
        } catch(error) {
            console.log(error);
            dispatch(asyncActionError());
            throw new Error("Problem uploading photo.");
        }
    };


export const deletePhoto = (photo) =>
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;

        try {
            await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
            await firestore.delete({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos', doc: photo.id}]
            });
        } catch(error) {
            throw new Error("Problem deleting photo.");
        }
    };

export const setMainPhoto = photo =>
    async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        try {
            return await firebase.updateProfile({
                photoURL: photo.url
            })
        } catch(error) {
            console.log(error);
            throw new Error("Problem setting main photo photo.");
        }
    };

export const goingToEvent = (event) =>
    async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
        const attendee = {
            going: true,
            joinDate: Date.now(),
            photoURL: photoURL || '/assets/user.png',
            displayName: user.displayName,
            host: false
        };

        try {
            await firestore.update(`events/${event.id}`, {
                [`attendees.${user.uid}`]: attendee
            });
            await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
                eventId: event.id,
                userUid: user.uid,
                eventDate: event.date,
                host:false
            });
            toastr.success('Success', 'You are signed up for the event.');
        } catch(error) {
            console.log(error);
            toastr.error('Error', 'Error joining the event.');
        }
    };

export const cancelGoingToEvent = (event) =>
    async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        try {
            await firestore.update(`events/${event.id}`, {
                [`attendees.${user.uid}`]: firestore.FieldValue.delete()
            });
            await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
            toastr.success('Success', 'You are no longer signed up for the event.');
        } catch(error) {
            console.log(error);
            toastr.error('Error', 'Error leaving the event.');
        }
    };

export const getUserEvents = (userUid, activeTab) =>
    async (dispatch, getState) => {
        dispatch(asyncActionStart());
        const firestore = firebase.firestore();
        const today = new Date(Date.now());
        let eventsRef = firestore.collection('event_attendee');
        let query;

        switch(activeTab) {
            case 1: //past events
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .where('eventDate', '<=', today)
                    .orderBy('eventDate', 'desc');
                break;
            case 2: //future events
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .where('eventDate', '>', today)
                    .orderBy('eventDate', 'asc');
                break;
            case 3:
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .where('host', '==', true)
                    .orderBy('eventDate', 'desc');
                break;
            default:
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .orderBy('eventDate', 'desc');
                break;
        }

        try {
            let querySnap = await query.get();
            let events = [];
            for(let i = 0; i < querySnap.docs.length; i++) {
                let evt = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get();
                events.push({...evt.data(), id: evt.id});
                dispatch({type: FETCH_EVENTS, payload: {events}});
            }
            dispatch(asyncActionFinish());
        } catch(error) {
            console.log(error);
            dispatch(asyncActionError());
        }
    };