class User {
  name: string;
  email: string;
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  login() {
    console.log(`${this.name} has logged in.`);
  }
}

class Admin extends User {
  role: string;

  constructor(name: string, email: string, role: string = "admin") {
    super(name, email); // this is calling the class named user so the user class will have all the requried data and files needed to run

    this.role = role;
  }
  deleteUser(user: User) {
    console.log(this.name, " user deleted  ", user.name);
  }
}
