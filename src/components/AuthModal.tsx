"use client";

import { useEffect } from "react";
import {
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuthModal } from "@/hooks/useAuthModal";
import Modal from "./Modal";
import useUserInfo from "@/hooks/useUserInfo";
import PatientAuth from "./PatientAuth";
import AuthInfo from "./AuthInfo";

const AuthModal = () => {
  const { close, isOpen } = useAuthModal();
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();

  const {
    login,
    user_id,
    firstName,
    lastName,
    email,
    password,
    patient,
    doctor,
    DOB,
    gender,
    address,
    phone,
    specialization,
    selectedAllergies,
    selectedMedications,
    setLogin,
    setSpecialization,
    setEmail,
    setPassword,
    setPatient,
    setDoctor,
    setUser_id,
    reset,
  } = useUserInfo();

  useEffect(() => {
    if (session) {
      router.refresh();
      close();
    }
  }, [close, router, session, selectedAllergies]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else if (data) {
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    }

    if (session) {
      router.push("/dashboard");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: patientData, error: patientError } = await supabaseClient
      .from("patient")
      .select("*")
      .eq("email", email);

    const { data: doctorData, error: doctorError } = await supabaseClient
      .from("doctor")
      .select("*")
      .eq("email", email);

    if (patientError) {
      toast.error(patientError.message);
      return;
    }

    if (doctorError) {
      toast.error(doctorError.message);
      return;
    }

    if (patientData?.length || doctorData?.length) {
      toast.error("Email already exists!");
      return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_role: doctor ? "Doctor" : "Patient",
          user_id: user_id,
          dob: DOB.toISOString().toLocaleString(),
          gender: gender,
          address: address,
          phone: phone,
          specialization: specialization,
        },
      },
    });

    if (error) {
      toast.error(
        error.message + "\nMake sure you have filled all the fields!"
      );
      return;
    }

    if (data.user) {
      if (patient) {
        if (selectedAllergies.length) {
          const { data: allergyData, error: allergyError } =
            await supabaseClient.from("history_allergy").insert(
              selectedAllergies.map((allergy) => ({
                PHN: user_id,
                allergy_id: allergy.allergy_id,
              }))
            );

          if (allergyError) {
            toast.error(allergyError.message);
            return;
          }
        }

        if (selectedMedications.length) {
          const { data: medicationData, error: medicationError } =
            await supabaseClient.from("history_medication").insert(
              selectedMedications.map((medication) => ({
                PHN: user_id,
                medicine_id: medication.medicine_id,
              }))
            );

          if (medicationError) {
            toast.error(medicationError.message);
            return;
          }
        }

        toast.success("Signed up successfully!");
        reset();
      } else {
        toast.success("Signed up successfully!");
        reset();
      }
    }
  };

  return (
    <Modal
      title={login ? "Login" : "Sign Up"}
      description=""
      isOpen={isOpen}
      onChange={() => {
        if (isOpen) close();
      }}
    >
      <form action="">
        {!login && <AuthInfo />}

        <div className="flex flex-col mt-2">
          <label htmlFor="email">Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            className="bg-neutral-200 px-2 py-1 rounded-sm w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col mt-2">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="bg-neutral-200 px-2 py-1 rounded-sm w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div
          className={`flex justify-start items-center gap-x-2 mt-2 ${
            login && "hidden"
          }`}
        >
          <input
            type="checkbox"
            name="doctor"
            checked={doctor}
            onChange={() => {
              setDoctor(!doctor);
              setPatient(false);
            }}
          />
          <label htmlFor="doctor">Doctor</label>
          <input
            type="checkbox"
            name="patient"
            checked={patient}
            onChange={() => {
              setPatient(!patient);
              setDoctor(false);
            }}
          />
          <label htmlFor="patient">Patient</label>
        </div>
        {!login && (
          <div className="flex flex-col mt-2">
            <label htmlFor="id">
              {"Please Enter Your 10-Digit "}
              {patient ? "Personal Health Number" : "Doctor's License"}
            </label>
            <input
              type="tel"
              name="id"
              placeholder={patient ? "PHN" : "License"}
              className="bg-neutral-200 px-2 py-1 rounded-sm w-full"
              maxLength={10}
              value={user_id}
              onChange={(e) => setUser_id(e.target.value)}
              required
            />
            {patient && <PatientAuth />}
            {doctor && (
              <>
                <label htmlFor="specialization" className="mt-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  className="bg-neutral-200 px-2 py-1 rounded-sm w-full"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />
              </>
            )}
          </div>
        )}

        <div
          className={`flex justify-between items-center mt-2 ${
            !login && "hidden"
          }`}
        >
          <div className="flex gap-x-2">
            <input type="checkbox" name="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button className="text-blue text-sm">Forgot password</button>
        </div>
        <button
          type="submit"
          className="bg-blue text-white px-2 py-1 rounded-sm border border-blue hover:bg-white hover:text-blue hover:border-blue w-full mt-4"
          onClick={(e) => {
            login ? handleLogin(e) : handleSignUp(e);
          }}
        >
          {login ? "Login" : "Sign Up"}
        </button>
        <div className="flex justify-center items-center mt-4">
          <p className="text-black">
            {!login ? "Already have an account?" : "Don't have an account?"}
          </p>
          <button
            className="text-blue text-sm ml-2"
            onClick={() => {
              setLogin(!login);
            }}
          >
            {login ? "Sign Up" : "Login"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
