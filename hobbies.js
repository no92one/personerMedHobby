import fs from "fs";

export default class Hobbies {
  orginList = []
  list = [];

  constructor(personHobbies = []) {
    this.orginList = this.loadHobbies();
    this.list = this.loadHobbies();

    console.log("Before init - ", this.list);
    if (personHobbies.length > 0) {
      this.setHobbies(personHobbies);
    }
    console.log("After init - ", this.list);
  }

  loadHobbies() {
    const data = JSON.parse(fs.readFileSync("hobbies.json"));
    const tempList = [];

    for (let i = 0; i < data.length; i++) {
      tempList.push(new Hobbie(data[i].name, data[i].picked));
    }

    return tempList;
  }

  setHobbies(personHobbies) {
    for (let i = 0; i < personHobbies.length; i++) {
      const index = this.orginList.findIndex(element => element.name === personHobbies[i]);
      console.log("Index - ", index);
      if (index >= 0) {
        this.pickHobbie(index);
      }
    }
  }

  addHobbieToList(newHobbie) {
    if (newHobbie.length < 3 || newHobbie.length > 25) {
      console.log("Måste skriva in minst 3 tecken och max 25");
    } else if (this.orginList.includes(newHobbie)) {
      console.log(`${newHobbie} finns redan.`);
    } else {
      this.orginList.push(new Hobbie(newHobbie));
      this.updateFile()
    }
  }

  printList() {
    for (let i = 0; i < this.list.length; i++) {
      console.log(`${i + 1}. ${this.list[i].name} - ${this.list[i].picked}`);
    }
  }

  pickHobbie(index) {
    this.list[index].picked = !this.list[index].picked;
  }

  listLength() {
    return this.list.length;
  }

  listOfPickedHobbies() {
    const templist = [];

    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].picked) {
        templist.push(this.list[i].name)
      }
    }

    return templist;
  }

  updateFile() {
    fs.writeFileSync("hobbies.json", JSON.stringify(this.orginList, null, 2))
  }
}

class Hobbie {

  name;
  picked;

  constructor(name, picked = false) {
    this.name = name;
    this.picked = picked;
  }
}