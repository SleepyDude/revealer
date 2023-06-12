import React, { FormEventHandler } from "react";
import './loginForm.css';
import type { User } from "../../types";

type Props = {
  onSubmit: (target: {username: string, roomNum: number}) => void
}

interface FormElements extends HTMLFormControlsCollection {
  usernameInput: HTMLInputElement,
  roomInput: HTMLInputElement,
}
interface UsernameFormElement extends HTMLFormElement {
  readonly elements: FormElements
} 

export function LoginForm(props: Props) {

  function handleSubmit(event: React.FormEvent<UsernameFormElement>) {
    event.preventDefault();
    const elements = event.currentTarget.elements;
    props.onSubmit({ 
      username: elements.usernameInput.value,
      roomNum: +elements.roomInput.value,
    });
  }

  return (
    <div>
      {/* <form className="login-form" onSubmit={(e) => { e.preventDefault(); login(e); }}> */}
      <form className="login-form"
        onSubmit = {handleSubmit}
      >
        <label>Input your name</label>
        <input className="login-input" id="usernameInput" autoFocus={true} type="text" />
        <label>Input Room number</label>
        <input className="login-input" id="roomInput" type="number" />
        <button type="submit">Enter</button>
      </form> 
    </div>
  );
}
