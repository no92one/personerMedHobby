export default class Person {

  firstName;
  lastName;
  age;
  hobbies;

  constructor(firstName, lastName, age, hobbies = []) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.hobbies = hobbies;
  }

}