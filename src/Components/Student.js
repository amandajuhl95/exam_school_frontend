import React, { useState } from "react";
import facade from "../apiFacade";
import "../App.css";

const StudentRow = ({ student }) => {
  return (
    <tr>
      <td> {student.name} </td>
      <td> {student.email} </td>
      <SemesterRow items={student.signedup} />
      <DateRow items={student.signedup} />
      <GradeRow items={student.signedup} />
    </tr>
  );
};

const SemesterRow = ({ items }) => {
  const semester = items.map(item => item.semester);
  return <td>{semester.join(", ")}</td>;
};

const DateRow = ({ items }) => {
  const date = items.map(item => item.passedDate);
  return <td>{date.join(", ")}</td>;
};

const GradeRow = ({ items }) => {
  const grade = items.map(item => item.grade);
  return <td>{grade.join(", ")}</td>;
};

export default function Student() {
  const [students, setStudents] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [name, setName] = useState("");

  const handleChange = event => {
    const target = event.target;
    const value = target.value;
    setName(value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    findStudent(name);
    setName("");
  };

  const findStudent = async name => {
    try {
      const data = await facade.getStudent(name);
      setStudents(data);
      setFetching(true);
    } catch (error) {
      alert("UPSSS " + error);
    }
  };

  const tableItems = students.map((student, id) => (
    <StudentRow key={id} student={student} />
  ));
  const StudentTable = () => {
    return fetching ? (
      <table id="table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Semester</th>
            <th>Date when passed</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>{tableItems}</tbody>
      </table>
    ) : (
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    );
  };
  return (
    <div>
      <h2>Student</h2>
      <p>
        Here you can search for any students, to see their grades, when they
        passed the course and other details
      </p>
      <p> You can search for either Benjamin, Amalie or Amanda</p>
      <input
        placeholder="Search by name"
        value={name}
        onChange={handleChange}
      />
      <br></br>
      <br></br>
      <button onClick={handleSubmit}>Search</button>
      <br></br>
      <br></br>
      <StudentTable />
    </div>
  );
}
