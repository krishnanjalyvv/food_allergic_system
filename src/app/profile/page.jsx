"use client";
import React, { useState } from "react";
import { ArrowLeft, Upload, User, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";

const MedicalProfilePage = () => {
  const [medicalRecords, setMedicalRecords] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [dietPreference, setDietPreference] = useState("");
  const [otherAllergy, setOtherAllergy] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [shareData, setShareData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setMedicalRecords(file);
    }
  };

  const handleAllergyChange = (allergy) => {
    setAllergies((prev) =>
      prev.includes(allergy)
        ? prev.filter((a) => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    if (medicalRecords) {
      formData.append("medicalRecords", medicalRecords);
    }
    formData.append("allergies", JSON.stringify(allergies));
    formData.append("dietPreference", dietPreference);
    formData.append("otherAllergy", otherAllergy);
    formData.append("additionalInfo", additionalInfo);
    formData.append("shareData", shareData);
    // print the form data to the console for debugging in a single statement
    const details = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:5000/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ data: details }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit medical profile");
      }

      const result = await response.json();
      console.log("Submission successful:", result);
      // Here you can add logic to show a success message or redirect the user
    } catch (error) {
      console.error("Error submitting medical profile:", error);
      // Here you can add logic to show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4 space-y-4 bg-gray-900 text-gray-100'>
      <div className='flex justify-between items-center'>
        <Link href='/'>
          <button className='p-2 rounded-full hover:bg-gray-800'>
            <ArrowLeft className='text-blue-400 w-6 h-6' />
          </button>
        </Link>
        <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center'>
          <User className='text-gray-100 w-6 h-6' />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
          <div className='bg-blue-600 text-gray-100 p-4 rounded-t-lg'>
            <h2 className='text-xl font-bold'>Medical Profile</h2>
            <p className='text-blue-200'>
              Update your medical information and preferences
            </p>
          </div>
          <div className='space-y-6 p-4'>
            <div className='space-y-2'>
              <label
                htmlFor='medical-records'
                className='text-lg font-semibold block'>
                Upload Medical Records
              </label>
              <div className='flex items-center space-x-2'>
                <input
                  id='medical-records'
                  type='file'
                  onChange={handleFileUpload}
                  className='hidden'
                  accept='.pdf,.doc,.docx'
                />
                <button
                  type='button'
                  onClick={() =>
                    document.getElementById("medical-records").click()
                  }
                  className='bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded-md flex items-center'>
                  <Upload className='w-4 h-4 mr-2' />
                  Choose File
                </button>
                <span className='text-sm text-gray-400'>
                  {medicalRecords ? medicalRecords.name : "No file chosen"}
                </span>
              </div>
              <p className='text-xs text-gray-400'>
                Accepted formats: PDF, DOC, DOCX. Max size: 10MB
              </p>
            </div>

            <div className='space-y-2'>
              <label className='text-lg font-semibold block'>Allergies</label>
              <div className='grid grid-cols-2 gap-2'>
                {[
                  "Peanuts",
                  "Tree Nuts",
                  "Gluten",
                  "Dairy",
                  "Eggs",
                  "Soy",
                  "Fish",
                  "Shellfish",
                ].map((allergy) => (
                  <div key={allergy} className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id={`allergy-${allergy}`}
                      checked={allergies.includes(allergy)}
                      onChange={() => handleAllergyChange(allergy)}
                      className='rounded text-blue-500 focus:ring-blue-500 bg-gray-700 border-gray-600'
                    />
                    <label htmlFor={`allergy-${allergy}`}>{allergy}</label>
                  </div>
                ))}
              </div>
              <div className='flex items-center space-x-2 mt-2'>
                <input
                  type='checkbox'
                  id='allergy-other'
                  checked={allergies.includes("Other")}
                  onChange={() => handleAllergyChange("Other")}
                  className='rounded text-blue-500 focus:ring-blue-500 bg-gray-700 border-gray-600'
                />
                <label htmlFor='allergy-other'>Other:</label>
                <input
                  type='text'
                  value={otherAllergy}
                  onChange={(e) => setOtherAllergy(e.target.value)}
                  placeholder='Specify other allergy'
                  className='flex-grow bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-lg font-semibold block'>
                Diet Preference
              </label>
              <div className='space-y-2'>
                {[
                  "None",
                  "Vegetarian",
                  "Vegan",
                  "Keto",
                  "Paleo",
                  "Low-FODMAP",
                  "Gluten-Free",
                ].map((diet) => (
                  <div key={diet} className='flex items-center space-x-2'>
                    <input
                      type='radio'
                      id={`diet-${diet}`}
                      name='diet'
                      value={diet}
                      checked={dietPreference === diet}
                      onChange={(e) => setDietPreference(e.target.value)}
                      className='text-blue-500 focus:ring-blue-500 bg-gray-700 border-gray-600'
                    />
                    <label htmlFor={`diet-${diet}`}>{diet}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='additional-info'
                className='text-lg font-semibold block'>
                Additional Information
              </label>
              <textarea
                id='additional-info'
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder='Any other relevant health information or dietary restrictions...'
                className='w-full h-24 bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100'
              />
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='share-data'
                checked={shareData}
                onChange={(e) => setShareData(e.target.checked)}
                className='rounded text-blue-500 focus:ring-blue-500 bg-gray-700 border-gray-600'
              />
              <label htmlFor='share-data' className='flex items-center'>
                I agree to share my medical data for personalized
                recommendations
                <div className='relative ml-1 group'>
                  <Info className='w-4 h-4 text-blue-400' />
                  <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-700 text-gray-100 text-xs rounded py-1 px-2 hidden group-hover:block w-48'>
                    Your data will be used to provide personalized dietary
                    recommendations and allergen warnings.
                  </div>
                </div>
              </label>
            </div>
          </div>
          <div className='flex justify-between p-4 bg-gray-700'>
            <button
              type='button'
              className='px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-600 text-gray-100'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-green-600 text-gray-100 rounded-md hover:bg-green-700'>
              Save Profile
            </button>
          </div>
        </div>
      </form>

      <div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
        <div className='p-4'>
          <h3 className='text-lg font-semibold text-blue-400 flex items-center'>
            <AlertTriangle className='w-5 h-5 mr-2 text-yellow-500' />
            Privacy Notice
          </h3>
          <p className='text-sm text-gray-300 mb-2'>
            Your privacy is our top priority. Here's how we handle your
            sensitive medical information:
          </p>
          <ul className='list-disc list-inside text-sm text-gray-300 space-y-1'>
            <li>All data is encrypted and stored securely.</li>
            <li>
              Your information is never sold or shared with third parties.
            </li>
            <li>You can request deletion of your data at any time.</li>
            <li>We comply with HIPAA and GDPR regulations.</li>
          </ul>
          <p className='text-sm text-gray-300 mt-2'>
            By submitting this form, you agree to our{" "}
            <a href='#' className='text-blue-400 hover:underline'>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href='#' className='text-blue-400 hover:underline'>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalProfilePage;
