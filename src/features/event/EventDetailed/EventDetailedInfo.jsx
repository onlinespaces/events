import React, { Component } from 'react';
import format from 'date-fns/format';
import { Segment, Grid, Icon, Button } from 'semantic-ui-react';
import EventDetailedMap from './EventDetailedMap';

class EventDetailedInfo extends Component{
    state = {
        showMap: false
    };

    componentWillUnmount() {
        this.setState({
            showMap: false
        });
    };

    showMapToggle = () => {
        this.setState(prevState => ({
            showMap: !prevState.showMap
        }));
    };

    render() {
        const {event} = this.props;

        let eventDate;

        if(event.date) {
            eventDate = event.date.toDate();
        }
        return (
            <Segment.Group>
                <Segment attached="top">
                    <Grid>
                        <Grid.Column width={1}>
                            <Icon size="large" color="teal" name="info"/>
                        </Grid.Column>
                        <Grid.Column width={15}>
                            {event &&
                                <p>{event.description}</p>
                            }
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Segment attached>
                    <Grid verticalAlign="middle">
                        <Grid.Column width={1}>
                            <Icon name="calendar" size="large" color="teal"/>
                        </Grid.Column>
                        <Grid.Column width={15}>
                            {event && event.date &&
                                <span>{format(eventDate, 'dddd Do MMMM')} at{' '} {format(eventDate, 'HH:mm')}</span>
                            }
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Segment attached>
                    <Grid verticalAlign="middle">
                        <Grid.Column width={1}>
                            <Icon name="marker" size="large" color="teal"/>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            {event &&
                            <span>{event.venue}</span>
                            }
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Button color="teal"
                                    size="tiny"
                                    content={this.state.showMap ? 'Hide Map' : 'Show Map'}
                                    onClick={this.showMapToggle}/>
                        </Grid.Column>
                    </Grid>
                </Segment>
                {this.state.showMap && event &&
                    <EventDetailedMap
                        lat={event.venueLatLng.lat}
                        long={event.venueLatLng.lng}
                    />
                }
            </Segment.Group>
        )
    }
};

export default EventDetailedInfo;