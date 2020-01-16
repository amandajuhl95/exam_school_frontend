import React, { useState } from "react";
import facade from "../apiFacade";
import "../App.css";

const TeacherRow = ({ teacher }) => {
  return (
    <tr>
      <TeacherName items={teacher.teachers} />
      <td> {teacher.courseName} </td>
      <td> {teacher.maxNumberStudent} </td>
      <td> {teacher.semester}</td>
    </tr>
  );
};

const TeacherName = ({ items }) => {
  const name = items.map(item => item.name);
  return <td>{name.join(", ")}</td>;
};

export default function Teacher() {
  const [teachers, setTeachers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [name, setName] = useState("");

  const handleChange = event => {
    const target = event.target;
    const value = target.value;
    setName(value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    findTeacher(name);
    setName("");
  };

  const findTeacher = async name => {
    try {
      const data = await facade.getTeacher(name);
      setTeachers(data);
      setFetching(true);
    } catch (error) {
      alert("UPSSS " + error);
    }
  };

  const tableItems = teachers.map((teacher, id) => (
    <TeacherRow key={id} teacher={teacher} />
  ));
  const TeacherTable = () => {
    return fetching ? (
      <table id="table">
        <thead>
          <tr>
            <th>Teacher Name</th>
            <th>Course Name</th>
            <th>Spots available</th>
            <th>Semester</th>
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
      <h2>Teacher</h2>
      <p>
        Here you can search for any teachers, to see which courses they teach
        in.
      </p>
      <p> You can search for either Tine, Tue, Lars or Palle</p>
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
      <TeacherTable />
    </div>
  );
}
