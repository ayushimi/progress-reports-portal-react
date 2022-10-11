import RadioButton from "./RadioButton";

export default function RadioButtons(props) {
  return (
    <>
      {props.options.map((option) => {
        return (
          <RadioButton
            name={props.name}
            label={option.label}
            key={option.value}
            id={`${option.value}-radio`}
            value={option.value}
            checked={props.value === option.value}
            onChange={props.onChange}
          />
        );
      })}
    </>
  );
}