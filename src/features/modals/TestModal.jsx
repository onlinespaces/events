import React from 'react';
import { Modal } from 'semantic-ui-react';

const TestModal = () => {
    return (
        <Modal closeIcon='close' open={true}>
            <Modal.Header>Test Modal</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <p>This is a test modal. That is all!</p>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
};

export default TestModal;