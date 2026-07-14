"use client";


interface LoginInputProps {

    label: string;
    type: string;
    placeholder: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

}



export default function LoginInput({

    label,
    type,
    placeholder,
    name,
    value,
    onChange

}: LoginInputProps) {


    return (

        <div className="space-y-2">


            <label className="text-sm text-slate-300">
                {label}
            </label>


            <input

                name={name}
                value={value}
                onChange={onChange}

                type={type}

                placeholder={placeholder}

                className="
                    w-full 
                    rounded-xl 
                    bg-white/10 
                    px-4 
                    py-3 
                    text-white 
                    outline-none 
                    ring-1 
                    ring-white/20 
                    focus:ring-cyan-400
                "

            />


        </div>

    );

}