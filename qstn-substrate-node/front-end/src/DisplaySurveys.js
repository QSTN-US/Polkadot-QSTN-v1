import React, { useEffect, useState } from 'react'
// import { Form, Input, Grid, Card } from 'semantic-ui-react'
import { Grid, Table, TableRow, TableCell} from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
// import { TxButton } from './substrate-lib/components'
import FundSurveyButton from './FundSurveyButton'
import RegisterParticipantButton from './RegisterParticipantButton'
import RewardParticipantButton from './RewardParticipantButton'
import CreateSurveyButton from './CreateSurveyButton'

function Main(props) {
  const { api } = useSubstrateState()

  // The transaction submission status
//   const [status, setStatus] = useState('')

  // The currently stored value
  const [surveys, setSurveys] = useState({})
//   const [formValue, setFormValue] = useState([])

  useEffect(() => {
    // let unsubscribe
    for (let survey_id = 0; survey_id < 2; survey_id++){
        api.query.survey
            .surveysMap(survey_id,fetchedSurvey => {
                // The storage value is an Option<u32>
                // So we have to check whether it is None first
                // There is also unwrapOr
                if (!fetchedSurvey.isNone) {
                    var surveys_new = surveys
                    var unwrappedSurvey = fetchedSurvey.unwrap()
                    surveys_new[unwrappedSurvey.surveyId.toBigInt()] = unwrappedSurvey
                    setSurveys(surveys_new)
                }
            })
            .then(unsub => {
                // unsubscribe = unsub
            })
            .catch(console.error)
    }
  }, [api])

  return (
    <Grid.Column>
        {Object.entries(surveys).map((survey) => (
          <Table celled striped size="small">
            <Table.Body>
              <Table.Row>
                <Table.Cell width={4} textAlign="center">
                  <strong>Survey n°{JSON.stringify(survey[1].surveyId)}</strong>
                </Table.Cell>
              </Table.Row>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell textAlign="center">
                      {JSON.stringify(survey[1].status)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Owner</TableCell>
                <TableCell width={4}>{JSON.stringify(survey[1].ownerId)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Max Participants</TableCell>
                <TableCell>{JSON.stringify(survey[1].participantsLimit)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Number Participants</TableCell>
                <TableCell>{JSON.stringify(survey[1].numberParticipants)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Funded Amount </TableCell>
                <TableCell>
                  {
                    !survey[1].fundedAmount.isNone ? 
                      JSON.stringify(survey[1].fundedAmount) 
                      : 
                      <FundSurveyButton surveyId={survey[1].surveyId}></FundSurveyButton>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Reward Amount</TableCell>
                <TableCell>
                  {
                    !survey[1].rewardAmount.isNone ? 
                      JSON.stringify(survey[1].rewardAmount) 
                      : 
                      "Not Funded Yet"
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Register Participant</TableCell>
                <TableCell>
                      <RegisterParticipantButton surveyId={survey[1].surveyId}></RegisterParticipantButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Reward Participant</TableCell>
                <TableCell>
                      <RewardParticipantButton surveyId={survey[1].surveyId}></RewardParticipantButton>
                </TableCell>
              </TableRow>
              
            </Table.Body>
          </Table>
        ))}
        <Table celled striped size="small">
          <CreateSurveyButton></CreateSurveyButton>
        </Table>
    </Grid.Column>
  )
}

export default function DisplaySurveys(props) {
  const { api } = useSubstrateState()
  return api.query.survey && api.query.survey.surveysMap ? (
    <Main {...props} />
  ) : null
}
