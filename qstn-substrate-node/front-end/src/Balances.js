import React, { useEffect, useState } from 'react'
import { Table, Grid, Button, Label } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useSubstrateState } from './substrate-lib'
import FundButton from './FundButton'

export default function Main(props) {
  const { api, keyring } = useSubstrateState()
  const allAccounts = keyring.getPairs()
  
  // Taking only the addresses provided by the wallet
  const accounts = allAccounts.slice(8,allAccounts.length)

  const [balances, setBalances] = useState({})

  useEffect(() => {
    const addresses = accounts.map(account => account.address)
    let unsubscribeAll = null

    api.query.system.account
      .multi(addresses, balances => {
        const balancesMap = addresses.reduce(
          (acc, address, index) => ({
            ...acc,
            [address]: balances[index].data.free.toHuman(),
          }),
          {}
        )
        setBalances(balancesMap)
      })
      .then(unsub => {
        unsubscribeAll = unsub
      })
      .catch(console.error)

    return () => unsubscribeAll && unsubscribeAll()
  }, [api, keyring, setBalances])

  return (
    <Grid.Column>
      <h1>Balances</h1>
      {accounts.length === 0 ? (
        <Label basic color="yellow">
          No accounts to be shown
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3} textAlign="right">
                <strong>Name</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>Address</strong>
              </Table.Cell>
              <Table.Cell width={3}>
                <strong>Balance</strong>
              </Table.Cell>
            </Table.Row>
            {accounts.map(account => (
              <Table.Row key={account.address}>
                <Table.Cell width={3} textAlign="right">
                  {account.meta.name}
                </Table.Cell>
                <Table.Cell width={10}>
                  <span style={{ display: 'inline-block', minWidth: '31em' }}>
                    {account.address}
                  </span>
                  <CopyToClipboard text={account.address}>
                    <Button
                      basic
                      circular
                      compact
                      size="mini"
                      color="blue"
                      icon="copy outline"
                    />
                  </CopyToClipboard>
                </Table.Cell>
                <Table.Cell width={3}>
                  {balances &&
                    balances[account.address] &&
                    balances[account.address]}
                </Table.Cell>
                {balances &&
                    balances[account.address] && balances[account.address] == 0 ?
                      <Table.Cell width={2}>
                        <FundButton addressTo={account.address}></FundButton>
                      </Table.Cell>
                      : ""
                }
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
  )
}
