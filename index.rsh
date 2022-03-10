'reach 0.1';

const Player = {
  getHand: Fun([],  UInt),

  seeOutCome: Fun([UInt], Null)
}

//the player function indicate that both alice and bob has the features off player ..i.e they both have get hand and seeOutCome..
export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...Player,
  });
  const Bob = Participant('Bob', {
    ...Player
  });

  init();

//Alice hand 
  Alice.only(() => {
    const handAlice = declassify(interact.getHand());
  });
  Alice.publish(handAlice);
  commit();


  Bob.only(() =>{
    const handBob = declassify(interact.getHand());
  });
  Bob.publish(handBob);
  const outCome = (handAlice + (4 - handBob)) % 3;
  commit();

exit();
});
