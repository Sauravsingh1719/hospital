"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Doctor {
  _id: string;
  name: string;
  department: string;
  fee: number;
  availability: {
    days: string[];
    timeSlots: Record<string, { start: string; end: string; status: string }>;
  };
}

const BookingAppointmentForm: React.FC = () => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("/api/admin/doctor/get-doctor");
        if (response.data.success) {
          const fetchedDepartments = [
            ...new Set(response.data.data.map((doctor: Doctor) => doctor.department)),
          ];
          setDepartments(fetchedDepartments);
          setDoctors(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setSelectedDoctor(null);
    setSelectedTimeSlot("");
    setTimeSlots([]);
  };

  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors.find((doc) => doc._id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      const availableSlots = Object.entries(doctor.availability.timeSlots)
        .filter(([key, slot]) => slot.status === "available")
        .map(([key, slot]) => `${slot.start}-${slot.end}`);
      setTimeSlots(availableSlots);
    }
    setSelectedTimeSlot("");
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) return;
    try {
      const response = await axios.post("/api/appointment/book-appointment", {
        name,
        phone,
        age,
        email,
        doctorId: selectedDoctor._id,
        appointmentDate: selectedDate,
        timeSlot: selectedTimeSlot,
        paymentMethod,
      });

      if (response.data.success) {
        alert("Appointment booked successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment.");
    }
  };

  // Calendar date filtering based on doctor's availability
  const isDateSelectable = (date: Date) => {
    if (!selectedDoctor) return false;
    const dayOfWeek = format(date, "EEEE");
    return selectedDoctor.availability.days.includes(dayOfWeek);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Enter Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)} />
          <Input placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />

          {/* Department Selector */}
          <Select onValueChange={handleDepartmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept, index) => (
                <SelectItem key={index} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Doctor Selector */}
          {selectedDepartment && (
            <Select onValueChange={handleDoctorChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors
                  .filter((doc) => doc.department === selectedDepartment)
                  .map((doctor) => (
                    <SelectItem key={doctor._id} value={doctor._id}>
                      {doctor.name} - Fee: ${doctor.fee}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}

          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                disabled={(date) => !isDateSelectable(date)} // Disable dates not in doctor's availability
              />
            </PopoverContent>
          </Popover>

          {/* Time Slot Selector */}
          {selectedDoctor && selectedDate && (
            <Select onValueChange={setSelectedTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Select Time Slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot, index) => (
                  <SelectItem key={index} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Payment Method Selector */}
          <Select onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="counter">Counter</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleBooking} className="w-full">
            Book Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingAppointmentForm;
