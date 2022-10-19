export default function TextInput(props) {

  return (
    <>
      <label htmlFor={props.id} className="form-label">
        <div className="question-title">{props.label}</div>
        <div className="question-description">{props.description}</div>
      </label>
      <br />
      <input
        type={props.type}
        className="form-control"
        id={props.id}
        value={props.value}
        onChange={(event) => {
          props.onChange(event.target.value);
        }}
      />
    </>
  );
}