import React, {useState} from "react";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ClaimFilter() {

    const [startDate, setStartDate] = useState(new Date());

    return (
        <Container>
            <Row>
                <Col offset={2} sm={8}>
                    <Form>
                        <Form.Row>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Ticket Status</Form.Label>
                                    <Form.Control as="select">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Claim Agent</Form.Label>
                                    <Form.Control as="select">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Form.Row>
                        <Row>
                            <Col>
                                <div><Form.Label>Start Date</Form.Label></div>
                                <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                            </Col>
                            <Col>
                                <div><Form.Label>End Date</Form.Label></div>
                                <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control placeholder="First name"/>
                            </Col>
                            <Col>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control placeholder="Last name"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Label>Min. Amount</Form.Label>
                                <Form.Control placeholder="Min. Amount"/>
                            </Col>
                            <Col>
                                <Form.Label>Max. Amount</Form.Label>
                                <Form.Control placeholder="Max. Amount"/>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Table heading</th>
                        <th>Table heading</th>
                        <th>Table heading</th>
                        <th>Table heading</th>
                        <th>Table heading</th>
                        <th>Table heading</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                        <td>Table cell</td>
                    </tr>
                    </tbody>
                </Table>
            </Row>
        </Container>


    );
}

export default ClaimFilter;