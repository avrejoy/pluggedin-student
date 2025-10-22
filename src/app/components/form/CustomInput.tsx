import { cn } from "@/app/utils/cn";
import React from "react";

const CustomInput = ({
    value,
    setValue,
    label,
    inputClass,
    labelClass,
    type,
    placeholder,
    disabled,
    notRequired,
    onBlurAction,
}: {
    value: string | number;
    setValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    type?: string;
    inputClass?: string;
    labelClass?: string;
    placeholder?: string;
    disabled?: boolean;
    notRequired?: boolean;
    onBlurAction?: () => void;
}) => {
    return (
        <React.Fragment>
            {label && (
                <label
                    className={cn(
                        "block text-navy-600 mb-1 text-sm font-gtwpro font-medium",
                        labelClass
                    )}
                    htmlFor={label ? label.replace(" ", "-").toLowerCase() : ""}
                >
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "w-full px-4 py-4 text-sm rounded-[15px] font-gtwpro font-normal placeholder:text-navy-600/70 border-[1.3px] border-navy-600/10 text-navy-600 focus:border-navy-600 focus:outline-none transition-colors duration-500 ease-in-out",
                    inputClass
                )}
                placeholder={placeholder ? placeholder : ""}
                value={value}
                onChange={(e) => setValue(e)}
                id={label ? label.replace(" ", "-").toLowerCase() : ""}
                type={type ? type : "text"}
                disabled={disabled}
                required={notRequired ? false : true}
                onBlur={onBlurAction ? onBlurAction : () => {}}
            />
        </React.Fragment>
    );
};

export default CustomInput;
