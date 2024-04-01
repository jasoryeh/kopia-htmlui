
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import KopiaTable from '../utils/KopiaTable';
import { Link } from 'react-router-dom';
import { redirect, taskStatusSymbol } from '../utils/uiutil';
import {faEye} from "@fortawesome/free-regular-svg-icons/faEye";
import { useTranslation } from "react-i18next";
import { useState, useLayoutEffect, useCallback } from 'react';

export function Tasks() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchDescription, setDescription] = useState("")
    const [response, setResponse] = useState({ items: [], kinds: [] });
    const [kind, setKind] = useState("All");
    const [status, setStatus] = useState("All");
    const [error, setError] = useState();
    const { t } = useTranslation();

    const fetchTasks = useCallback(() => {
        axios.get('/api/v1/tasks').then(result => {
            setIsLoading(false);
            setResponse({ items: result.data.tasks, kinds: getUniqueKinds(result.data.tasks) });
        }).catch(error => {
            redirect(error);
            setError(error);
            setIsLoading(false);
        });
    }, [])

    useLayoutEffect(() => {
        setIsLoading(true)
        fetchTasks()
        let interval = setInterval(fetchTasks, 5000)
        return () => {
            window.clearInterval(interval);
        };
    }, [fetchTasks]);

    function getUniqueKinds(tasks) {
        let o = {};

        for (const tsk of tasks) {
            o[tsk.kind] = true;
        }

        let result = [];
        for (const kind in o) {
            result.push(kind);
        }

        return result;
    }

    function handleDescription(desc) {
        setDescription(desc.target.value)
    }

    function taskMatches(t) {
        if (kind !== "All" && t.kind !== kind) {
            return false;
        }

        if (status !== "All" && t.status.toLowerCase() !== status.toLowerCase()) {
            return false;
        }

        if (searchDescription && t.description.indexOf(searchDescription) < 0) {
            return false;
        }

        return true
    }

    function filterItems(items) {
        return items.filter(c => taskMatches(c))
    }

    if (error) {
        return <p>{error.message}</p>;
    }
    if (isLoading) {
        return <p>{t('task.loading')}</p>;
    }

    const columns = [
    {
        Header: t('task.header.time.start'),
        width: 160,
        accessor: x => <small>{moment(x.startTime).fromNow()}</small>
    }, {
        Header: t('task.header.status'),
            width: 240,
                accessor: x => <small>{taskStatusSymbol(x)}</small>,
    }, {
        Header: t('task.header.kind'),
        width: "",
        accessor: x => <small>{x.kind}</small>,
    }, {
        Header: t('task.header.description'),
        width: "",
        accessor: x => <small>{x.description}</small>,
    }, {
        Header: "View",
        width: 50,
        accessor: x => <Link to={'/tasks/' + x.id} title={moment(x.startTime).toLocaleString()}>
            <FontAwesomeIcon icon={faEye} />
        </Link>
    }]

    const filteredItems = filterItems(response.items)
    return (
        <>
            <Form>
                <div className="list-actions">
                    <Row>
                        <Col xs="auto">
                            <Dropdown>
                                <Dropdown.Toggle size="sm" variant="primary">{t('task.header.status')}: {status}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setStatus("All")}>{t('task.all')}</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => setStatus("Success")}>{t('task.success')}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setStatus("Running")}>{t('task.running')}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setStatus("Failed")}>{t('task.failed')}</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setStatus("Canceled")}>{t('task.canceled')}</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col xs="auto">
                            <Dropdown>
                                <Dropdown.Toggle size="sm" variant="primary">{t('task.header.kind')}: {kind}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setKind("All")}>{t('task.all')}</Dropdown.Item>
                                    <Dropdown.Divider style={{
                                        display: response.kinds.length > 0 ? "" : "none"
                                    }}/>
                                    {response.kinds.map(kind => <Dropdown.Item key={kind} onClick={() => setKind(kind)}>{kind}</Dropdown.Item>)}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col xs="4">
                            <Form.Control size="sm" type="text" name="searchDescription" placeholder={t('task.feedback.search')} value={searchDescription} onChange={handleDescription} autoFocus={true} />
                        </Col>
                    </Row>
                </div>
                <Row>
                    <Col>
                        {!response.items.length ?
                            <Alert variant="info">
                                <FontAwesomeIcon size="sm" icon={faInfoCircle} /> {t('task.feedback.entries')}
                            </Alert> : <KopiaTable data={filteredItems} columns={columns} />}
                    </Col>
                </Row>
            </Form>
        </>);
}
