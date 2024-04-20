let userAge = prompt("Скільки тобі років?");
let userCity = prompt("В якому місті ти проживаєш?");
let userFavoriteSport = prompt("Який твій улюблений вид спорту");

const City = ["Київ", "Лондон", "Вашингтон"];
let cityСoincided =
  City[0] === userCity || City[1] === userCity || City[2] === userCity;
if (!cityСoincided) {
  alert(`Тобі ${userAge} років. Ти живеш в місті ${userCity}`);
} else {
  alert(`Тобі ${userAge} років. Ти живеш у столиці ${userCity}`);
}
