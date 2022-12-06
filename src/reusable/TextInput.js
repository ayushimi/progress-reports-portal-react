export default function TextInput(props) {
  console.log(props.maxDate)
  return (
    <>
      <label htmlFor={props.id} className="form-label">
        <div className={"question-title " + (props.required ? "required" : "")}>{props.label}</div>
        <div className="question-description">{props.description}</div>
      </label>
      <br />
      <input
        type={props.type}
        className="form-control"
        id={props.id}
        value={props.value}
        max={props.maxDate ? props.maxDate : undefined}
        onChange={(event) => {
          props.onChange(event.target.value);
        }}
        defaultValue={props.defaultValue}
      />
    </>
  );
}