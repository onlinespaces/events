import moment from 'moment';
import { toastr } from 'react-redux-toastr';

export const updateProfile = (user) =>
    async(dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        // Omits isLoaded and isEmpty
        const {isLoaded, isEmpty, ...updatedUser} = user;

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

export const uploadProfileImage = (file, fileName) =>
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        // Is sycronous
        const user = firebase.auth().currentUser;
        const path = `${user.uid}/user_images`;
        const options = {
            name: fileName
        };

        try {
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
                    photURL: downloadURL
                });
            }
            // Add new photo as new image in photos collection
            return await firestore.add({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos'}]
            }, {
                name: fileName,
                url: downloadURL
            })
        } catch(error) {
            console.log(error);
            throw new Error("Problem uploading photo.");
        }
    };
