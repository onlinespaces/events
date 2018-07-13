import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Button, Card, Grid, Header, Image, Menu, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedPhotos from './UserDetailedPhotos';

class UserDetailedPage extends Component {

    render() {
        const { photos, profile } = this.props;
        return (
            <Grid>
                <Grid.Column width={16}>
                    <Segment>
                        <UserDetailedHeader profile={profile}/>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Segment>
                        <UserDetailedDescription profile={profile}/>

                    </Segment>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Segment>
                        <Button as={Link} to='/settings' color='teal' fluid basic content='Edit Profile'/>
                    </Segment>
                </Grid.Column>

                <Grid.Column width={12}>
                    <Segment attached>
                        <UserDetailedPhotos photos={photos}/>
                    </Segment>
                </Grid.Column>

                <Grid.Column width={12}>
                    <Segment attached>
                        <Header icon='calendar' content='Events'/>
                        <Menu secondary pointing>
                            <Menu.Item name='All Events' active/>
                            <Menu.Item name='Past Events'/>
                            <Menu.Item name='Future Events'/>
                            <Menu.Item name='Events Hosted'/>
                        </Menu>

                        <Card.Group itemsPerRow={5}>

                            <Card>
                                <Image src={'/assets/categoryImages/drinks.jpg'}/>
                                <Card.Content>
                                    <Card.Header textAlign='center'>
                                        Event Title
                                    </Card.Header>
                                    <Card.Meta textAlign='center'>
                                        28th March 2018 at 10:00 PM
                                    </Card.Meta>
                                </Card.Content>
                            </Card>

                            <Card>
                                <Image src={'/assets/categoryImages/drinks.jpg'}/>
                                <Card.Content>
                                    <Card.Header textAlign='center'>
                                        Event Title
                                    </Card.Header>
                                    <Card.Meta textAlign='center'>
                                        28th March 2018 at 10:00 PM
                                    </Card.Meta>
                                </Card.Content>
                            </Card>

                        </Card.Group>
                    </Segment>
                </Grid.Column>
            </Grid>

        );
    }
}

const mapState = (state) => ({
    profile: state.firebase.profile,
    photos: state.firestore.ordered.photos,
});

export default connect(mapState)(UserDetailedPage);