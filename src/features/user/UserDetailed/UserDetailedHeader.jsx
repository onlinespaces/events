import React from 'react';
import differenceInYears from "date-fns/difference_in_years";
import {Header, Item, Segment} from "semantic-ui-react";

const UserDetailedHeader = ({profile}) => {

    let age;
    if(profile.dateOfBirth) {
        age = differenceInYears(Date.now(), profile.dateOfBirth.toDate());
    } else {
        age = 'Unknown';
    }

    return (
        <Segment>
            <Item.Group>
                <Item>
                    <Item.Image avatar size='small' src={profile.photoURL}/>
                    <Item.Content verticalAlign='bottom'>
                        <Header as='h1'>{profile.displayName}</Header>
                        <br/>
                        <Header as='h3'>{profile.occupation}</Header>
                        <br/>
                        <Header as='h3'>{age}, Lives in {profile.city}</Header>
                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
    )
};

export default UserDetailedHeader;