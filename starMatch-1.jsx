// STAR MATCH - V6

const StarsDisplay = props => (
  <>
    {utils.range(1, props.count).map(starId => (
      <div key={starId} className="star" />
    ))}
  </>
);

const PlayNumber = props => (
  <button
    className="number"
    style={{backgroundColor: colors[props.status]}}
    onClick={() => props.onClick(props.number, props.status)}
  >
    {props.number}
  </button>
);

const PlayAgain = props => (
	<div className="game-done">
    <div className="message"
      style ={{color: props.gameStatus === 'lost' ? 'red':'green'}}
      >
      {props.gameStatus === 'lost' ? 'Game Over': 'Nice'}
    </div>
	  <button onClick={props.onClick}>Play Again</button>
	</div>
);

const StarMatch = () => {
  //setting up the state 
  const [stars, setStars] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(10);
//in JS we need to set a setInterval or setTimeout to do a countdown.
// we can take advantage fo the StarMatch function being called when the game is reset. 
//In order for this countdown timer to work properly we need to have an end to the loop. We also need to cleen up after the effect happens.
  useEffect(() => {
  //This block of code runs each time a button is pressed
    if(secondsLeft > 0 && availableNums.length > 0) { 
      const timerId = setTimeout(() => {
            setSecondsLeft(secondsLeft -1);
          },1000);
          return () => clearTimeout(timerId);
        }
   
  //The return statement happens when the component is changing 
    
      });

  const candidatesAreWrong = utils.sum(candidateNums) > stars;
  // This commented code below gives us 2 separate conditions of the game.  This can be combined into one statement. 
  // const gameIsWon = availableNums.length === 0;
  // const gameIsLost = secondsLeft === 0;
  
  const gameStatus = availableNums.length === 0 
  ? 'won'
  : secondsLeft === 0 ? 'lost'  : 'active'
  
  const resetGame = () => {
  	setStars(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
    setCandidateNums([]);
  };

  const numberStatus = number => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };

  const onNumberClick = (number, currentStatus) => {
    if (gameStatus !== 'active' || currentStatus === 'used') {
      return;
    }

		const newCandidateNums =
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);

    if (utils.sum(newCandidateNums) !== stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active'? (
          	<PlayAgain onClick={resetGame} gameStatus={gameStatus} />
          ) : (
          	<StarsDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(number => (
            <PlayNumber
              key={number}
              status={numberStatus(number)}
              number={number}
              onClick={onNumberClick}
            />
          ))}
        </div>
      </div>
    <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

// Color Theme
const colors = {
  available: 'gray',
  used: 'green',
  wrong: 'red',
  candidate: 'blue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({length: max - min + 1}, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

ReactDOM.render(<StarMatch />, mountNode);	