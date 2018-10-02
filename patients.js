const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");
var bcrypt = require("bcrypt-nodejs");
const loginErrorMessages = require("./validation/login");
const registerErrorMessages = require("./validation/register");

module.exports = function(pool) {
  async function getPatientsInfo(user_name) {
    const patientsList = await pool.query(
      "SELECT *, name as hospital_name FROM patients JOIN hospitals ON patients.hospital = hospitals.hospital_id ORDER BY fullname ASC"
    );
    const patients = patientsList.rows;
    const medications = await getMedications();
    const appointments = await getAppointments();
    const hospitals = await getHospitals();
    for (let i = 0; i < patients.length; i++) {
      patients[i].random =
        "x" +
        Math.random()
          .toString(36)
          .substring(7);

      patients[i].hospitals = hospitals;

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

  async function addPatient(patient) {
    let hospitalIds = await pool.query(
      "Select hospital_id from hospitals WHERE name = $1",
      [patient.hospital]
    );

    let hospital_id = hospitalIds.rows[0].hospital_id;
    try {
      await pool.query(
        "INSERT INTO patients (id_no, fullname, address, illness, doctor_name, contact_no, doctor_no, hospital) VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
        [
          patient.idno,
          patient.fullname,
          patient.address,
          patient.illness,
          patient.doctorname,
          patient.contact,
          patient.doctorno,
          hospital_id
        ]
      );

      localStorage.setItem("idno", patient.idno);

      return "success";
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function addMedication(medication) {
    let idno = localStorage.getItem("idno");

    let pattientIdList = await pool.query(
      "select id from patients WHERE id_no = $1",
      [idno]
    );

    let patientId = pattientIdList.rows[0].id;
    try {
      await pool.query(
        "INSERT INTO medications (description, meds, patient_id, date_issued) VALUES($1, $2, $3, $4)",
        [
          medication.description,
          medication.meds,
          patientId,
          medication.dateissued
        ]
      );

      return "success";
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function addAppointment(appointment) {
    let idno = localStorage.getItem("idno");

    let pattientIdList = await pool.query(
      "select id from patients WHERE id_no = $1",
      [idno]
    );

    let patientId = pattientIdList.rows[0].id;
    try {
      await pool.query(
        "INSERT INTO appointments (description, appointment_date, patient_id) VALUES($1, $2, $3)",
        [appointment.description, appointment.appointmentdate, patientId]
      );

      return "success";
    } catch (error) {
      return error;
    }
  }

  async function transferPatient(transferData) {
    try {
      await pool.query("UPDATE patients SET hospital = $1 WHERE id = $2", [
        transferData.hospitalid,
        transferData.patientid
      ]);

      return "success";
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function markPatientAsDeceased(patientid) {
    try {
      await pool.query("UPDATE patients SET alive = false WHERE id = $1", [
        patientid
      ]);

      await pool.query("INSERT INTO deceased (deceased_id) VALUES ($1)", [
        patientid
      ]);

      return "success";
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function addDeceasedReport(deceasedid, report) {
    try {
      await pool.query(
        "UPDATE deceased SET report = $1 WHERE deceased_id = $2",
        [report, deceasedid]
      );

      return "success";
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function getDeceasedInfo() {
    const deceasedList = await pool.query(
      "SELECT *, deceased_id, report FROM patients JOIN deceased on patients.id = deceased.deceased_id ORDER BY fullname ASC"
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
      return (
        patient.fullname.split(" ")[0] == name ||
        patient.fullname == name ||
        patient.fullname.split(" ")[1] == name
      );
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
    const error =loginErrorMessages({userName,password})
    let found = await pool.query(
      "SELECT hash, usertype, fullname FROM users where username=$1",
      [userName]
    );
    if (found.rowCount == 0) {
      error.userName = "Username is not found";
      return error;
    }
    let hash = found.rows[0].hash;
    let usertype = found.rows[0].usertype;
    let fullname = found.rows[0].fullname;
    let user = { fullname, usertype };
    localStorage.setItem("user", JSON.stringify(user));
    if (!bcrypt.compareSync(password, hash)) {
      error.password = "Incorrect password";
      return  error;
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
    getDeceasedInfo,
    addPatient,
    addMedication,
    addAppointment,
    transferPatient,
    markPatientAsDeceased,
    addDeceasedReport
  };
};
