import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./signup.module.css";
import { supabaseClient } from "../../utils";

// type SignupFormState = {
//   email: string
//   password: string
// }

// export default function Signup() {
//   const [signupForm, setSignupForm] = useState<SignupFormState>({
//     email: '',
//     password: '',
//   })
//   const router = useRouter()

//   async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault()

//     const { email, password } = signupForm

//     const { error } = await supabaseClient.auth.signUp({
//       email,
//       password,
//     })

//     if (error) {
//       console.error('Error signing up:', error.message)
//     } else {
//       router.push('/dashboard')
//     }
//   }

//   function handleSignupFormChange(
//     event: React.ChangeEvent<HTMLInputElement>
//   ) {
//     setSignupForm((prevFormState) => ({
//       ...prevFormState,
//       [event.target.name]: event.target.value,
//     }))
//   }

//   return (

//     <div className={styles.signup}>
//       <div className={styles.signup__box}>
//       <h1>Sign up for Budget Tool</h1>
//       <form onSubmit={handleSignup}>
//         <label>
//           Email:
//           <input
//             type="email"
//             name="email"
//             value={signupForm.email}
//             onChange={handleSignupFormChange}
//           />
//         </label>
//         <br />
//         <label>
//           Password:
//           <input
//             type="password"
//             name="password"
//             value={signupForm.password}
//             onChange={handleSignupFormChange}
//           />
//         </label>
//         <br />
//         <button type="submit">Sign up</button>
//       </form>

//       </div>
//     </div>
//   )
// }

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //   const handleSignup = async () => {
  //     try {
  //       const { data, error } = await supabaseClient.auth.signUp({
  //         email,
  //         password,
  //       });
  //       if (error) throw error;
  //       console.log(data);
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };
  const router = useRouter();

  async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // const { email, password } = signupForm

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    } else {
      router.push("/incomes");
    }
  }

  return (
    <div className={styles.signup}>
      <div className={styles.signup__box}>
        <h2 className={styles.signup__label}>Signup</h2>
        <form onSubmit={handleSignup} className={styles.signup__form}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className={styles.signup__error}>
              <strong>{error}</strong>
            </p>
          )}
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
