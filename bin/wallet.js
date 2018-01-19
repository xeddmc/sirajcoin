#!/usr/bin/env node

let { createHash } = require('crypto')
let coins = require('coins')
let secp = require('secp256k1')
let fs = require('fs')
let Wallet = require('../client/wallet-methods.js')
let argv = process.argv.slice(2)
let { connect } = require('lotion')

async function main() {
  let genesis = require('../genesis.json')
  console.log(genesis)
  let client = await connect(null, { genesis })
  let privkeyContents = fs.readFileSync('privkey.json', 'utf8')
  let wallet = Wallet(JSON.parse(privkeyContents).priv_key.data)
  if (argv.length === 3) {
    let recipientAddress = argv[1]
    let amountToSend = Number(argv[2])

    wallet
      .send(recipientAddress, amountToSend)
      .then(function(res) {
        console.log('done', res.data.result)
      })
      .catch(err => console.error(err.stack))
  }

  // get balance
  if (argv.length === 1 && argv[0] === 'balance') {
    wallet.getBalance().then(balance => {
      console.log('your address: ' + wallet.address)
      console.log('your balance: ' + balance)
    })
  }
}

main()