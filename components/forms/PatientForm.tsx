"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {  Form} from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import { useState } from "react"
import SubmitButton from "../ui/SubmitButton"
import { userFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER='datePicker',
    SELECT='select',
    SKELETON='skeleton',
}
 

 
const PatientForm=() => {
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

  const onSubmit = async (values: z.infer<typeof userFormValidation>) => {
    setIsLoading(true);
 
  // 2. Define a submit handler.
  // async function onSubmit({name, email , phone}: z.infer<typeof userFormValidation>) {
  //  setIsLoading(true)

   try {

    const user = {
      name: values.name,
      email: values.email,
      phone: values.phone,
    };

    const newUser = await createUser(user);

    // const userData = {name, email , phone}

    // const user = await createUser(userData)
    if(newUser) router.push(`/patients/${newUser.id}/register`)
   } catch (error) {
    console.log(error)
   }
   setIsLoading(false)
  }
  return (

    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi there 👋</h1>
            <p className="text-dark-700">Schedule your first appointment</p>
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

      <SubmitButton isLoading={isLoading}>
        Get Started
      </SubmitButton>
    </form>
  </Form>
  )
}

export default PatientForm