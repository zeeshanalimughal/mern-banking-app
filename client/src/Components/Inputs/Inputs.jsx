import React from 'react'

const Inputs = ({ placeHolder, type, setState, setError, disabled = false }) => {
  return (
    <>
      <div className="input-group mb-3  ">
        <input
          onChange={(e) => {
            setState(e?.target?.value)
            setError(false)
          }}
          type={type}
          className="form-control"
          placeholder={placeHolder}
          aria-label="Username"
          aria-describedby="basic-addon1" disabled={disabled} required />
      </div>
    </>
  )
}

export default Inputs