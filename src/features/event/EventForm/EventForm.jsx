import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import cuid from 'cuid';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { createEvent, updateEvent } from '../eventActions';
import TextInput from '../../../app/common/form/TextInput';

const mapState = (state, ownProps) => {

    const eventId = ownProps.match.params.id;

    let event = {
        title: '',
        date: '',
        city: '',
        venue: '',
        hostedBy: ''
    };

    if(eventId && state.events.length > 0) {
        event = state.events.filter(event => event.id === eventId)[0];
    }

    return {
        event
    }
};

const actions = {
    createEvent,
    updateEvent
};

class EventForm extends Component {
    onFormSubmit = (event) => {
        event.preventDefault();

        if(this.state.event.id) {
            this.props.updateEvent(this.state.event);
            this.props.history.goBack();
        } else {
            const newEvent = {
                ...this.state.event,
                id: cuid(),
                hostPhotoURL: '/assets/user.png'
            };

            this.props.createEvent(newEvent);
            this.props.history.push('/events');
        }
    };
    
    render() {
        return (
            <Grid>
                <Grid.Column width={10}>
                    <Segment>
                        <Form onSubmit={this.onFormSubmit}>
                            <Header sub color='teal' content='Event Details'/>
                            <Field name='title' type='text' component={TextInput} placeholder='Give your event a name.'/>
                            <Field name='category' type='text' component={TextInput} placeholder='What is your event about?'/>
                            <Field name='description' type='text' component={TextInput} placeholder='Tell about your event.'/>
                            <Header sub color='teal' content='Event Location Details'/>
                            <Field name='city' type='text' component={TextInput} placeholder='What city?'/>
                            <Field name='venue' type='text' component={TextInput} placeholder='What venue?'/>
                            <Field name='date' type='text' component={TextInput} placeholder='When is your event?'/>
                            <Button onClick={this.props.history.goBack} type="button">Cancel</Button>
                            <Button positive type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

export default connect(mapState, actions)(reduxForm({form: 'eventForm'})(EventForm));