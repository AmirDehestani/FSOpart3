const Message = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  const color =
    type === 'success' ? 'green' : type === 'error' ? 'red' : 'orange';
  const messageStyle = {
    color: color,
    background: 'rgb(220, 220, 220)',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    marginTop: 15,
    width: 'fit-content',
  };

  return <div style={messageStyle}>{message}</div>;
};

export default Message;
