import React, { useState } from 'react'
import { Form, Grid} from 'semantic-ui-react'
import { TxButton } from './substrate-lib/components'
import { useSubstrateState } from './substrate-lib'

export default function Main(props) {
  const [status, setStatus] = useState(null)


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
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Fund Survey with 100000000000"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'survey',
              callable: 'fundSurvey',
              inputParams: [props.surveyId, 100000000000],
              paramFields: [true, true],
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  )
}
