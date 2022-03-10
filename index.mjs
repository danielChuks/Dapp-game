import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

//assiginin the stdlib.parseCurrency into the startingBalance
const startingBalance = stdlib.parseCurrency(100);

const accAlice = await stdlib.newTestAccount(startingBalance)
const accBob = await stdlib.newTestAccount(startingBalance);
 
  console.log('Hello, Alice and Bob!');

  console.log('Launching...');

  //this lines of code represent the indivitual contracts of the participant....
  const ctcAlice = accAlice.contract(backend);
  const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

  //asgnining players
  const HAND = ['Rock', 'Paper', 'Scissors'];
  const OUTCOME = ['Bob Wins', 'Draw', 'Alice Win'];

  const Player = (who) => ({
      getHand: () => {
        const hand = Math.floor(Math.random() * HAND.length);
        console.log(`${who} chooses the hand: ${HAND [hand]}`);
        return hand;
      },

      seeOutCome: (outcome) => {
        console.log(`${who} saw outcome ${OUTCOME[outcome]}`)
       }
  });


  console.log('Starting backends...');

  await Promise.all([
    backend.Alice(ctcAlice, {
      ...Player('Alice'),
    }),
    backend.Bob(ctcBob, {
      ...Player('Bob'),
    }),
  ]);

  console.log('Goodbye, Alice and Bob!');