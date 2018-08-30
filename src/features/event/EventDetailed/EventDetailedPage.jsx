import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirestore, firebaseConnect } from 'react-redux-firebase';
import {compose} from 'redux';
import { Grid }  from 'semantic-ui-react';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedSidebar from './EventDetailedSidebar';
import {objectToArray} from '../../../app/common/util/helpers';
import {goingToEvent, cancelGoingToEvent} from '../../user/userActions';
import {addEventComment} from '../eventActions';

const mapState = (state) => {
    let event = {};

    if(state.firestore.ordered.events && state.firestore.ordered.events[0]) {
        event = state.firestore.ordered.events[0];
        console.log('E');
        console.log(event);
    }

    return {
        event,
        auth: state.firebase.auth
    };
};

const actions = {
    goingToEvent,
    cancelGoingToEvent,
    addEventComment
};

class EventDetailedPage extends Component {
    async componentDidMount() {
        const {firestore, match} = this.props;
        console.log('E3');
        console.log(match.params.id);
        await firestore.setListener(`/event/${match.params.id}`);
    }

    async componentWillUnmount() {
        const {firestore, match} = this.props;
        await firestore.unsetListener(`/event/${match.params.id}`);
    }

    render() {
        const {event, auth, goingToEvent, cancelGoingToEvent, addEventComment} = this.props;

        console.log('E2');
        console.log(event);

        const attendees = event && event.attendees && objectToArray(event.attendees);
        const isHost = event && event.hostUid === auth.uid;
        const isGoing = attendees && attendees.some(a => a.id === auth.uid);
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventDetailedHeader event={event} isHost={isHost} isGoing={isGoing}
                                         goingToEvent={goingToEvent}
                                         cancelGoingToEvent={cancelGoingToEvent}/>
                    <EventDetailedInfo event={event}/>
                    <EventDetailedChat addEventComment={addEventComment}/>
                </Grid.Column>
                <Grid.Column width={6}>
                    <EventDetailedSidebar attendees={attendees}/>
                </Grid.Column>
            </Grid>
        )
    }
}

export default compose(
    withFirestore,
    connect(mapState, actions),
    firebaseConnect((props) => ([`event_chat/${props.match.params.id}`]))
) (EventDetailedPage);