import React from 'react';
import {Header, Image, Segment} from "semantic-ui-react";

const UserDetailedPhotos = ({photos}) => {
    return (
        <Segment attached>
            <Header icon='image' content='Photos'/>
                < Image.Group size='small' >
                    {photos.map((photo) =>
                        <Image key={photo.id} src={photo.url}/>
                    )}
                </Image.Group>
        </Segment>
    )};

export default UserDetailedPhotos;