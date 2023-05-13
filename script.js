'use strict';

/////////////////////////////////////////////////
// BANK APP

// **********************************  Data  **********************************************************

const account1 = {
  owner: 'Mahendra Singh Dhoni',
  movements: [200, 455.23, -306.5, 2500, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-17T18:30:00.000Z',
    '2022-12-22T18:30:00.000Z',
    '2022-12-27T18:30:00.000Z',
    '2023-01-09T18:30:00.000Z',
    '2023-02-08T18:30:00.000Z',
    '2023-04-27T18:30:00.000Z',
    '2023-05-09T18:30:00.000Z',
    '2023-05-11T18:30:00.000Z',
  ],
  currency: 'INR',
  locale: 'en-IN',
};

const account2 = {
  owner: 'Ana De Armas',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-02-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-05-09T18:49:59.371Z',
    '2023-05-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];




// *************************************  Elements  **************************************************************
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



// ******************************* FUNCTIONS *************************************************
 


// Function for displaying fund movement with dates
const displayMovements = (acc, sort = false) => {

  containerMovements.innerHTML = '';
    
  // Sorting logic
  
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;  // a-b for ascending order; b-a for ascending order


  movs.forEach((move, i) => {

  const type = move > 0 ? 'deposit' : 'withdrawal';


  //Looping over movementDates array using the index of movs array
  const date = new Date(acc.movementsDates[i]);

  
  const html = `
  <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__date">${formatMovementDates(date, acc.locale)}</div>
        <div class="movements__value">${formatCurrency(acc, move)}</div>
  </div>
  `; 
  containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  };


// Function for creating usernames 
const createUsernames = (account) => {
  account.forEach((val) => {
      val.userName = val.owner.toLowerCase().split(' ').map((name) => name[0]).join('');
  
  });
  };
  createUsernames(accounts);
  
  


// Function to calculate and display the balance 
  const calcPrintBalance = (account) => {
      account.balance = account.movements.reduce((a, e)=> a+e, 0);
  
      labelBalance.textContent = formatCurrency(account, account.balance);
  };
  


// Function to display money in, out and interest offered by bank
const calcPrintSummary = (account) => {
  const sumIn = account.movements.filter(e => e > 0).reduce((acc, e) => acc +e, 0);
  const sumOut = account.movements.filter(e => e < 0).reduce((acc, e) => acc + Math.abs(e), 0);
  const sumInterest = account.movements.filter(e => e > 0).map(e => e * account.interestRate / 100).filter(e => e >= 1).reduce((acc, e) => acc + e , 0);
  
  labelSumIn.textContent = formatCurrency(account, sumIn);
  labelSumOut.textContent = formatCurrency(account, sumOut);
  labelSumInterest.textContent = formatCurrency(account, sumInterest);
  };
  


// Function to update UI
  
  const updateUI = (acc) => {
       //Display Movements
       displayMovements(acc);
  
       //Display balance
       calcPrintBalance(acc);
   
       //Display Summary
       calcPrintSummary(acc);
  };




// Function to format movementDates
const formatMovementDates = (date, locale) => {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDaysPassed(new Date(), date);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  };
  
};


// Function to format currency

const formatCurrency = (account, value) => {
  return new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(value);
};



// Function for logout timer

const startLogoutTimer = () => {

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0
    };

    time--;
  };

  let time = 300;

  tick();

  const timer = setInterval(tick, 1000);

  return timer;
};



// ****************************************** EVENT HANDLERS ************************************************

let currentAccount, timer;


//Login button

btnLogin.addEventListener('click', function (e){
  e.preventDefault();
 
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  
  if (currentAccount?.pin === Number(inputLoginPin.value)) {

    //Clearing input fields
    inputLoginUsername.value = inputLoginPin.value = '';
  
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back , ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //Displaying current date

    const now = new Date ();
  
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, 
      {
         minute: 'numeric',
         hour: 'numeric',
         day: 'numeric',
         month: 'long',
         year: 'numeric',
         weekday: 'short'
        }
    ).format(now);
   
    updateUI(currentAccount);
  }
  else {
    labelWelcome.textContent = `Wrong credentials ❌`
    setTimeout(() => labelWelcome.textContent = 'Log in to get started', 3000);
    containerApp.style.opacity = 0;
  };

  if(timer) clearInterval(timer)
  timer = startLogoutTimer();
});



// Transfer button

btnTransfer.addEventListener('click', function (e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find((acc) => acc.userName === inputTransferTo.value);

  if (amount > 0 && receiverAccount && amount <= currentAccount.balance && receiverAccount.userName !== currentAccount.userName) {
  
    // Adding transfer amount to both user and receiver accounts
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);


    // Adding transfer dates to both user and reciever accounts

    currentAccount.movementsDates.push(new Date ().toISOString()); 
    receiverAccount.movementsDates.push(new Date ().toISOString());    

    inputTransferAmount.value = inputTransferTo.value = '';


    // Updating UI
    setTimeout(() => updateUI(currentAccount), 1500);

    // Resetting the timer
    clearInterval(timer);
    timer = startLogoutTimer ();
    
  };
});



// Request loan button 

btnLoan.addEventListener('click', function (e){
  e.preventDefault();
  const loanAmt = Math.floor (inputLoanAmount.value);

  // Approve loan only if 1 transaction greater then the 10 % of requested amount
  if (loanAmt > 0 && currentAccount.movements.some(mov => mov >= 10/100 * loanAmt)) {

    //Updating loan amount to account movements
    currentAccount.movements.push(loanAmt);

    //Updating loan date to account movementDates

    currentAccount.movementsDates.push(new Date ().toISOString())

    //Updating the UI
    setTimeout(() => updateUI(currentAccount), 1500);

    // Resetting loan input
    inputLoanAmount.value = '';

    // Resetting the timer
     clearInterval(timer);
     timer = startLogoutTimer ();
  };
});



// Close account button

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const inputUser = inputCloseUsername.value;
  const inputPin = Number(inputClosePin.value);

  // Resetting values
  inputClosePin.value = inputCloseUsername.value = '';

  // Condition for log out
  if (inputUser === currentAccount.userName && inputPin === currentAccount.pin) {

    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);

    // Deleting the account
    accounts.splice(index, 1);

    // Resetting the UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  };

});

// Sort Button

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////






