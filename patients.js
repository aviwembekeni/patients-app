const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
var bcrypt = require("bcrypt-nodejs");
const loginErrorMessages = require("./validation/login");
const registerErrorMessages = require("./validation/register");

module.exports = function(pool) {
  async function getPatientsInfo(user_name) {
    const patientsList = await pool.query(
      "SELECT *, name as hospital_name FROM patients JOIN hospitals ON patients.hospital = hospitals.hospital_id"
    );
    const patients = patientsList.rows;
    const medications = await getMedications();
    const appointments = await getAppointments();
    for (let i = 0; i < patients.length; i++) {
      patients[i].random =
        "x" +
        Math.random()
          .toString(36)
          .substring(7);

      patients[i].medications = [];
      for (let j = 0; j < medications.length; j++) {
        if (patients[i].id == medications[j].patient_id) {
          patients[i].medications.push(medications[j]);
        }
      }

      patients[i].appointments = [];

      for (let k = 0; k < appointments.length; k++) {
        if (patients[i].id == appointments[k].patient_id) {
          patients[i].appointments.push(appointments[k]);
        }
      }
    }

    localStorage.setItem("patients", JSON.stringify(patients));

    return patients;
  }

  // async function addUser(username = "", fullname = "", usertype = "") {
  //   if ((username !== "" && fullname !== "") || username !== "") {
  //     await pool.query(
  //       "INSERT INTO users (user_name, full_name, user_type) VALUES ( $1, $2, $3)",
  //       [username, fullname, usertype]
  //     );
  //   }
  //   return true;
  // }

  async function getAppointments() {
    const appointments = await pool.query("SELECT * FROM appointments");

    return appointments.rows;
  }

  async function getMedications() {
    const medications = await pool.query("SELECT * FROM medications");

    return medications.rows;
  }

  async function getHospitals() {
    const hospitals = await pool.query("SELECT * FROM hospitals");

    return hospitals.rows;
  }

  async function getDeceasedInfo() {
    const deceasedList = await pool.query(
      "SELECT *, report FROM patients JOIN deceased on patients.id = deceased.deceased_id"
    );

    const deceased = deceasedList.rows;

    for (let i = 0; i < deceased.length; i++) {
      deceased[i].random =
        "x" +
        Math.random()
          .toString(36)
          .substring(7);
    }

    localStorage.setItem("patients", JSON.stringify(deceased));
    return deceased;
  }

  function patientSearch(name) {
    const retrievedPatients = localStorage.getItem("patients");
    const patients = JSON.parse(retrievedPatients);

    const filteredPatients = patients.filter(patient => {
      return patient.fullname.split(" ")[0] == name || patient.fullname == name;
    });

    return filteredPatients;
  }

  async function addUser(register) {
    const { userName, fullName, userType, password2, password } = register;

    let error = registerErrorMessages(register);
    if (!error.isValid) {
      console.log(error.errors);
      return error.errors;
    }
    let hash = bcrypt.hashSync(password);
    if (!hash) {
      return "opps something is wrong!!";
    }
    await pool.query(
      "INSERT INTO users (fullname,username,usertype,hash) VALUES($1,$2,$3,$4)",
      [fullName, userName, userType, hash]
    );
    return "user is successfully added";
  }

  async function siginIn(params) {
    let error = loginErrorMessages(params);
    if (!error.isValid) {
      return error.errors;
    }
    let siginIn = await validUser(params);
    return siginIn;
  }

  async function validUser({ userName, password }) {
    let found = await pool.query(
      "SELECT hash, usertype, fullname FROM users where username=$1",
      [userName]
    );
    if (found.rowCount == 0) {
      return "username is not found";
    }
    let hash = found.rows[0].hash;
    let usertype = found.rows[0].usertype;
    let fullname = found.rows[0].fullname;
    let user = { fullname, usertype };
    localStorage.setItem("user", JSON.stringify(user));
    if (!bcrypt.compareSync(password, hash)) {
      return "incorrect password";
    }
    return "login";
  }

  function getUser() {
    let userData = localStorage.getItem("user");
    let user = JSON.parse(userData);
    return user;
  }

  return {
    getPatientsInfo,
    getMedications,
    getAppointments,
    patientSearch,
    addUser,
    siginIn,
    getUser,
    getHospitals,
    getDeceasedInfo
  };
};
