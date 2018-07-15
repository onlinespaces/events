import React, {Component} from 'react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import {compose} from 'redux';
import {Grid} from "semantic-ui-react";
import { userDetailedQuery } from '../userQueries';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedSidebar from './UserDetailedSidebar';
import UserDetailedEvents from './UserDetailedEvents';

class UserDetailedPage extends Component {
    render() {
        const { photos, profile, auth, match } = this.props;
        const isCurrentUser = auth.uid === match.params.id;
        return (
            <Grid>
                <Grid.Column width={16}>
                    <UserDetailedHeader profile={profile}/>
                </Grid.Column>
                <Grid.Column width={12}>
                    <UserDetailedDescription profile={profile}/>
                </Grid.Column>
                <Grid.Column width={4}>
                    <UserDetailedSidebar isCurrentUser={isCurrentUser }/>
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

const mapState = (state, ownProps) => {
    let userUid = null;
    let profile = {};

    if(ownProps.match.params.id === state.auth.id) {
        profile = state.firebase.profile;
    } else {
        profile = !isEmpty(state.firestore.ordered.profile) && state.firestore.ordered.profile[0];
        userUid = ownProps.match.params.id;
    }
    return {
        profile,
        userUid,
        photos: state.firestore.ordered.photos,
        auth: state.firebase.auth
    }
};

export default compose(
    connect(mapState),
    firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
)(UserDetailedPage);