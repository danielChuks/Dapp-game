import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

//assiginin the stdlib.parseCurrency into the startingBalance
const startingBalance = stdlib.parseCurrency(100);

const accAlice = await stdlib.newTestAccount(startingBalance)
const accBob = await stdlib.newTestAccount(startingBalance);

const fmt = (x) => stdlib.formatCurrency(x,  4)
const getBalance = async (who) => fmt(await stdlib.balanceOf(who));
const beforeAlice = await(getBalance(accAlice))
const beforeBob = await(getBalance(accBob))

console.log('Welcome, Alice and Bob ');

  console.log('Launching game...');

  //this lines of code represent the indivitual contracts of the participant....
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

  //asgnining players
  const HAND = ['Rock', 'Paper', 'Scissors'];
  const OUTCOME = ['Bob Wins', 'Draw', 'Alice Win'];

const Player = (who) => ({
    ...stdlib.hasRandom,
      getHand: () => {
        const hand = Math.floor(Math.random() * HAND.length);
        console.log(`${who} chooses the hand: ${HAND [hand]}`);
        return hand;
      },

      seeOutcome: (outcome) => {
        console.log(`${who} saw outcome ${OUTCOME[outcome]}`)
       }
  });


  console.log('Starting backends...');

  await Promise.all([
    backend.Alice(ctcAlice, {
      ...Player('Alice'),
      wager: stdlib.parseCurrency(50)
    }),
    backend.Bob(ctcBob, {
      ...Player('Bob'),
     acceptWager: (amt) => {
       console.log(`Bob accepts the  wager of ${fmt(amt)}.`)}
    }),
  ]);

  const afterAlice = await getBalance(accAlice)
  const afterBob = await getBalance(accBob)


  console.log(`Alice went from ${beforeAlice} to ${afterAlice}`)
  console.log(`Bob went from ${beforeBob} to ${afterBob}`)

  console.log('Goodbye, Alice and Bob!');