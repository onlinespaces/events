/*global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import { reduxForm, Field } from 'redux-form';
import Script from 'react-load-script';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { combineValidators, composeValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';

const mapState = (state) => {
    let event = {};

    if(state.firestore.ordered.events && state.firestore.ordered.events[0]) {
        event = state.firestore.ordered.events[0];
    }

    return {
        initialValues: event,
        event
    }
};

const actions = {
    createEvent,
    updateEvent,
    cancelToggle
};

const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'},
];

const validate = combineValidators({
    title: isRequired({message: 'An event title is required.'}),
    category: isRequired({message: 'An event category is required.'}),
    description: composeValidators(
        isRequired({message: 'An event description is required.'}),
        hasLengthGreaterThan(4)({message: 'An event description needs to be at least 5 characters.'})
    )(),
    city: isRequired({message: 'An event city is required.'}),
    venue: isRequired({message: 'An event venue is required.'}),
    date: isRequired({message: 'An event date and time is required.'})
});

class EventForm extends Component {
    state = {
        cityLatLng: {},
        venueLatLng: {},
        scriptLoaded: false
    };

    async componentDidMount() {
        const {firestore, match} = this.props;
        await firestore.setListener(`events/${match.params.id}`);
    }

    handleCitySelect = (selectedCity) => {
        geocodeByAddress(selectedCity)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.setState({
                    cityLatLng: latLng
                })
            })
            .then(() => {
                this.props.change('city', selectedCity)
            })
        ;
    };

    handleVenueSelect = (selectedVenue) => {
        geocodeByAddress(selectedVenue)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                this.setState({
                    venueLatLng: latLng
                })
            })
            .then(() => {
                this.props.change('venue', selectedVenue)
            })
        ;
    };

    handleScriptLoaded = () => {
        this.setState({scriptLoaded: true});
    };

    onFormSubmit = (values) => {
        values.venueLatLng = this.state.venueLatLng;

        if(this.props.initialValues.id) {
            if(Object.keys(values.venueLatLng).length === 0) {
                values.venueLatLng = this.props.event.venueLatLng;
            }
            this.props.updateEvent(values);
            this.props.history.goBack();
        } else {
            this.props.createEvent(values);
            this.props.history.push('/events');
        }
    };
    
    render() {
        const {invalid, submitting, pristine, event, cancelToggle} = this.props;

        return (
            <Grid>
                <Script
                    url='https://maps.googleapis.com/maps/api/js?key=AIzaSyCyEQybmKIrSEArl0KSMPvtzu8VmfoVxtA&libraries=places'
                    onLoad={this.handleScriptLoaded}
                />
                <Grid.Column width={10}>
                    <Segment>
                        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                            <Header sub color='teal' content='Event Details'/>
                            <Field name='title'
                                   type='text'
                                   component={TextInput}
                                   placeholder='Give your event a name.'/>
                            <Field name='category'
                                   type='text'
                                   component={SelectInput}
                                   options={category}
                                   placeholder='What is your event about?'/>
                            <Field name='description'
                                   type='text'
                                   component={TextArea}
                                   placeholder='Tell about your event.'
                                   rows='3'
                            />
                            <Header sub color='teal'
                                    content='Event Location Details'/>
                            <Field name='city'
                                   type='text'
                                   component={PlaceInput}
                                   options={{types: ['(cities)']}}
                                   placeholder='What city?'
                                   onSelect={this.handleCitySelect}
                            />
                            {this.state.scriptLoaded &&
                                <Field name='venue'
                                       type='text'
                                       component={PlaceInput}
                                       options={{
                                           location: new google.maps.LatLng(this.state.cityLatLng),
                                           radius: 1000,
                                           types: ['establishment']
                                       }}
                                       placeholder='What venue?'
                                       onSelect={this.handleVenueSelect}
                            />
                            }
                            <Field name='date'
                                   type='text'
                                   component={DateInput}
                                   dateFormat='YYYY-MM-DD HH:mm'
                                   timeFormat='HH:mm'
                                   showTimeSelect
                                   placeholder='Date and Time of event.'/>
                            <Button
                                onClick={this.props.history.goBack}
                                type="button">Cancel</Button>
                            <Button
                                color={event.cancelled ? 'green' : 'red'}
                                floated='left'
                                onClick={() => cancelToggle(!event.cancelled, event.id)}
                                type="button">{event.cancelled ? 'Reactivate Event' : 'Cancel Event'}</Button>
                            <Button
                                positive type="submit"
                                floated='right'
                                disabled={invalid || submitting || pristine}>
                                Submit
                            </Button>
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

export default withFirestore(connect(mapState, actions)(reduxForm({form: 'eventForm', enableReinitialize: true, validate})(EventForm)));