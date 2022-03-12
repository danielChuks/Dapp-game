'reach 0.1';

const [isHand, ROCK, PAPER, SCISSORS ]= makeEnum(3);
const [isOutCome, B_WINS, DRAW, A_WINS] = makeEnum(3);

const winner = (handAlice, handBob) =>
  ((handAlice + (4 - handBob)) % 3);

assert(winner(ROCK, PAPER) == B_WINS);
assert(winner(PAPER, ROCK) == A_WINS);
assert(winner(ROCK, ROCK) == DRAW);

forall(UInt, handAlice =>
  forall(UInt, handBob =>
    assert(isOutCome(winner(handAlice, handBob)))));

forall(UInt, (hand) =>
  assert(winner(hand, hand) == DRAW));

const Player = {
  ...hasRandom, 
  getHand: Fun([], UInt),
  seeOutcome: Fun([UInt], Null),
  informTimeout: Fun([], Null),
};
//the player function indicate that both alice and bob has the features off player ..i.e they both have get hand and seeOutCome..
export const main = Reach.App(() => {
  const Alice = Participant('Alice', {
    ...Player,
    wager: UInt,
    deadline: UInt,
  });
  const Bob = Participant('Bob', {
    ...Player,
    acceptWager: Fun([UInt], Null)
  });
  init();

// this function infrorms both paticiant of the timeoouut 
const informTimeout  = () => {
  each([Alice, Bob], () => {
    interact.informTimeout();
  });
};


Alice.only(() => {
  const wager = declassify(interact.wager);
  const deadline = declassify(interact.deadline);
});
Alice.publish(wager, deadline)
  .pay(wager);
commit();

Bob.only(() => {
  interact.acceptWager(wager);
});
Bob.pay(wager)
  .timeout(relativeTime(deadline), () => closeTo(Alice, informTimeout));
//the repeatable section of the application, where each party will repeatedly submit hands until the the outcome is not a draw. 
var outcome = DRAW;
invariant( balance() == 2 * wager && isOutCome(outcome) );
while ( outcome == DRAW ) {
  commit();

//Alice hand 
Alice.only(() => {
  const _handAlice = interact.getHand();
  const [_commitAlice, _saltAlice] = makeCommitment(interact, _handAlice);
  const commitAlice = declassify(_commitAlice);
});

Alice.publish(commitAlice)
.timeout(relativeTime(deadline), () => closeTo(Bob, informTimeout));
commit();

unknowable(Bob, Alice(_handAlice, _saltAlice));
Bob.only(() => {
  const handBob = declassify(interact.getHand());
});
Bob.publish(handBob)
  .timeout(relativeTime(deadline), () => closeTo(Alice, informTimeout));
commit();

Alice.only(() => {
  const saltAlice = declassify(_saltAlice);
  const handAlice = declassify(_handAlice);
});
Alice.publish(saltAlice, handAlice)
  .timeout(relativeTime(deadline), () => closeTo(Bob, informTimeout));
checkCommitment(commitAlice, saltAlice, handAlice);

outcome = winner(handAlice, handBob);
continue;
}


assert(outcome == A_WINS || outcome == B_WINS);
transfer(2 * wager).to(outcome == A_WINS ? Alice : Bob);
commit();

each([Alice, Bob], () => {
  interact.seeOutcome(outcome);
});

exit();
});









