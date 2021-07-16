import React from "react";
import './AppTextbox.css'
import {Form} from "react-bootstrap";

class AppTextbox extends React.Component {

    render() {
        const {type, controlId, placeholder, value, disabled, onChange} = this.props;
        return (
            <Form.Group controlId={controlId} className="app-textbox" >
                <Form.Control type={type} placeholder={placeholder} value={value} disabled={disabled} onChange={onChange} {...this.props}/>
            </Form.Group>
        )
    }
}

export default AppTextbox;
