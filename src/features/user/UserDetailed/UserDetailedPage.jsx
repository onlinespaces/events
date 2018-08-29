import React, {Component} from 'react';
import { connect } from 'react-redux';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import {compose} from 'redux';
import {Grid} from "semantic-ui-react";
import { userDetailedQuery } from '../userQueries';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedSidebar from './UserDetailedSidebar';
import UserDetailedEvents from './UserDetailedEvents';
import {getUserEvents} from '../userActions';

const actions = {
    getUserEvents
};

class UserDetailedPage extends Component {
    async componentDidMount() {
        await this.props.getUserEvents(this.props.userUid);
    }

    changeTab = (e, data) => {
        this.props.getUserEvents(this.props.userUid, data.activeIndex);
    };

    render() {
        const {events, eventsLoading, photos, profile, auth, match, requesting } = this.props;
        const isCurrentUser = auth.uid === match.params.id;
        const loading = Object.values(requesting).some(a => a === true);

        if(loading) return <LoadingComponent inverted={true}/>;
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
                    <UserDetailedEvents events={events} eventsLoading={eventsLoading} changeTab={this.changeTab}/>
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
        auth: state.firebase.auth,
        requesting: state.firestore.status.requesting,
        events: state.events,
        eventsLoading: state.async.loading,
    }
};

export default compose(
    connect(mapState, actions),
    firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
)(UserDetailedPage);