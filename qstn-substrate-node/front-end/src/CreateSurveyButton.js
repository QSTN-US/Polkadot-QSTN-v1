import React, { useState } from 'react'
import { Form, Grid, Input } from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'

export default function Main(props) {
  const [status, setStatus] = useState(null)
  const [formState, setFormState] = useState({ surveyId: '', ownerId:'', amount: 0 })

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }))

  const { surveyId, ownerId, participantsLimit } = formState

  const { keyring } = useSubstrateState()
  const accounts = keyring.getPairs()

  const availableAccounts = []
  accounts.map(account => {
    return availableAccounts.push({
      key: account.meta.name,
      text: account.meta.name,
      value: account.address,
    })
  })

  return (
    <Grid.Column width={8}>
      <Form>
        <Form.Field>
          <Input
            fluid
            label="To"
            type="text"
            placeholder="Survey Id"
            value={surveyId}
            state="surveyId"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="To"
            type="text"
            placeholder="Owner Id"
            value={ownerId}
            state="ownerId"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label="To"
            type="text"
            placeholder="Participants Limit"
            value={participantsLimit}
            state="participantsLimit"
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Create New Survey"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'survey',
              callable: 'createSurvey',
              inputParams: [surveyId, ownerId, participantsLimit],
              paramFields: [true,true,true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
