import React from 'react';
import { Segment, Item, Button, Header, Image } from 'semantic-ui-react';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';

const eventImageStyle = {
    filter: 'brightness(30%)'
};

const eventImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

const EventDetailedHeader = ({event}) => {
    let eventDate;

    if(event.date) {
        eventDate = event.date.toDate();
    }
    return (
        <Segment.Group>
            <Segment basic attached="top" style={{padding: '0'}}>
                {event && event.category && <Image src={`/assets/categoryImages/${event.category}.jpg`} fluid style={eventImageStyle}/>}
                <Segment basic style={eventImageTextStyle}>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                {event &&
                                    <Header
                                        size="huge"
                                        content={event.title}
                                        style={{color: 'white'}}
                                    />
                                }
                                {event &&
                                    <p>{format(eventDate, 'dddd Do MMMM YYYY')}</p>
                                }
                                {event &&
                                    <p>
                                        Hosted by <strong>{event.hostedBy ? event.hostedBy : ''}</strong>
                                    </p>
                                }
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>

            <Segment attached="bottom">
                <Button>Cancel My Place</Button>
                <Button color="teal">JOIN THIS EVENT</Button>
                {event &&
                    <Button as={Link} to={`/manage/${event.id}`} color="orange" floated="right">
                        Manage Event
                </Button>
                }
            </Segment>
        </Segment.Group>
    );
};

export default EventDetailedHeader;