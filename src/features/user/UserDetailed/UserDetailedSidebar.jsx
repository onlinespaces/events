import React from 'react';
import {Link} from "react-router-dom";
import {Button, Segment} from "semantic-ui-react";

const UserDetailedSidebar = ({isCurrentUser}) => {
    return (
        <Segment>
            {isCurrentUser ?
                <Button as={Link} to='/settings' color='teal' fluid basic content='Edit Profile'/>
                :
                <Button color='teal' fluid basic content='Follow User'/>
            }
        </Segment>
    )};

export default UserDetailedSidebar;