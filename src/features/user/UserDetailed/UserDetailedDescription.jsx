import React from 'react';
import { Grid, Item, Header, Icon, List } from "semantic-ui-react";

const UserDetailedDescription = ({profile}) => {
    return (
        <Grid columns={2}>
            <Grid.Column width={10}>
                <Header icon='smile' content='About Display Name'/>
                <p>I am a: <strong>{profile.occupation}</strong></p>
                <p>Originally from <strong>{profile.origin}</strong></p>
                <p>Member Since: <strong>28th March 2018</strong></p>
                <p>{profile.about}</p>
            </Grid.Column>
            <Grid.Column width={6}>

                <Header icon='heart outline' content='Interests'/>
                {profile.interests &&
                <List>
                    {profile.interests.map((interest) =>
                        <Item  key={interest}>
                            <Icon name='heart'/>
                            <Item.Content>{interest}</Item.Content>
                        </Item>
                    )}
                </List>
                }
            </Grid.Column>
        </Grid>
    )
};

export default UserDetailedDescription;