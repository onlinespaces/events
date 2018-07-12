import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../Menus/SignedOutMenu';
import SignedInMenu from '../Menus/SignedInMenu';
import AuxWrapper from '../../../app/common/hoc/AuxWrapper';
import { openModal } from '../../modals/modalActions';
import { logout } from '../../auth/authActions';

const actions = {
    openModal,
    logout
};

const mapState = (state) => ({
    auth: state.firebase.auth
});

class NavBar extends Component {

    handleSignIn = () => {
        this.props.openModal('LoginModal');
    };

    handleRegister = () => {
        this.props.openModal('RegisterModal');
    };

    handleSignOut = () => {
        this.props.firebase.logout();
        this.props.history.push('/');
    };

    render() {
        const {auth} = this.props;
        const authenticated = auth.isLoaded && !auth.isEmpty;

        let authenticatedMenu = '';

        if (authenticated) {
            authenticatedMenu =
                <AuxWrapper>
                    <Menu.Item as={NavLink} to='/people' name="People" />

                    <Menu.Item>
                        <Button as={Link} to='/createEvent' floated="right" positive inverted content="Create Event" />
                    </Menu.Item>
                </AuxWrapper>
        }
        return (
            <Menu inverted fixed="top">
                <Container>
                    <Menu.Item header as={Link} to='/'>
                        <img src="/assets/logo.png" alt="logo" />
                        Re-vents
                    </Menu.Item>
                    <Menu.Item as={NavLink} to='/events' name="Events" />
                    <Menu.Item as={NavLink} to='/test' name="Test" />
                    {authenticatedMenu}
                    {authenticated ?
                        <SignedInMenu auth={auth} signOut={this.handleSignOut}/>
                        :
                        <SignedOutMenu signIn={this.handleSignIn} register={this.handleRegister}/>}
                </Container>
            </Menu>
        );
    }
}

export default withRouter(withFirebase(connect(mapState, actions)(NavBar)));
