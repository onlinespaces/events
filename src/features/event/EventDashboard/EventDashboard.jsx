import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Button, Grid } from 'semantic-ui-react';
import EventList from '../../event/EventList/EventList';
import EventActivity from '../../event/EventActivity/EventActivity';
import { getEventsForDashboard } from "../eventActions";
import LoadingComponent from '../../../app/layout/LoadingComponent';

const mapState = (state) => ({
    events: state.events,
    loading: state.async.loading
});

const actions = {
    getEventsForDashboard
};

class EventDashboard extends Component {

    state = {
        moreEvents: false,
        loadingInitial: true,
        loadedEvents: []
    };

    async componentDidMount() {
        let next = await this.props.getEventsForDashboard();
        console.log(next);
        if(next && next.docs && next.docs.length > 1) {
            this.setState({
                moreEvents: true,
                loadingInitial: false
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.events !== nextProps.events) {
            this.setState({
                loadedEvents: [...this.state.loadedEvents, ...nextProps.events]
            })
        }
    }

    getNextEvents = async () => {
        const {events} = this.props;
        let lastEvent = events && events[events.length - 1];
        let next = await this.props.getEventsForDashboard(lastEvent);
        if(next && next.docs && next.docs.length <= 1) {
            this.setState({
                moreEvents: false
            });
        }
    };

    handleDeleteEvent = eventId  => () => {
        this.props.deleteEvent(eventId);
    };

    render() {
        const {loading} = this.props;
        const {loadingInitial, loadedEvents, moreEvents} = this.state;

        if(loadingInitial) return <LoadingComponent inverted={true} />;
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventList deleteEvent={this.handleDeleteEvent} events={loadedEvents} />
                    <Button loading={loading} onClick={this.getNextEvents}
                            disabled={!moreEvents}
                            content='More'
                            color='green'
                            floated='right'/>
                </Grid.Column>
                <Grid.Column width={6}>
                    <EventActivity/>
                </Grid.Column>
            </Grid>
        );
    }
}

export default connect(mapState, actions)(firestoreConnect([{collection: 'events'}])(EventDashboard));