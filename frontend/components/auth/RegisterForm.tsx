"use client";


import { useState } from "react";
import Link from "next/link";

import LoginButton from "./LoginButton";
import LoginInput from "./LoginInput";



export default function RegisterForm(){


    const [formData, setFormData] = useState({

        name: "",
        email: "",
        password: "",
        confirmPassword: ""

    });



    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {


        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });


    }



    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

        e.preventDefault();


        console.log(formData);

    }



    return (

        <section className="flex min-h-screen items-center justify-center bg-slate-950 px-8 py-10">


            <div className="w-full max-w-md">


                <h2 className="text-4xl font-black text-white">
                    Crear cuenta
                </h2>


                <p className="mt-2 text-slate-400">
                    Regístrate para comenzar tu aprendizaje.
                </p>



                <form

                    onSubmit={handleSubmit}

                    className="mt-10 space-y-6"

                >


                    <LoginInput

                        label="Nombre completo"

                        name="name"

                        type="text"

                        placeholder="Axel Mendoza"

                        value={formData.name}

                        onChange={handleChange}

                    />



                    <LoginInput

                        label="Correo electrónico"

                        name="email"

                        type="email"

                        placeholder="correo@email.com"

                        value={formData.email}

                        onChange={handleChange}

                    />



                    <LoginInput

                        label="Contraseña"

                        name="password"

                        type="password"

                        placeholder="********"

                        value={formData.password}

                        onChange={handleChange}

                    />



                    <LoginInput

                        label="Confirmar contraseña"

                        name="confirmPassword"

                        type="password"

                        placeholder="********"

                        value={formData.confirmPassword}

                        onChange={handleChange}

                    />



                    <LoginButton />


                </form>



                <p className="mt-8 text-center text-slate-400">


                    ¿Ya tienes una cuenta?{" "}


                    <Link

                        href="/login"

                        className="font-semibold text-cyan-400 hover:text-cyan-300"

                    >

                        Iniciar sesión

                    </Link>


                </p>



            </div>


        </section>

    );

}