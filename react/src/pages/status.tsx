type StatusProps = {};

const Status = (props: StatusProps) => {
  return (
    <div>
      <h1>Status</h1>
      <code>{JSON.stringify(props, null, 2)}</code>
    </div>
  );
};

export default Status;
