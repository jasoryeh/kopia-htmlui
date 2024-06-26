import React, { Component, createRef } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { PolicyEditor } from '../components/policy-editor/PolicyEditor';
import { CLIEquivalent, GoBackButton, parseQuery, PolicyTypeName } from '../utils/uiutil';

export class Policy extends Component {
    constructor() {
        super();

        this.editorRef = createRef();
    }

    render() {
        const source = parseQuery(this.props.location.search);
        const { userName, host, path } = source;

        return <>
            <GoBackButton onClick={this.props.history.goBack} />
            <h4>
                Editing a Policy
            </h4>
            <p>
                {PolicyTypeName(source)}
            </p>
            <PolicyEditor ref={this.editorRef} userName={userName} host={host} path={path} close={this.props.history.goBack} />
            <Row><Col>&nbsp;</Col></Row>
            <Row>
                <Col xs={12}>
                    <CLIEquivalent command={`policy set "${userName}@${host}:${path}"`} />
                </Col>
            </Row>
        </>;
    }
}
