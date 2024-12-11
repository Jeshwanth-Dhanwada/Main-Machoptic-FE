import React, { useEffect, useState, useContext } from "react";
import AuthContext from '../context/AuthProvider'

function Userprofile({onclickclose}) {
 const {auth, setAuth} = useContext(AuthContext)
  
  const HandleClose = () => {
    onclickclose("close")
    console.log("close")
  }
  console.log(auth,"auth")
  return (
    <div>
      {/* <section className="" style={{ backgroundColor: "#f4f5f7",width:'100%',height:'100px'}}>
      <div className="container py-1" style={{width:'100%',height:'100%'}}>
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-6 mb-4 mb-lg-0"> */}
            <div className="card mb-3" style={{ borderRadius: ".5rem",width:'500px'}}>
              <div style={{position:'absolute',top:'0px',right:'5px',fontSize:'x-large',color:'red'}}>
                    <button className='btn btn-danger btn-sm' onClick={HandleClose}>&times;</button></div>
              <div className="row g-0">
                <div
                  className="col-md-4 gradient-custom text-center text-white"
                  style={{
                    borderTopLeftRadius: ".5rem",
                    borderBottomLeftRadius: ".5rem"
                  }}
                >
                  <img
                    src="./profile.png"
                    alt="Avatar"
                    className="img-fluid my-5"
                    style={{ width: "80px" }}
                  />
                  <h5 className='text-dark'>{auth.username}</h5>
                  <p  className='text-dark'>{auth.designation}</p>
                  <i className="far fa-edit mb-5 text-dark"></i>
                </div>
                <div className="col-md-8">
                  <div className="card-body p-4">
                    <h6>User Details</h6>
                    <hr className="mt-0 mb-4" />
                    <div className="row pt-1">
                      <div className="col-12 mb-3">
                        <h6>Email</h6>
                        <p className="text-muted">Ramesh@example.com</p>
                      </div>
                      <div className="col-12 mb-3">
                        <h6>Phone</h6>
                        <p className="text-muted">7674091822</p>
                      </div>
                    </div>
                    <h6>Credentials</h6>
                    <hr className="mt-0 mb-4" />
                    <div className="row pt-1">
                      <div className="col-6 mb-3">
                        <h6>UserName</h6>
                        <p className="text-muted">{auth.username}</p>
                      </div>
                      <div className="col-6 mb-3">
                        <h6>Password</h6>
                        <p className="text-muted">{auth.password}</p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-start text-danger">
                      <a href="#!">
                        <i className="fab fa-facebook-f fa-lg me-3"></i>
                      </a>
                      <a href="#!">
                        <i className="fab fa-twitter fa-lg me-3"></i>
                      </a>
                      <a href="#!">
                        <i className="fab fa-instagram fa-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/* </div>
        </div>
      </div>
    </section> */}
    </div>
  )
}

export default Userprofile
