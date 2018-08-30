import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import GoogleMapReact from 'google-map-react';

const Marker = () => <Icon name='marker' size='big' color='red'/>;

const EventDetailedMap = ({lat, long}) => {
    const center = [lat, long];
    const zoom = 14;

    return (
        <Segment attached='bottom' style={{padding: 0}} >
            <div style={{ height: '300px', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyCyEQybmKIrSEArl0KSMPvtzu8VmfoVxtA' }}
                    defaultCenter={center}
                    defaultZoom={zoom}
                >
                    <Marker
                        lat={lat}
                        lng={long}
                    />
                </GoogleMapReact>
            </div>
        </Segment>
    )
};

export default EventDetailedMap;