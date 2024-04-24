let userAge = prompt("Скільки тобі років?");
let userCity = prompt("В якому місті ти проживаєш?");
let userFavoriteSport = prompt("Який твій улюблений вид спорту");

let citylondon = "Лондон";
let cityUsa = "Америка";
let citykiev = "Київ";

if (citykiev == userCity) {
  alert(`Тобі ${userAge} років. Ти живеш у столиці Україна`);
} else if (citylondon == userCity) {
  alert(`Тобі ${userAge} років. Ти живеш в столиці Велика Британія`);
  12;
} else if (cityUsa == userCity) {
  alert(`Тобі ${userAge} років. Ти живеш в столиці Америка`);
} else {
  alert(`Тобі ${userAge} років. Ти живеш в місті ${userCity}`);
}
