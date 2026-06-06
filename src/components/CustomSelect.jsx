// // import React from "react";
// // // import { Field, Label, Select } from "@headlessui/react";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectGroup,
// //   SelectItem,
// //   SelectLabel,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";

// // export default function CustomSelect({
// //   label,
// //   placeholder = "Select",
// //   options,
// //   error,
// //   register,
// //   className = "",
// //   disabled,
// //   onSpecSelect,
// //   ...rest
// // }) {
// //   const handleChange = (e) => {
// //     const selectedValue = e.target.value;

// //     // If onSpecSelect is provided and this is a spec selection
// //     if (onSpecSelect && options.length > 0 && options[0].doc) {
// //       const selectedSpec = options.find((opt) => opt.name === selectedValue);
// //       if (selectedSpec) {
// //         onSpecSelect(selectedSpec);
// //       }
// //     }

// //     // Call the original register onChange if it exists
// //     if (register?.onChange) {
// //       register.onChange(e);
// //     }
// //   };
// //   return (
// //     <Select>
// //       <SelectTrigger className="h-[48px] w-full">
// //         <SelectValue placeholder="Select a fruit" />
// //       </SelectTrigger>
// //       <SelectContent>
// //         <SelectGroup>
// //           <SelectLabel>Fruits</SelectLabel>
// //           <SelectItem value="apple">Apple</SelectItem>
// //           <SelectItem value="banana">Banana</SelectItem>
// //           <SelectItem value="blueberry">Blueberry</SelectItem>
// //           <SelectItem value="grapes">Grapes</SelectItem>
// //           <SelectItem value="pineapple">Pineapple</SelectItem>
// //         </SelectGroup>
// //       </SelectContent>
// //     </Select>
// //     // <Field className="">
// //     //   <Label className="flex flex-col items-start gap-1 text-[14px] font-light text-[#09032A]">
// //     //     {label}
// //     //     <div className="relative h-[48px] w-full rounded-[12px]">
// //     //       <Select
// //     //         // {...(register ? register : {})}
// //     //         {...(register
// //     //           ? { ...register, onChange: handleChange }
// //     //           : { onChange: handleChange })}
// //     //         className={`h-full rounded-[12px] border-none bg-[#F7F9FD] px-3 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 ${className} w-full`}
// //     //         {...rest}
// //     //         disabled={disabled}
// //     //       >
// //     //         <option value="" className="text-[#8791A7]">
// //     //           {placeholder}
// //     //         </option>
// //     //         {options.map((opt, index) => (
// //     //           <option
// //     //             key={opt.value || opt.name || index}
// //     //             value={opt.value || opt.name}
// //     //           >
// //     //             {opt.label || opt.name || opt.doc}
// //     //           </option>
// //     //         ))}
// //     //       </Select>
// //     //     </div>

// //     //     {error && <span className="text-xs text-red-500">{error}</span>}
// //     //   </Label>
// //     // </Field>
// //   );
// // }

// import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// export default function CustomSelect({
//   label,
//   placeholder = "Select",
//   options = [],
//   error,
//   register,
//   className = "",
//   disabled,
//   onSpecSelect,
//   ...rest
// }) {
//   const handleValueChange = (value) => {
//     // Handle spec select
//     if (onSpecSelect && options.length > 0 && options[0].doc) {
//       const selectedSpec = options.find(
//         (opt) => (opt.value || opt.name) === value,
//       );
//       if (selectedSpec) {
//         onSpecSelect(selectedSpec);
//       }
//     }

//     // React Hook Form integration
//     if (register?.onChange) {
//       register.onChange({
//         target: { value },
//       });
//     }
//   };

//   return (
//     <div className="flex w-full flex-col items-start gap-1 text-base">
//       {label && (
//         <label className="text-base font-light text-[#09032A]">{label}</label>
//       )}

//       <Select onValueChange={handleValueChange} disabled={disabled} {...rest}>
//         <SelectTrigger
//           className={`w-full rounded-[12px] border-2 border-none border-red-500 bg-[#F7F9FD] px-3 py-6 text-base text-[#09032A] focus:ring-0 focus:outline-none focus-visible:ring-0 ${className}`}
//         >
//           <SelectValue placeholder={placeholder} className="text-[#8791A7]" />
//         </SelectTrigger>

//         <SelectContent className="rounded-[12px] border-none bg-white shadow-md">
//           <SelectGroup>
//             {options.map((opt, index) => (
//               <SelectItem
//                 key={opt.value || opt.name || index}
//                 value={opt.value || opt.name}
//                 className="text-base text-[#09032A] focus:bg-[#F1F5FF] focus:text-[#09032A]"
//               >
//                 {opt.label || opt.name || opt.doc}
//               </SelectItem>
//             ))}
//           </SelectGroup>
//         </SelectContent>
//       </Select>

//       {error && <span className="mt-1 text-xs text-red-500">{error}</span>}
//     </div>
//   );
// }

export default function CustomSelect({
  label,
  placeholder = "Select",
  options = [],
  error,
  value,
  onChange,
  className = "",
  disabled,
  onSpecSelect,
}) {
  const handleValueChange = (val) => {
    if (onSpecSelect && options.length > 0 && options[0].doc) {
      const selectedSpec = options.find(
        (opt) => (opt.value || opt.name) === val,
      );
      if (selectedSpec) {
        onSpecSelect(selectedSpec);
      }
    }

    onChange?.(val); // IMPORTANT
  };

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className="text-base font-light text-[#09032A]">{label}</label>
      )}

      <Select
        value={value || undefined}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={`w-full truncate rounded-[12px] border-2 border-none border-red-500 bg-[#F7F9FD] px-3 py-6 text-base text-[#09032A] focus:ring-0 focus:outline-none focus-visible:ring-0 ${className}`}
        >
          <SelectValue placeholder={placeholder} className="truncate" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options.map((opt, index) => (
              <SelectItem
                key={opt.value || opt.name || index}
                value={opt.value || opt.name}
                className="truncate"
              >
                {opt.label || opt.name || opt.doc}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
