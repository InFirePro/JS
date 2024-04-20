let userNumber = prompt("Введіть тризначне число");

if (!userNumber) {
  alert("Числа відсутні");
} else if (userNumber.length < 3) {
  alert("За мало введенно");
} else if (userNumber.length > 3) {
  alert("За багато введенно");
} else {
  let checkNumberСoincidence =
    userNumber[0] === userNumber[1] && userNumber[1] === userNumber[2];

  if (checkNumberСoincidence) {
    alert("Числа співпадають");
  } else {
    alert("Числа неспівпадають");

    let checkNumberMatching =
      userNumber[0] === userNumber[1] ||
      userNumber[1] === userNumber[2] ||
      userNumber[0] === userNumber[2];

    if (checkNumberMatching) {
      alert("Серед чисел є одне або два співпадіння");
    } else {
      alert("Серед чисел нема співпадіння");
    }
  }
}
