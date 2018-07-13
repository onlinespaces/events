import React from 'react';
import {Header, Image} from "semantic-ui-react";

const UserDetailedPhotos = ({photos}) => {
    return (
        <div>
            <Header icon='image' content='Photos'/>
            {photos &&
            < Image.Group size='small' >
                {photos.map((photo) =>
                    <Image key={photo.id} src={photo.url}/>
                )}
            </Image.Group>
            }
            )
        </div>
    )};

export default UserDetailedPhotos;