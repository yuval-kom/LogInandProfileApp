import "./profile.css";
import { useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateEmail,
  updatePassword,
  signOut,
} from "firebase/auth";
import { useState } from "react/cjs/react.development";
import { Timestamp } from "firebase/firestore";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Profile() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm();
  const [isSameData, setIsSameData] = useState(true); //for UseEffect, change when create new user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState(new Date(""));
  const [updateMode, setUpdateMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [ChangePass, setChangePass] = useState(false);
  const [ChangeEmail, setChangeEmail] = useState(false);
  const navigateTo = useNavigate();

  //happens only when new user logged-in (at login page | after createUserWithEmailAndPassword)
  useEffect(() => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const getUserData = async () => {
      try {
        console.log("in");
        const userRef = await getDoc(docRef);
        if (userRef.exists) {
          setName(userRef.data().name);
          setEmail(userRef.data().email);
          setAddress(userRef.data().address);
          setPassword(userRef.data().password);
          setBirthDate(userRef.data().birthDate.toDate());
        }
      } catch (err) {
        console.log("error at getDoc" + err);
      }
    };
    getUserData();
  }, [isSameData]);

  const onSubmit = (data) => {
    if (updateMode) {
      updateUserData(data);
    } else if (createMode) {
      createNewUser(data);
    }
  };

  //creat user on firebase authentication and add new user to users collection
  const createNewUser = async (data) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      try {
        var userRef = collection(db, "users");
        //set new user doc with the same id from firebase authentication
        await setDoc(doc(userRef, user.uid), {
          address: data.address,
          email: data.email,
          name: data.name,
          password: data.password,
          birthDate: Timestamp.fromDate(data.birthDate),
        });
        setCreateMode(false);
        setIsSameData(!isSameData);
      } catch (err) {
        console.log("error at creat user doc");
      }
    } catch (err) {
      console.log("error at creat user auth");
    }
  };

  const updateUserData = async (data) => {
    //when in update mode there is no value at data.birthDate from <Controller> so need to set to birthDate who change on onChange
    data.birthDate = birthDate;
    const docToUpdate = doc(db, "users", auth.currentUser.uid);
    try {
      await updateDoc(docToUpdate, data);
      //if password or email changed, need to update the firebase authentication
      if (ChangePass) {
        updateUserPassAuth();
        setChangePass(false);
      }
      if (ChangeEmail) {
        updateUserEmailAuth();
        setChangeEmail(false);
      }
      setUpdateMode(false);
    } catch (err) {
      console.log("error at updateDoc");
    }
  };

  function updateUserPassAuth() {
    updatePassword(auth.currentUser, password)
      .then(() => console.log("Update pass successful"))
      .catch((err) => console.log("error at update pass"));
  }
  function updateUserEmailAuth() {
    updateEmail(auth.currentUser, email)
      .then(() => console.log("Update pass successful"))
      .catch((err) => console.log("error at update pass"));
  }

  function deleteUserAuth() {
    deleteUser(auth.currentUser)
      .then(() => {})
      .catch((err) => {
        console.log("error at delete user");
      });
    //go to login page
    navigateTo("/");
  }
  const deleteUserDoc = async () => {
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      deleteUserAuth();
    } catch (err) {
      console.log("error ad delete user doc");
    }
  };

  function logoutHandle() {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful");
      })
      .catch((err) => {
        console.log("error at sign-out");
      });
    //go to login page
    navigateTo("/");
  }

  //react-hook-form only on updateMode || createMode
  return (
    <div className="profile">
      <div className="profileTitle">
        {updateMode ? (
          <label>Update Profile</label>
        ) : createMode ? (
          <label>Creat New User</label>
        ) : (
          <label>Profile</label>
        )}
      </div>
      <div className="profileForm">
        <form onSubmit={handleSubmit(onSubmit)} className="userDataForm">
          <div>
            <div className="dataLabel">
              <label className="labelText">Name: </label>
            </div>
            <div className="dataInput">
              {updateMode || createMode ? (
                <div>
                  <input
                    className="specificData"
                    {...register("name", { required: true })}
                    placeholder="Name"
                    {...(updateMode ? { value: name } : {})}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <span className="errorText">
                    {errors.name && "name is required"}
                  </span>
                </div>
              ) : (
                <span className="infoText">{name}</span>
              )}
            </div>
          </div>
          <div>
            <div className="dataLabel">
              <label className="labelText">Email: </label>
            </div>
            <div className="dataInput">
              {updateMode || createMode ? (
                <div>
                  <input
                    className="specificData"
                    {...register("email", {
                      pattern:
                        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
                    })}
                    placeholder="Email"
                    {...(updateMode ? { value: email } : {})}
                    onChange={(e) => {
                      setError("email", {
                        types: { pattern: "not valid email" },
                      });
                      setEmail(e.target.value);
                      setChangeEmail(true);
                    }}
                  />
                  <span className="errorText">
                    {errors.email && "email not valid"}
                  </span>
                </div>
              ) : (
                <span className="infoText">{email}</span>
              )}
            </div>
          </div>
          <div>
            <div className="dataLabel">
              <label className="labelText">Address: </label>
            </div>
            <div className="dataInput">
              {updateMode || createMode ? (
                <div>
                  <input
                    className="specificData"
                    {...register("address", { required: true })}
                    placeholder="Address"
                    {...(updateMode ? { value: address } : {})}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <span className="errorText">
                    {errors.address && "address  is required"}
                  </span>
                </div>
              ) : (
                <span className="infoText">{address}</span>
              )}
            </div>
          </div>
          <div>
            <div className="dataLabel">
              <label className="labelText">Birth Date: </label>
            </div>
            <div className="dataInput">
              {updateMode || createMode ? (
                <Controller
                  className="specificData"
                  control={control}
                  name="birthDate"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <ReactDatePicker
                      className="dateInput"
                      onChange={updateMode ? (e) => setBirthDate(e) : onChange}
                      onBlur={onBlur}
                      placeholderText="click to choose date"
                      selected={updateMode ? birthDate : value}
                    />
                  )}
                />
              ) : (
                <span className="infoText">
                  {birthDate.getMonth() + 1}/{birthDate.getDate()}/
                  {birthDate.getFullYear()}
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="dataLabel">
              <label className="labelText">Password: </label>
            </div>
            <div className="dataInput">
              {updateMode || createMode ? (
                <div>
                  <input
                    className="specificData"
                    {...register("password", {
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    })}
                    placeholder="Password"
                    {...(updateMode ? { value: password } : {})}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setChangePass(true);
                    }}
                  />
                  <span className="errorText">
                    {errors.password && "password  is not valid"}
                  </span>
                </div>
              ) : (
                <span className="infoText">{password}</span>
              )}
            </div>
          </div>
          <div>
            {updateMode || createMode ? (
              <input className="formButton" type="submit" value="Submit" />
            ) : (
              <div>
                <button
                  className="formButton"
                  onClick={() => {
                    setUpdateMode(true);
                  }}
                >
                  Update
                </button>
                <button
                  className="formButton"
                  onClick={() => {
                    setCreateMode(true);
                    //reset form filed
                    reset();
                  }}
                >
                  Create new user
                </button>
                <button
                  className="formButton"
                  onClick={() => {
                    deleteUserDoc();
                  }}
                >
                  Delete user
                </button>
                <button
                  className="formButton"
                  onClick={() => {
                    logoutHandle();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
