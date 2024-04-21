let userAge = prompt("Скільки тобі років?");
let userCity = prompt("В якому місті ти проживаєш?");
let userFavoriteSport = prompt("Який твій улюблений вид спорту");

const city = ["Київ", "Лондон", "Вашингтон"];
const country = ["Україна", "Велика Британія", "Америка"];

let isCapital = city.includes(userCity);

if (!isCapital) {
  alert(`Тобі ${userAge} років. Ти живеш в місті ${userCity}`);
} else {
  let index = city.indexOf(userCity);
  let capital = country[index];
  alert(`Тобі ${userAge} років. Ти живеш у столиці ${capital}`);
}
