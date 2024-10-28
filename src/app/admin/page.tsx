"use client"
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import ShadCN Table components
import axios from 'axios';
import { Button } from '@/components/ui/button';

const Page = () => {
  const [temporaryPatients, setTemporaryPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch temporary patients from backend
    const fetchTemporaryPatients = async () => {
      try {
        const response = await axios.get('/api/admin/patient/tempPatient/get-tempPatient');
        if (response.data.success) {
          setTemporaryPatients(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching temporary patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemporaryPatients();
  }, []);

  const deletePatient = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/patient/tempPatient/${id}`);
      if (response.data.success) {
        setTemporaryPatients(prevPatients => prevPatients.filter(tempPatient => tempPatient._id !== id));
        alert("Patient deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete patient");
    }
  };

  return (
    <div className='px-[20%]'>
      <div>
        <h1 className='font-extrabold text-4xl text-black'>Admin Dashboard</h1>
        <div>
          <h1 className='font-bold text-2xl'>Temporary Patients</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableCaption>A list of all temporary patients who booked appointments.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Appointment Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {temporaryPatients.length > 0 ? (
                  temporaryPatients.map((patient: any) => (
                    <TableRow key={patient._id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.doctorName}</TableCell>
                      <TableCell>{new Date(patient.appointmentDate).toLocaleDateString()}</TableCell>
                      <TableCell>{patient.timeSlot}</TableCell>
                      <TableCell><Button>Create</Button></TableCell>
                      <TableCell>
                        <Button variant='destructive' onClick={() => deletePatient(patient._id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No temporary patients found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
