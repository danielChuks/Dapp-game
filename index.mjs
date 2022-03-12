import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib(process.env);

//assiginin the stdlib.parseCurrency into the startingBalance
const startingBalance = stdlib.parseCurrency(100);

const accAlice = await stdlib.newTestAccount(startingBalance)
const accBob = await stdlib.newTestAccount(startingBalance);


//x  here format the value  of the currency to a 4  decemal.
//getBalance to the value of individual  players assigning fmt function to the balance of the players
const fmt = (x) => stdlib.formatCurrency(x,  4)
const getBalance = async (who) => fmt(await stdlib.balanceOf(who));

//beforeAlice is a variable that awaits the getBalance function of accAlice and Bob before they stat playing.
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

  //The player method in referenced in front end to get the hand of both Alice  and Bod. this include their individual hands
const Player = (who) => ({
    ...stdlib.hasRandom,
      getHand: () => {
        const hand = Math.floor(Math.random() * HAND.length);
        console.log(`${who} chooses the hand: ${HAND [hand]}`);
        return hand;
      },
//here we declaring a function that will reference the possible  outcome of both alice  and bob including a time out should there bee a  timeout in the wager published  by Alice.
      seeOutcome: (outcome) => {
        console.log(`${who} saw outcome ${OUTCOME[outcome]}`)
       },
       informTimeout: () => {
         console.log( `${who} observed a timeout`)
       }
  });


  console.log('Starting backends...');

  //deadline indecate the time limit before there is a time out.
  await Promise.all([
    backend.Alice(ctcAlice, {
      ...Player('Alice'),
      wager: stdlib.parseCurrency(50),
      deadline: 10
    }),
    //acceptWager take an async funtion that await the amt and check for a timeout with a for loop
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