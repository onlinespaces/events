import React from 'react';
import {Link} from 'react-router-dom';
import format from 'date-fns/format';
import {Segment, Card, Image, Header, Tab} from "semantic-ui-react";

const panes = [
    {menuItem: 'All Events', pane: {key: 'allEvents'}},
    {menuItem: 'Past Events', pane: {key: 'pastEvents'}},
    {menuItem: 'Future Events', pane: {key: 'futureEvents'}},
    {menuItem: 'Hosted Events', pane: {key: 'hostedEvents'}},
];

const UserDetailedEvents = ({changeTab, events, eventsLoading}) => {
    return (
        <Segment attached loading={eventsLoading}>
            <Header icon='calendar' content='Events'/>
            <Tab panes={panes} menu={{secondary: true, pointing: true}} onTabChange={(e, data) => changeTab(e, data)}/>
            <br/>
            <Card.Group itemsPerRow={5}>
                {events && events.map( event => (
                    <Card key={event.id} as={Link} to={`/event/${event.id}`}>
                        <Image src={`/assets/categoryImages/${event.category}.jpg`}/>
                        <Card.Content>
                            <Card.Header textAlign='center'>
                                {event.title}
                            </Card.Header>
                            <Card.Meta textAlign='center'>
                                <div>{format(event.date && event.date.toDate(), 'DD MMM YYYY')}</div>
                                <div>{format(event.date && event.date.toDate(), 'h:mm A')}</div>
                            </Card.Meta>
                        </Card.Content>
                    </Card>
                    )
                )}
            </Card.Group>
        </Segment>
    )};

export default UserDetailedEvents;