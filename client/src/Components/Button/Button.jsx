import React from 'react'

const Button = ({ Name, onClick, loading }) => {
  return (
    <>
      <button onClick={onClick} type="button" className="button-secondary">
        {loading && <i class="fa fa-spinner fa-spin"></i>} &nbsp;
        {Name}
      </button>
    </>
  )
}

export default Button