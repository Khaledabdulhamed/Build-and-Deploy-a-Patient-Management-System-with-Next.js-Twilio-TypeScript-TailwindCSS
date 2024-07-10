"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {  Form, FormControl} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import { useState } from "react"
import SubmitButton from "../ui/SubmitButton"
import { userFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { GenderOptions } from "@/constants"


const RegisterForm=({user}: {user: User}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

  // 1. Define your form.
  const form = useForm<z.infer<typeof userFormValidation>>({
    resolver: zodResolver(userFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit({name, email , phone}: z.infer<typeof userFormValidation>) {
   setIsLoading(true)

   try {
    const userData = {name, email , phone}

    const user = await createUser(userData)
    if(user) router.push(`/patients/${user.id}/register`)
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

     
      <SubmitButton isLoading={isLoading}>
        Get Started
      </SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm