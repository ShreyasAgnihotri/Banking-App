'use strict';
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, 
  pin: 1111,
  username: 'js',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  username: 'jd',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  username: 'stw',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  username: 'ss',
};

let accounts = [account1, account2, account3, account4];
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const header = document.getElementById('h02')
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const loginContainer = document.querySelector('.container');

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

const displayMovements = function(movements){
  containerMovements.innerHTML = '';
  movements.forEach(function (mov,i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__value">${Math.abs(mov)}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html)
    const now = new Date();
    const date = `${now.getDate()}`.padStart(2,0)
    const month = `${now.getMonth() + 1}`.padStart(2,0)
    const year = now.getFullYear()
    const hour = now.getHours()
    const minute = now.getMinutes()
    labelDate.textContent = `${date}/${month}/${year}, ${hour}: ${minute}`
  });
}
const balance = function (account){
    const balance = account.movements.reduce((acc,cur) => acc+cur,0)
      labelBalance.textContent = `Rs ${balance}`;
    const Intr = balance * (account.interestRate)/100;
    labelSumInterest.textContent = `Rs ${Intr}`;
}
const summary = function (movement) {
  let In = movement.filter((function (mov){
      return mov>0;}))
  const Insum = In.reduce((prev,curr) => prev+curr,0)
    labelSumIn.textContent = `Rs ${Insum}`;
  let Out = movement.filter((function (mov) {
    return mov<0;
  }))
  const OutSum = Out.reduce((prev,curr) => prev+curr,0)
  labelSumOut.textContent = `Rs ${Math.abs(OutSum)}`
}   
function replaceClass(name, oldClass, newClass) {
  var elem = document.getElementById(name);
  elem.classList.remove(oldClass);
  elem.classList.add(newClass);
} 
btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  let currentAccount = accounts.find(acc=>acc.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`;
    header.innerHTML= `Hello , ${currentAccount.owner.split(' ')[0]}`
    header.style.opacity = 100;
    loginContainer.style.opacity = 0
    loginContainer.style.height = 0
    containerApp.style.opacity = 100
    inputLoginUsername.value = inputLoginPin.value = "";
    inputTransferAmount.value = inputTransferTo.value = "";
    displayMovements(currentAccount.movements);
    balance(currentAccount)
    summary(currentAccount.movements)
    btnTransfer.addEventListener('click', function(e){
      e.preventDefault();
      let acc_username = inputTransferTo.value;
      let transfer_acc = accounts.find(acc=>acc.owner === acc_username)
      let transfer_amt = inputTransferAmount.value;
      if(transfer_acc){
        transfer_acc.movements.push(parseInt(transfer_amt))
        currentAccount.movements.push(-transfer_amt)
        displayMovements(currentAccount.movements)
        balance(currentAccount)
        summary(currentAccount.movements)
        inputTransferAmount.value = inputTransferTo.value = "";
        inputLoanAmount.value = "";
      }
      else{
        alert("Incorrect Credentials")
        inputTransferAmount.value = inputTransferTo.value = "";
      }
    })
    btnLoan.addEventListener('click',function(e){
      e.preventDefault();
      let loan_amt = inputLoanAmount.value;
      currentAccount.movements.push(parseInt(loan_amt))
      displayMovements(currentAccount.movements)
      balance(currentAccount)
      summary(currentAccount.movements)
      inputLoanAmount.value = "";
    })
    btnClose.addEventListener('click',function(e){
      e.preventDefault()
      let choice = confirm("Do You want to Delete the account?")
      if (choice == true){
        let currentAccount = accounts.find(acc=>acc.username === inputCloseUsername.value);
        if (currentAccount?.pin === Number(inputClosePin.value)){
          console.log("Hello")
          accounts = accounts.filter(function(item){
            return item!= currentAccount
          })
        containerApp.style.opacity = 0
        labelWelcome.textContent = "Login to get started";
        header.innerHTML= "Welcome, Login to Continue!"
        console.log(accounts)
        }
      }
    })
    btnSort.addEventListener('click', function(e) {
      currentAccount.movements.sort( (a,b) => a-b);
      displayMovements(currentAccount.movements)
    })
    const now = new Date();
    const date = `${now.getDate()}`.padStart(2,0)
    const month = `${now.getMonth() + 1}`.padStart(2,0)
    const year = now.getFullYear()
    const hour = now.getHours()
    const minute = now.getMinutes()
    labelDate.textContent = `${date}/${month}/${year}, ${hour}: ${minute}`
    const tick = function () {
      const min = String(Math.trunc(time/60)).padStart(2,0)
      const sec = String(time%60).padStart(2,0)
      labelTimer.textContent = `${min}:${sec}`
      if(time===0){
        clearInterval(timer)
        alert("You are Logged Out!")
        containerApp.style.opacity = 0
        labelWelcome.textContent = "Login to get started";
        header.innerHTML= "Welcome, Login to Continue!"
    }
    time--;
  }
  let time = 300
  const timer = setInterval(tick,1000)   
  }
  else{
    alert("Incorrect Credentials!")
  }
})
