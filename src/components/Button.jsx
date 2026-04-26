import React from 'react'

function Button({
    children ,
    type = "button" ,
    bgColor="bg-[#1B4AC1]" ,
    textColor="text-white" ,
    className="border border-[#1B4AC1]" ,
    ...props
}) {
  return (
    <button type={type} className={`${bgColor} ${textColor} ${className}`} {...props}>{children}</button>
  )
}

export default Button