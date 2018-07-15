import React from 'react';
import LazyLoad from 'react-lazyload';
import {Header, Image, Segment} from "semantic-ui-react";

const UserDetailedPhotos = ({photos}) => {
    return (
        <Segment attached>
            <Header icon='image' content='Photos'/>
                < Image.Group size='small' >
                    {photos.map((photo) =>
                        <LazyLoad key={photo.id}
                                  height={150}
                                  placeholder={<Image src='/assets/user.png'/>}>
                            <Image src={photo.url}/>
                        </LazyLoad>
                    )}
                </Image.Group>
        </Segment>
    )};

export default UserDetailedPhotos;