import RadioButton from "./RadioButton";
import React from "react";
import { useState } from "react";

export default function RadioButtons2(props) {
  const [checked, setChecked] = useState("")
  return (
    <>
      {props.options.map((option,i) => {
        return (
          <RadioButton
            name={props.name}
            label={option.label}
            key={option.value}
            id={`${option.value}-radio`}
            value={option.value}
            checked={checked == option.value ? true : false}
            onChange={(val) => {
              setChecked(val)
            }}
          />
        );
      })}
    </>
  );
}