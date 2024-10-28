"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Doctor {
  _id: string;
  doctorId: string;
  name: string;
  department: string;
  fee: number;
  averageRating: number;
}

const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showNewDeptInput, setShowNewDeptInput] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [newDoctor, setNewDoctor] = useState({
    doctorId: "",
    name: "",
    department: "",
    fee: "",
    days: "",
    startTime: "",
    endTime: "",
    slotLengthInMinutes: "",
    hourlyLimit: "",
  });

  useEffect(() => {
    const fetchDoctorsAndDepartments = async () => {
      try {
        const response = await axios.get("/api/admin/doctor/get-doctor");
        if (response.data.success) {
          setDoctors(response.data.data);
          const uniqueDepartments = [
            ...new Set(response.data.data.map((doc: Doctor) => doc.department)),
          ];
          setDepartments(uniqueDepartments);
        }
      } catch (error) {
        console.error("Error fetching doctors and departments:", error);
      }
    };
    fetchDoctorsAndDepartments();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/doctor/${id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const generateUniqueDoctorId = () => {
    let generatedId;
    do {
      generatedId = Math.floor(100000 + Math.random() * 900000).toString();
    } while (doctors.some((doctor) => doctor.doctorId === generatedId));
    return generatedId;
  };

  const handleAddDoctor = async () => {
    try {
      if (!newDoctor.doctorId) {
        newDoctor.doctorId = generateUniqueDoctorId();
      }
      if (showNewDeptInput && newDepartment) {
        newDoctor.department = newDepartment;
      }

      const response = await axios.post("/api/admin/doctor/add-doctor", {
        ...newDoctor,
        fee: parseFloat(newDoctor.fee),
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
    <div className="container">
      <h1>Doctors List</h1>
      <Button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Cancel Add Doctor" : "Add Doctor"}
      </Button>
      {showAddForm && (
        <Card className="mt-4">
          <CardHeader>
            <h2>Add New Doctor</h2>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setNewDoctor({ ...newDoctor, doctorId: generateUniqueDoctorId() })}
            >
              Generate Doctor ID
            </Button>
            <Input
              type="text"
              name="doctorId"
              placeholder="Doctor ID"
              value={newDoctor.doctorId}
              readOnly
            />
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={newDoctor.name}
              onChange={handleChange}
            />
            <Select
              placeholder="Select Department"
              value={newDoctor.department}
              onValueChange={(value) => {
                if (value === "new") {
                  setShowNewDeptInput(true);
                  setNewDoctor({ ...newDoctor, department: "" });
                } else {
                  setShowNewDeptInput(false);
                  setNewDoctor({ ...newDoctor, department: value });
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept, index) => (
                  <SelectItem key={index} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
                <SelectItem value="new">+ Add New Department</SelectItem>
              </SelectContent>
            </Select>

            {showNewDeptInput && (
              <Input
                type="text"
                placeholder="New Department"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
              />
            )}
            <Input
              type="number"
              name="fee"
              placeholder="Fee"
              value={newDoctor.fee}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="days"
              placeholder="Available Days (comma-separated)"
              value={newDoctor.days}
              onChange={handleChange}
            />
            <Input
              type="time"
              name="startTime"
              placeholder="Start Time"
              value={newDoctor.startTime}
              onChange={handleChange}
            />
            <Input
              type="time"
              name="endTime"
              placeholder="End Time"
              value={newDoctor.endTime}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="slotLengthInMinutes"
              placeholder="Slot Length in Minutes"
              value={newDoctor.slotLengthInMinutes}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="hourlyLimit"
              placeholder="Hourly Limit"
              value={newDoctor.hourlyLimit}
              onChange={handleChange}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddDoctor}>Submit</Button>
          </CardFooter>
        </Card>
      )}
      <Card className="mt-6">
        <CardHeader>
          <h2>Doctors List</h2>
        </CardHeader>
        <CardContent>
          <table className="w-full">
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
                    <Button variant="destructive" onClick={() => handleDelete(doctor._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDoctorsPage;
