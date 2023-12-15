# Pallet Survey Functionnality for QSTN

Monorepo for QSTN survey pallet implementation containing the [substrate node](https://github.com/QSTN-labs/milestone1-qstnsubstrate/tree/main/substrate-node), the [pallet code](https://github.com/QSTN-labs/milestone1-qstnsubstrate/tree/main/substrate-node/pallets/survey) and the [frontend](https://github.com/QSTN-labs/milestone1-qstnsubstrate/tree/main/front-end).

Check the demo video of the whole project [HERE](https://youtu.be/L5tZQTLslFo).

# Run demo app

## Clone the repo:

`git clone https://github.com/benjaminsalon/monorepo_qstn_pallet_survey.git`

## Build the substrate node:
Go inside the directory

`cd monorepo_qstn_pallet_survey`

Build using cargo (this will take some time)

`cargo build --release`

## Build the front-end
On antother terminal go inside the front-end repository and install dependencies

`yarn`

Build the project

`yarn build`

## Start the node
Start the node while in the node repository with

`./target/release/node-template --dev`

## Start the frontend
Start the front-end in another terminal while in the front-end repository with

`yarn start`

This should open automatically the front-end in localhost on your browser.

# Documentation

Inline documentation is present in the pallet code. Every function is detailed. 

You should be able to see the docs with `cargo doc`