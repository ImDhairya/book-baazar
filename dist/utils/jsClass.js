"use strict";
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    login() {
        console.log(`${this.name} has logged in.`);
    }
}
class Admin extends User {
    constructor(name, email, role = "admin") {
        super(name, email); // this is calling the class named user so the user class will have all the requried data and files needed to run
        this.role = role;
    }
    deleteUser(user) {
        console.log(this.name, " user deleted  ", user.name);
    }
}
