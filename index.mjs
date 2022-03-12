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
       },
       informTimeout: () => {
         console.log( `${who} observed a timeout`)
       }
  });


  console.log('Starting backends...');

  await Promise.all([
    backend.Alice(ctcAlice, {
      ...Player('Alice'),
      wager: stdlib.parseCurrency(50),
      deadline: 10
    }),
    backend.Bob(ctcBob, {
      ...Player('Bob'),
     acceptWager: async (amt) => {
       if(Math.random() <= 0.5){
         for(let i = 0; i <= 10; i ++){
           console.log(` Bob takes his time `)
           await stdlib.wait(1);
         }
       }else{ 
         console.log(`Bob accept the wager ${fmt(amt)}`)
       }
    }
    }),
  ]);

  const afterAlice = await getBalance(accAlice)
  const afterBob = await getBalance(accBob)


  console.log(`Alice went from ${beforeAlice} to ${afterAlice}`)
  console.log(`Bob went from ${beforeBob} to ${afterBob}`)

  console.log('Goodbye, Alice and Bob!');