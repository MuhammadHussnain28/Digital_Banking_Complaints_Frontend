import { useId  , forwardRef } from "react"


function Input(
    {
    label ,
    type = "text" ,
    className = "" ,
    ...props
    } , ref ){

    const id = useId() ;
    // console.log("id: " , id)

  return (
    <div className="w-full">

        {label && 
            <label htmlFor={id} className="inline-block mb-1 pl-1 text-black">
                {label}
            </label>
        }

    {/* px-3 py-2 rounded-lg text-black outline-none duration-200 w-full border border[#1B4AC1] */}
        <input type={type} ref={ref} id={id} {...props} className={`px-3 py-2 rounded-lg text-black duration-200 w-full border ${className}`} />

        

    </div>
  )
}

export default forwardRef(Input);