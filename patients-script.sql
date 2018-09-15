drop table if exists users, weekdays, shifts;

-- create table users
-- (
-- 	id serial not null primary key,
-- 	user_name text not null,
-- 	full_name text not null,
-- 	user_type text not null
-- );

create table patients
(
	id serial not null primary key,
	id_no varchar not null UNIQUE,
	fullname text not null,
	address VARCHAR not null,
	illness VARCHAR not null,
	doctor_name text not null,
	contact_no VARCHAR not null,
	doctor_no VARCHAR not null
);

create table appointments
(
	id serial not null primary key,
	decription varchar not null,
	appointment_date date not null,
	patient_id int not null,
	FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE medications
(
	id serial not null primary key,
	decription VARCHAR not null,
	meds VARCHAR not null,
	patient_id int not null,
	FOREIGN KEY (patient_id) REFERENCES patients(id)
);


