import React from 'react';
import Row from 'react-bootstrap/Row';
import { LabelColumn } from './LabelColumn';
import { ValueColumn } from './ValueColumn';
import { EffectiveValueColumn } from './EffectiveValueColumn';
import i18n from '../../utils/i18n';

export function SectionHeaderRow() {
    return <Row>
        <LabelColumn />
        <ValueColumn>
            <div className="policyEditorHeader">{i18n.t('feedback.header.defined')}</div>
            <hr className="mt-1" />
        </ValueColumn>
        <EffectiveValueColumn>
            <div className="policyEditorHeader">{i18n.t('feedback.header.effective')}</div>
            <hr className="mt-1"/>
        </EffectiveValueColumn>
    </Row>;
}
