export default function Textarea(props) {
  return (
    <>
      <label htmlFor={props.id} className="form-label">
        <div className="question-title">{props.label}</div>
        <div className="question-description">{props.description}</div>
      </label>
      <textarea
        className="form-control"
        id={props.id}
        rows="3"
        value={props.value}
        onChange={(event) => {
          props.onChange(event.target.value);
        }}
      />
    </>
  );
}