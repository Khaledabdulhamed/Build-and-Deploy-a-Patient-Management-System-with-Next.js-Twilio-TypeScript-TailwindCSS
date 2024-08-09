"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {  Form, FormControl} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import { useState } from "react"
import SubmitButton from "../ui/SubmitButton"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser, registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { SelectItem } from "@radix-ui/react-select"
import Image from "next/image"
import FileUploader from "../FileUploader"


const RegisterForm=({user}: {user: User}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
   setIsLoading(true)

   let formData;

   if (values.identificationDocument && values.identificationDocument.length > 0) {
     const blobFile = new Blob([values.identificationDocument[0]], {
       type: values.identificationDocument[0].type,
     })

     formData = new FormData();
    //@ts-ignore
     FormData.append('blobFile', blobFile);
     //@ts-ignore
     FormData.append('filename', values.identificationDocument[0].name)
   }
   try {
   const patientData = {
    ...values,
    userId: user.$id,
    birthDate: new Date(values.birthDate),
    IdentificationDocument: formData,
   }
   //@ts-ignore
   const patient = await registerPatient(patientData);
   } catch (error) {
    console.log(error)
   }
  }
  return (

    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1"> 
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormField
        fieldType = {FormFieldType.INPUT}
         control={form.control}
         name="name"
         label= "Full Name"
         placeholder = "John Doe"
         iconSrc= "/assets/icons/user.svg"
         iconAlt="user"    
         />
        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType = {FormFieldType.INPUT}
         control={form.control}
         name="email"
         label= "Email"
         placeholder = "John.Doe@us.com"
         iconSrc= "/assets/icons/email.svg"
         iconAlt="email"    
         />
           <CustomFormField
        fieldType = {FormFieldType.PHONE_INPUT}
         control={form.control}
         name="phone"
         label= "Phone Number"
         placeholder = "862-379-8312"
       
         />
         </div>

         <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType = {FormFieldType.DATE_PICKER}
         control={form.control}
         name="birthDate"
         label= "Date of Birth"
            
         />
           <CustomFormField
        fieldType = {FormFieldType.SKELETON}
         control={form.control}
         name="gender"
         label= "Gender"
         renderSkeleton={(field) => (
          <FormControl>
            <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange} defaultValue={field.value}>
              {GenderOptions.map((option) => (
                <div key={option} className="radio-group">
                  <RadioGroupItem value={option} id={option} />
                  <label htmlFor={option} className="cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
         )}
       
         />
         </div>

       

<div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType = {FormFieldType.INPUT}
         control={form.control}
         name="address"
         label= "address"
         placeholder = "460 s main st"
          
         />
           <CustomFormField
        fieldType = {FormFieldType.PHONE_INPUT}
         control={form.control}
         name="occupation"
         label= "occupation"
         placeholder = "Web Developer"
       
         />
         </div>

         <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType = {FormFieldType.INPUT}
         control={form.control}
         name="emergencyContactName"
         label= "emergency Contact Name"
         placeholder = "Guardian's name"
   
         />
           <CustomFormField
        fieldType = {FormFieldType.PHONE_INPUT}
         control={form.control}
         name="emergencyContactNumber"
         label= "emergency Contact Number"
         placeholder = "862-379-8312"
       
         />
         </div>

           <section className="space-y-6">
          <div className="mb-9 space-y-1"> 
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <CustomFormField
        fieldType = {FormFieldType.SELECT}
         control={form.control}
         name="primaryPhysician"
         label= "primary Physician"
         placeholder = "select a Physician"
       
         >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
              <Image
              src={doctor.image}
              width={32}
              height={32}
              alt={doctor.name}
              className="rounded-full border border-dark-500"/>
              <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
         </CustomFormField>

         <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType = {FormFieldType.INPUT}
         control={form.control}
         name="insuranceProvider"
         label= "insurance Provider"
         placeholder = "BlueCross"
          
         />
           <CustomFormField
        fieldType = {FormFieldType.PHONE_INPUT}
         control={form.control}
         name="insurancePolicyNumber"
         label= "insurance Policy Number"
         placeholder = "ABC123456789"
       
         />
         </div>

         <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType = {FormFieldType.TEXTAREA}
         control={form.control}
         name="allergies"
         label= "allergies (if any)"
         placeholder = "Peanuts, Pollen"
          
         />
           <CustomFormField
        fieldType = {FormFieldType.TEXTAREA}
         control={form.control}
         name="currentMedication"
         label= "current Medication"
         placeholder = "Ibuprofen 200mg, Paracetamol 500mg"
       
         />
         </div>

         <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField
        fieldType = {FormFieldType.TEXTAREA}
         control={form.control}
         name="familyMedicalHistory"
         label= "family Medical History"
         placeholder = "Mother had brain cancer, father had heart disease"
          
         />
           <CustomFormField
        fieldType = {FormFieldType.TEXTAREA}
         control={form.control}
         name="pastMedicalHistory"
         label= "past Medical History"
         placeholder = "Appendectomy, Tonsillectomy"
       
         />
         </div>

         <section className="space-y-6">
          <div className="mb-9 space-y-1"> 
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>
         </section>


         <CustomFormField
        fieldType = {FormFieldType.SELECT}
         control={form.control}
         name="identificationType"
         label= "identification Type"
         placeholder = "select an identification type"
       
         >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
         </CustomFormField>

         <CustomFormField
        fieldType = {FormFieldType.INPUT}
         control={form.control}
         name="identificationNumber"
         label= "identificationNumber"
         placeholder = "123456789"
         />

        <CustomFormField
        fieldType = {FormFieldType.SKELETON}
         control={form.control}
         name="identificationDocument"
         label= "Scanned copy of identification document"
         renderSkeleton={(field) => (          
     <FormControl>
      <FileUploader files={field.value} onChange={field.onChange} />
     </FormControl>
         )}
       
         />

        <section className="space-y-6">
          <div className="mb-9 space-y-1"> 
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
         </section>

         <CustomFormField
         fieldType={FormFieldType.CHECKBOX}
         control={form.control}
         name="treatmentConsent"
         label="I consent to treatment"
         />
         <CustomFormField
         fieldType={FormFieldType.CHECKBOX}
         control={form.control}
         name="privacyConsent"
         label="I consent to Privacy Policy"
         />
         <CustomFormField
         fieldType={FormFieldType.CHECKBOX}
         control={form.control}
         name="treatmentConsent"
         label="I consent to treatment"
         />

          <section className="space-y-6">
          <div className="mb-9 space-y-1"> 
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
         </section>
         
         <CustomFormField
         fieldType={FormFieldType.CHECKBOX}
         control={form.control}
         name="TreatmentConsent"
         label="I consent to treatment"
         />
        
        <CustomFormField
         fieldType={FormFieldType.CHECKBOX}
         control={form.control}
         name="disclosureConsent"
         label="I consent to disclouse information"
         />

        <CustomFormField
         fieldType={FormFieldType.CHECKBOX}
         control={form.control}
         name="privacyConsent"
         label="I disclouse to privacy policy"
         />
      <SubmitButton isLoading={isLoading}>
        Get Started
      </SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm