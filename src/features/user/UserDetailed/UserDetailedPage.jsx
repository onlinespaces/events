import React, {Component} from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import {compose} from 'redux';
import {Grid, Segment} from "semantic-ui-react";
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedSidebar from './UserDetailedSidebar';
import UserDetailedEvents from './UserDetailedEvents';

class UserDetailedPage extends Component {

    render() {
        const { photos, profile } = this.props;
        return (
            <Grid>
                <Grid.Column width={16}>
                    <UserDetailedHeader profile={profile}/>
                </Grid.Column>
                <Grid.Column width={12}>
                    <UserDetailedDescription profile={profile}/>
                </Grid.Column>
                <Grid.Column width={4}>
                    <UserDetailedSidebar />
                </Grid.Column>
                {photos &&
                    <Grid.Column width={12}>
                        <UserDetailedPhotos photos={photos}/>
                    </Grid.Column>
                }
                <Grid.Column width={12}>
                    <UserDetailedEvents/>
                </Grid.Column>
            </Grid>

        );
    }
}

const query = ({auth}) => {
    return [{
        collection: 'users',
        doc: auth.uid,
        subcollections: [{collection: 'photos'}],
        storeAs: 'photos'
    }]
};

const mapState = (state) => ({
    profile: state.firebase.profile,
    photos: state.firestore.ordered.photos,
    auth: state.firebase.auth
});

export default compose(
    connect(mapState),
    firestoreConnect(auth => query(auth))
)(UserDetailedPage);