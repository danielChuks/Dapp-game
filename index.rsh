'reach 0.1';

const Player = {
  getHand: Fun([],  UInt),

  seeOutCome: Fun([UInt], Null)
}
//the player function indicate that both alice and bob has the features off player ..i.e they both have get hand and seeOutCome..
export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...Player,
    wager: UInt,
  });
  const Bob = Participant('Bob', {
    ...Player,
    acceptWager: Fun([UInt], Null),
  });

  init();

//Alice hand 
  Alice.only(() => {
    const wager = declassify(interact.wager);
    const handAlice = declassify(interact.getHand());
  });
  Alice.publish(wager, handAlice).pay(wager);
  commit();


  Bob.only(() =>{
    interact.acceptWager(wager);
    const handBob = declassify(interact.getHand())
  });
  Bob.publish(handBob).pay(wager);

  const outcome = (handAlice + (4 - handBob)) % 3;
  const            [forAlice, forBob] =
    outcome == 2 ? [       2,      0] :
    outcome == 0 ? [       0,      2] :
    /* tie      */ [       1,      1];

    transfer(forAlice * wager).to(Alice);
    transfer(forBob   * wager).to(Bob);
  
  each([Alice, Bob], () =>{
    interact.seeOutCome(outcome);
  })

 
  commit();

exit();
});










