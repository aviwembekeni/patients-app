drop table if exists hospitals, deceased, appointments, medications, patients, users;

create table users
(
	id serial not null PRIMARY KEY,
	fullname text not null,
	username text not null UNIQUE,
	usertype text not null,
	hash VARCHAR(100) NOT NULL
);

Create TABLE hospitals
(
	hospital_id serial not null PRIMARY KEY,
	name text not null
);

create table patients
(
	id serial not null primary key,
	id_no varchar not null UNIQUE,
	fullname text not null,
	address VARCHAR not null,
	illness VARCHAR not null,
	doctor_name text not null,
	contact_no VARCHAR not null,
	doctor_no VARCHAR not null,
	hospital int not null,
	alive boolean DEFAULT true,
	FOREIGN KEY (hospital) REFERENCES hospitals(hospital_id)
);

create table appointments
(
	id serial not null primary key,
	description varchar not null,
	appointment_date date not null,
	patient_id int not null,
	FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE medications
(
	id serial not null primary key,
	description VARCHAR not null,
	meds VARCHAR not null,
	patient_id int not null,
	date_issued date not null,
	FOREIGN KEY (patient_id) REFERENCES patients(id)
);

Create table deceased
(
	id serial not null PRIMARY KEY,
	deceased_id int not null,
	report VARCHAR DEFAULT 'pending',
	FOREIGN KEY (deceased_id) REFERENCES patients(id)
);

INSERT into hospitals
	(name)
VALUES
	('Alan Blyth Hospital');

INSERT into hospitals
	(name)
VALUES
	('Alexandra Hospital');

INSERT into hospitals
	(name)
VALUES
	('Avalon Treatment Centre');

INSERT into hospitals
	(name)
VALUES
	('Brooklyn Chest Hospital');

INSERT into hospitals
	(name)
VALUES
	('G F Jooste Trauma Emergency Hospital');

INSERT into hospitals
	(name)
VALUES
	('Groote Schuur Hospital');

INSERT into hospitals
	(name)
VALUES
	('Karl Bremer Hospital');

INSERT into hospitals
	(name)
VALUES
	('Lentegeur Hospital');

INSERT into hospitals
	(name)
VALUES
	('Red Cross Children Hospital');

INSERT into hospitals
	(name)
VALUES
	('Tygerberg Hospital');

INSERT into patients
	(id_no, fullname, address, illness, doctor_name, contact_no, doctor_no, hospital)
VALUES
	('8702127865289', 'Hayley Marshall', '22 Yorkshire rd Cape Town', 'Asthma', 'Dr Mkhize Jobela', '0878965432', '0678954321', 5);

INSERT into patients
	(id_no, fullname, address, illness, doctor_name, contact_no, doctor_no, hospital)
VALUES
	('9803036537389', 'Nicole Keni', '20 Broklyn rd Cape Town', 'Bile', 'Dr Mkhize Jobela', '0618376384', '0678954321', 6);

INSERT into patients
	(id_no, fullname, address, illness, doctor_name, contact_no, doctor_no, hospital)
VALUES
	('8501027836537', 'Liyema Poiana', '37 Sisulu st Cape Town', 'Cancer', 'Dr Lion Herden', '0768790234', '0789409876', 10);

INSERT into patients
	(id_no, fullname, address, illness, doctor_name, contact_no, doctor_no, hospital)
VALUES
	('6501120987654', 'Jonas Zyne', '37 Jun st Cape Town', 'Piles', 'Dr Lion Herden', '0837209823', '08732120978', 8);

INSERT into patients
	(id_no, fullname, address, illness, doctor_name, contact_no, doctor_no, hospital, alive)
VALUES
	('0102012982572', 'Liam Perks', '21 Juns rd Cape Town', 'Asthma', 'Dr Mkhize Jobela', '0874561278', '0678954321', 4, false);

INSERT into patients
	(id_no, fullname, address, illness, doctor_name, contact_no, doctor_no, hospital, alive)
VALUES
	('0204056789232', 'Huns Kio', '20 Hawai rd Cape Town', 'Cancer', 'Dr Mkhize Jobela', '0765462323', '0678954321', 8, false);

INSERT into patients
	(id_no, fullname, address, illness, doctor_name, contact_no, doctor_no, hospital, alive)
VALUES
	('0203042367829', 'Juam kuz', '37 Raymond st Cape Town', 'TB', 'Dr Lion Herden', '0986543267', '0789409876', 10, false);


INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('X-ray scan', '2018-10-11', '1');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('dentist', '2018-10-19', '1');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('therapy', '2018-10-27', '1');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('X-ray scan', '2018-10-11', '2');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('dentist', '2018-10-19', '2');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('therapy', '2018-10-27', '2');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('X-ray scan', '2018-10-11', '3');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('dentist', '2018-10-19', '3');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('therapy', '2018-10-27', '3');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('X-ray scan', '2018-10-11', '4');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('dentist', '2018-10-19', '4');

INSERT into appointments
	(description, appointment_date, patient_id)
VALUES
	('therapy', '2018-10-27', '4');


INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('Asthma/COPD', 'albuterol and ipratropium nebs prn, theophylline', '1', '2018-02-20');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('Swollen Tounge', 'corticosteroid, antihistamine, Diphenhydramine 25 mg bid', '1', '2018-03-03');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('GERD', 'famotidine', '1', '2018-06-25');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('Asthma/COPD', 'albuterol and ipratropium nebs prn, theophylline', '2', '2018-02-20');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('Swollen Tounge', 'corticosteroid, antihistamine, Diphenhydramine 25 mg bid', '2', '2018-03-03');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('GERD', 'famotidine', '2', '2018-06-25');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('Asthma/COPD', 'albuterol and ipratropium nebs prn, theophylline', '3', '2018-02-20');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('Swollen Tounge', 'corticosteroid, antihistamine, Diphenhydramine 25 mg bid', '3', '2018-03-03');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('GERD', 'famotidine', '3', '2018-06-25');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('Asthma/COPD', 'albuterol and ipratropium nebs prn, theophylline', '4', '2018-02-20');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('Swollen Tounge', 'corticosteroid, antihistamine, Diphenhydramine 25 mg bid', '4', '2018-03-03');

INSERT into medications
	(description, meds, patient_id, date_issued)
VALUES
	('GERD', 'famotidine', '4', '2018-06-25');

INSERT into deceased
	(deceased_id)
VALUES
	(5);

INSERT into deceased
	(deceased_id)
VALUES
	(6);

INSERT into deceased
	(deceased_id)
VALUES
	(7);