"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Doctor {
  _id: string;
  name: string;
  department: string;
  fee: number;
  averageRating: number;
}

const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    doctorId: "",
    name: "",
    department: "",
    fee: "",
    days: [],
    startTime: "",
    endTime: "",
    slotLengthInMinutes: "",
    hourlyLimit: "",
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/admin/doctor/get-doctor");
        if (response.data.success) {
          setDoctors(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/doctor/${id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleAddDoctor = async () => {
    try {
      const response = await axios.post("/api/admin/doctor/add-doctor", {
        ...newDoctor,
        fee: parseFloat(newDoctor.fee), // Convert fee to a number
        slotLengthInMinutes: parseInt(newDoctor.slotLengthInMinutes),
        hourlyLimit: parseInt(newDoctor.hourlyLimit),
      });
      if (response.data.success) {
        alert("Doctor added successfully!");
        setShowAddForm(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDoctor({ ...newDoctor, [name]: value });
  };

  return (
    <div>
      <h1>Doctors List</h1>
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Cancel Add Doctor" : "Add Doctor"}
      </button>
      {showAddForm && (
        <div>
          <h2>Add New Doctor</h2>
          <input
            type="text"
            name="doctorId"
            placeholder="Doctor ID"
            value={newDoctor.doctorId}
            onChange={handleChange}
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newDoctor.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={newDoctor.department}
            onChange={handleChange}
          />
          <input
            type="number"
            name="fee"
            placeholder="Fee"
            value={newDoctor.fee}
            onChange={handleChange}
          />
          <input
            type="text"
            name="days"
            placeholder="Available Days (comma-separated)"
            value={newDoctor.days.join(",")}
            onChange={(e) =>
              setNewDoctor({ ...newDoctor, days: e.target.value.split(",") })
            }
          />
          <input
            type="time"
            name="startTime"
            placeholder="Start Time"
            value={newDoctor.startTime}
            onChange={handleChange}
          />
          <input
            type="time"
            name="endTime"
            placeholder="End Time"
            value={newDoctor.endTime}
            onChange={handleChange}
          />
          <input
            type="number"
            name="slotLengthInMinutes"
            placeholder="Slot Length in Minutes"
            value={newDoctor.slotLengthInMinutes}
            onChange={handleChange}
          />
          <input
            type="number"
            name="hourlyLimit"
            placeholder="Hourly Limit"
            value={newDoctor.hourlyLimit}
            onChange={handleChange}
          />
          <button onClick={handleAddDoctor}>Submit</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Fee</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id}>
              <td>
                <Link href={`/admin/doctor/${doctor._id}`}>{doctor.name}</Link>
              </td>
              <td>{doctor.department}</td>
              <td>{doctor.fee}</td>
              <td>{doctor.averageRating}</td>
              <td>
                <button onClick={() => handleDelete(doctor._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDoctorsPage;
