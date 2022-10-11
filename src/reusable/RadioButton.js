export default function RadioButton(props) {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name={props.name}
        id={props.id}
        value={props.value}
        checked={props.checked}
        onChange={(event) => {
          props.onChange(event.target.value);
        }}
      />
      <label
        className="form-check-label"
        htmlFor={`${props.value}-radio`}
      >
        {props.label}
      </label>
    </div>
  );
}