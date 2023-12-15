# A step-by-step guide demonstrating how your code achieves the milestones.

The Frontend app is built with [Create React App](https://github.com/facebook/create-react-app)
and [Polkadot JS API](https://polkadot.js.org/docs/api/).

Bellow is step-by-step functionality for managing surveys, including creating surveys, funding them, registering participants, and rewarding participants. Let's break down each part:

## 1. **Create a Survey**

#### FRONTEND

```ts
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Create New Survey"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'survey',
              callable: 'createSurvey',
              inputParams: [surveyId, participantsLimit],
              paramFields: [true,true],
            }}
          />
        </Form.Field>
```


#### BACKEND / QSTN SURVEY PALLET

```rs
/// Create a new survey
///
/// - `survey_id`: The off-chain computed unique id of the survey
/// - `participants_limmit`: The max number of participants for this survey
///
/// REQUIRES: Survey must not have been created already
///
/// Emits `SurveyCreated`
```

- This code defines a function to create a new survey.
- It takes the `survey_id` (unique identifier) and `participants_limit` as parameters.
- The `REQUIRES` comments specify the conditions for executing the function.
- It emits an event `SurveyCreated` after successfully creating a survey.



## 2. **Funding a Survey**


#### FRONTEND

```ts
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
```


#### BACKEND / QSTN SURVEY PALLET

```rs
/// Fund an existing survey
///
/// - `survey_id`: the off-chain computed unique id of the survey
/// - `fund_amount`: the amount the owner is willing to fund the survey
///
/// REQUIRES: Survey has to be created already.
/// REQUIRES: Survey should not be already funded.
/// REQUIRES: Owner should have enough free balance.
/// REQUIRES: Can only be called by survey owner.
///
/// Emits `SurveyFunded`
```

- This code defines a function to fund an existing survey.
- It takes the `survey_id` and `fund_amount` as parameters.
- The `REQUIRES` comments specify the conditions for executing the function.
- It emits an event `SurveyFunded` after successfully funding the survey.

### 3. **Create and Funding a Survey**


#### FRONTEND

```ts
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Create and Fund New Survey"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'survey',
              callable: 'createAndFundSurvey',
              inputParams: [props.surveyId, participantsLimit, 100000000000],
              paramFields: [true,true],
            }}
          />
        </Form.Field>
```


#### BACKEND / QSTN SURVEY PALLET

```rs
/// Create a survey and fund it
///
/// - `survey_id`: the off-chain computed unique id of the survey
/// - `participants_limmit`: The max number of participants for this survey
/// - `fund_amount`: the amount the owner is willing to fund the survey
///
/// REQUIRES: Survey must not have been created already
/// REQUIRES: Survey has to be created already.
/// REQUIRES: Survey should not be already funded.
/// REQUIRES: Owner should have enough free balance.
/// REQUIRES: Can only be called by survey owner.
///
/// Emits `SurveyCreated`, `SurveyFunded`
```

- This code defines a function to create and fund a survey.
- It takes the same parameters as the previous two functions.
- The `REQUIRES` comments specify the conditions for executing the function.
- It emits both `SurveyCreated` and `SurveyFunded` events.

### 4. **Register New Survey Participation**


#### FRONTEND

```ts
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Register"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'survey',
              callable: 'registerParticipant',
              inputParams: [props.surveyId, addressTo],
              paramFields: [true,true],
            }}
          />
        </Form.Field>
```

#### BACKEND / QSTN SURVEY PALLET

```rs
/// Register the address of a participant who completed the survey
///
/// - `survey_id`: the off-chain computed unique id of the survey
/// - `participant_id`: the address of the participant
///
/// REQUIRES: Survey has to be created already.
/// REQUIRES: Can only be called by survey owner.
/// REQUIRES: Participant should not be already registered.
///
/// Emits `NewParticipantRegistered`
```

- This code defines a function to register a participant who completed the survey.
- It takes the `survey_id` and `participant_id` as parameters.
- The `REQUIRES` comments specify the conditions for executing the function.
- It emits the `NewParticipantRegistered` event.

### 5. **Reward a User Participant**


#### FRONTEND

```ts
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Reward"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'survey',
              callable: 'rewardParticipant',
              inputParams: [props.surveyId, addressTo],
              paramFields: [true,true],
            }}
          />
        </Form.Field>
```

#### BACKEND / QSTN SURVEY PALLET

```rs
/// Claim reward on behalf of participant and update its balance
///
/// - `survey_id`: the off-chain computed unique id of the survey
/// - `participant_id`: the address of the participant
///
/// REQUIRES: Survey has to be created already.
/// REQUIRES: Can only be called by survey owner.
/// REQUIRES: Participant should already be registered.
/// REQUIRES: Reward should not have already been claimed.
///
/// Emits `RewardClaimed`
```

- This code defines a function to claim a reward on behalf of a participant.
- It takes the `survey_id` and `participant_id` as parameters.
- The `REQUIRES` comments specify the conditions for executing the function.
- It emits the `RewardClaimed` event.


### 6. **Set the Status of a Survey**

#### FRONTEND

```ts
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Set the Status of a Survey"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'survey',
              callable: 'setSurveyStatus',
              inputParams: [surveyId, 'Paused'],
              paramFields: [true,true],
            }}
          />
        </Form.Field>
```


#### BACKEND / QSTN SURVEY PALLET

```rs
        /// Set the status of a survey
        ///
        /// - `survey_id`: the off-chain computed unique id of the survey
        /// - `status`: the survey status
        ///
        ///    pub enum Status {
        ///        Active,
        ///        Paused,
        ///        Completed,
        ///    }

        /// REQUIRES: Survey has to be created already.
        /// REQUIRES: Can only be called by survey owner.
        ///
        /// Emits `SurveyStatusUpdated`
```

These steps outline a comprehensive process for managing surveys, from creation and funding to participant registration and reward distribution. Each function has specific requirements and emits events for tracking the survey lifecycle.


## How to install, compile, run and test

### Clone the repo:

`git clone https://github.com/QSTN-US/Polkadot-QSTN-v1.git`

### Build the substrate node:
Go inside the directory

`cd qstn-substrate-node/substrate-node`

Build using cargo (this will take some time)

`cargo build --release`

### Start the node
Start the node while in the node repository with

`./target/release/node-template --dev`


### Build the front-end
On antother terminal go inside the front-end repository and install dependencies

`cd qstn-substrate-node/front-end`

`yarn`

Build the project

`yarn build`


### Start the frontend
Start the front-end in another terminal while in the front-end repository with

`yarn start`

This should open automatically the front-end in localhost on your browser.


# Documentation

Inline documentation is present in the pallet code. Every function is detailed. 

You should be able to see the docs with `cargo doc`