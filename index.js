import fs from "fs";
import PromptSync from "prompt-sync";
import Person from "./person.js";
import Hobbies from "./hobbies.js";

const prompt = PromptSync({ sigint: true });
const personsList = JSON.parse(fs.readFileSync("persons.json"));

let run = true;
while (run) {
  console.log(`Meny

1. Skapa en ny person
2. Skriv ut alla personer
3. Redigera en person
Q. Avsluta programmet
`);
  const choice = prompt("-> ").trim().toUpperCase();

  switch (choice) {
    case "1":
      console.clear();
      createOrEditPerson();
      break;

    case "2":
      console.clear();
      if (personsList.length > 0) {
        printAllPersons();
      } else {
        console.log("Finns inga personer i listan\n");
      }
      break;

    case "3":
      console.clear();
      if (personsList.length > 0) {
        editMenu();
      } else {
        console.log("Finns inga personer i listan\n");
      }
      break;

    case "Q":
      run = false;
      break;
    default:
      console.clear();
      console.log("Du måste välja mellan 1 - 3 eller Q.\n");
      break;
  }
}

function printAllPersons() {
  const maxId = 4;
  const maxName = 20;
  const maxAge = 6;
  const maxhobbies = 30;

  const headline = ` ${addWhiteSpace("Id", maxId)}| ${addWhiteSpace("Namn", maxName)}| ${addWhiteSpace("Ålder", maxAge)}| ${addWhiteSpace("Hobby", maxhobbies)}`;

  console.log(`${headline}
${"-".repeat(headline.length)}`);

  for (let i = 0; i < personsList.length; i++) {
    console.log(` ${addWhiteSpace((i + 1).toString(), maxId)}| ${addWhiteSpace(personsList[i].firstName + " " + personsList[i].lastName, maxName)}| ${addWhiteSpace(personsList[i].age, maxAge)}| ${addWhiteSpace(personsList[i].hobbies, maxhobbies)}`);
    if (i % 3 === 2) {
      console.log("-".repeat(headline.length));
    }
  }
  console.log("\n");
}

function createOrEditPerson(index = -1) {
  let firstName = "";
  let lastName = "";
  let age = "";
  let hobbies = [];
  let menuText = "Meny - Skapa Person\n";

  if (index >= 0) {
    menuText = "Meny - Redigera Person\n";
    firstName = personsList[index].firstName
    lastName = personsList[index].lastName
    age = personsList[index].age
    hobbies = personsList[index].hobbies
  }

  let run = true;
  while (run) {
    console.log(`${menuText}

1. Förnamn   -> ${firstName}
2. Efternamn -> ${lastName}
3. Ålder     -> ${age}
4. Hobby    -> ${hobbies}

S. Spara
B. Gå tillbaka till meny
  `);

    const choice = prompt().trim().toUpperCase()

    switch (choice) {
      case "1":
        firstName = prompt("Förnman -> ");
        console.clear()
        break;

      case "2":
        lastName = prompt("Efternamn -> ");
        console.clear()
        break;

      case "3":
        age = prompt("Ålder -> ");
        console.clear()
        break;

      case "4":
        console.clear()
        hobbies = pickHobbies(hobbies);
        break;

      case "S":
        if (index >= 0) {
          personsList[index].firstName = firstName;
          personsList[index].lastName = lastName;
          personsList[index].age = age;
          personsList[index].hobbies = hobbies;
        } else {
          personsList.push(new Person(firstName, lastName, age, hobbies));
        }
        updateFile();
        run = false;
        break;

      case "B":
        run = false;
        break;
      default:
        console.clear();
        console.log("Du måste välja mellan 1 - 4, S eller B.\n");
        break;
    }
  }
  console.clear();
}

function pickHobbies(personsHobbies = []) {
  let hobbies;

  if (personsHobbies.length > 0) {
    hobbies = new Hobbies(personsHobbies);
  } else {
    hobbies = new Hobbies();
  }

  console.log("Before - ", hobbies.list);
  let run = true;
  while (run) {
    if (personsHobbies.length > 0) {
      console.log("Meny - Redigera Person - Hobby\n");
    } else {
      console.log("Meny - Skapa Person - Hobby\n");
    }
    hobbies.printList();
    console.log(`
L. Lägg till ny hobby
B. Gå tillbaka
`);
    const choice = prompt("-> ").trim().toUpperCase()

    if (choice === "L") {
      console.log("Skriv namnet för den nya hobbyn, mellan 3 - 25 symboler");
      hobbies.addHobbieToList(prompt("Namn -> ").trim())
      console.clear();
    } else if (choice === "B") {
      run = false;
    } else if (Number(choice) !== NaN) {
      console.clear();
      if (Number(choice) > hobbies.listLength()) {
        console.log(`Finns ingen hobby med index ${Number(choice)}\n`)
      } else {
        hobbies.pickHobbie(Number(choice) - 1);
      }
    } else {
      console.clear();
      if (hobbies.listLength() === 0) {
        console.log("Du måste välja mellan L eller B.\n");
      } else if (hobbies.listLength() === 1) {
        console.log("Du måste välja mellan 1, L eller B.\n");
      } else {
        console.log(`Du måste välja mellan 1 - ${hobbies.listLength()}, L eller B.\n`);
      }
    }
  }
  console.clear();

  console.log("After - ", hobbies.list);
  return hobbies.listOfPickedHobbies();
}

function editMenu() {
  let run = true;
  while (run) {
    console.log("Meny - Redigera Personer");
    printAllPersons()
    console.log(`
B. Gå tillbaka
`);
    const choice = prompt("-> ").trim().toUpperCase();

    if (choice === "B") {
      run = false;
    } else if (Number(choice) !== NaN) {
      console.clear();
      if (Number(choice) > personsList.length) {
        console.log(`Finns ingen person med index ${Number(choice)}\n`)
      } else {
        createOrEditPerson(Number(choice) - 1);
      }
    } else {
      console.clear();
      if (personsList.length === 1) {
        console.log("Du måste välja mellan 1 eller B.\n");
      } else {
        console.log(`Du måste välja mellan 1 - ${personsList.length} eller B.\n`);
      }
    }
  }
  console.clear();
}

function updateFile() {
  fs.writeFileSync("persons.json", JSON.stringify(personsList, null, 2))
}

function addWhiteSpace(text = "", max) {
  if (text.length > max) {
    return text.slice(0, max - 3) + "..."
  } else {
    return text + " ".repeat(max - text.length)
  }
}