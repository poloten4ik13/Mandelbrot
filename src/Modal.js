import React from 'react';
import Modal from "react-bootstrap/Modal";
import {Button} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const MyVerticallyCenteredModal = (props) => {
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                   Zoom
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Click left button mouse on canvas for zoom in.</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MyVerticallyCenteredModal;





