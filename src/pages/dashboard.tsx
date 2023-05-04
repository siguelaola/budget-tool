import React, { useEffect, useState } from "react";
import { supabase } from "../../utils";
import styles from "./dashboard.module.css";
import { useRouter } from "next/router";

// const Dashboard = () => {
// //   const [salary, setSalary] = useState("");
//   const [incomeFields, setIncomeFields] = useState([{ name: "", amount: "" }]);
//   const [expenseFields, setExpenseFields] = useState([{ name: "", amount: "" }]);

//   const handleIncomeFieldChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     // const newIncomeFields = [...incomeFields];
//     // newIncomeFields[index][e.target.name] = e.target.value;
//     const newIncomeFields = [...incomeFields];
//     const propertyName = e.target.name as ExpensePropertyName;
//     newIncomeFields[index][propertyName] = e.target.value;

//     setIncomeFields(newIncomeFields);
//   };

//   const handleExpenseFieldChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const newExpenses = [...expenseFields];
//     const propertyName = e.target.name as ExpensePropertyName;
//     newExpenses[index][propertyName] = e.target.value;

//     // newExpenses[index][e.target.name] = e.target.value;
//     setExpenseFields(newExpenses);
//   };

//   type ExpensePropertyName = 'name' | 'amount';

//   const handleAddIncomeField = () => {
//     setIncomeFields([...incomeFields, { name: "", amount: "" }]);
//   };

//   const handleAddExpenseField = () => {
//     setExpenseFields([...expenseFields, { name: "", amount: "" }]);
//   };

//   const handleSave = async () => {
//     // Save income fields to Supabase
//     const incomeData = incomeFields.map((field) => ({ name: field.name, amount: parseInt(field.amount) }));
//     const { error: incomeError } = await supabase.from("incomes").insert(incomeData);
//     if (incomeError) {
//       console.error("Error saving income fields:", incomeError);
//       return;
//     }

//     // Save expense fields to Supabase
//     const expenseData = expenseFields.map((field) => ({ name: field.name, amount: parseInt(field.amount) }));
//     const { error: expenseError } = await supabase.from("expenses").insert(expenseData);
//     if (expenseError) {
//       console.error("Error saving expense fields:", expenseError);
//       return;
//     }

//     console.log("Data saved successfully!");
//   };

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     try {
// //     //   const { user } = await supabase.auth.signUp({
// //     //     email: "example@email.com",
// //     //     password: "password",
// //     //   });
// //     //   if (user) {
// //         // const { data: incomeData, error: incomeError } = await 
// //         //   .from("income")
// //         //   .insert({ salary });
// //         // if (incomeError) {
// //         //   throw incomeError;
// //         // }

// //         const expensesData = expenses.map(({ name, amount }) => ({
// //           name,
// //           amount: Number(amount),
// //         }));
// //         const { error: expensesError } = await 
// //           .from("expenses")
// //           .insert(expensesData);
// //         if (expensesError) {
// //           throw expensesError;
// //         }

// //         console.log("Data saved successfully!");
// //     //   }
// //     } catch (error) {
// //       console.log(error.message);
// //     }
// //   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>Budget Calculator</h1>
//       <form className={styles.form} onSubmit={handleSubmit}>
//         <div className={styles.section}>
//           <h2>Step 1: Define Your Income and Expenses</h2>
//           <div className={styles.field}>
//             <label htmlFor="salary">Salary</label>
//             <input
//               type="number"
//               id="salary"
//               value={salary}
//               onChange={handleChangeSalary}
//             />
//           </div>
//           <div className={styles.expenses}>
//             <h3>Expenses</h3>
//             {expenses.map((expense, index) => (
//               <div className={styles.field} key={index}>
//                 <input
//                   type="text"
//                   placeholder="Expense name"
//                   name="name"
//                   value={expense.name}
//                   onChange={(e) => handleChangeExpenses(e, index)}
//                 />
//                 <input
//                   type="number"
//                   placeholder="Amount"
//                   name="amount"
//                   value={expense.amount}
//                   onChange={(e) => handleChangeExpenses(e, index)}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//         <button className={styles.button} type="submit">
//           Continue
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Dashboard;

type Income = {
  name: string;
  amount: number;
};

type Expense = {
    id: string;
  name: string;
  amount: number;
  category: string;
};

const Dashboard = () => {

    const router = useRouter();

    const check_if_logged = async () => {
        const response = await supabase.auth.getUser();
        // console.log("user: ", response);

        if (response.error !== null) {
            //Normally we should log him out
            // router.replace("/signup")
            // throw "Error"

            const { data, error } = await supabase.auth.signInWithPassword({
                email: "alex@valid.com",
                password: "123123",
              });
        };
    }

    useEffect(() => {
        async function fetchData() {
          try {
            
            await check_if_logged()
    
            // Fetch categories
            const { data, error } = await 
              .from('categories')
              .select('id, name')

            console.log(data);
    
     
            } catch (error) {
                console.error(error);
              }
            }
        
            fetchData();
          }, []);

  const [income, setIncome] = useState<Income[]>([
    { name: "Salario", amount: 0 },
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '01', name: 'Renta / Mortgage', amount: 0, category: 'Renta/Mortgage' },
  ]);

  const handleAddIncome = () => {
    setIncome([...income, { name: "", amount: 0 }]);
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { name: "", amount: 0, category: "" }]);
  };

  type ExpensePropertyName = "name" | "amount";

  const handleIncomeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    name: string
  ) => {
    // const handleIncomeChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newIncome = [...income];
    //   console.log(e.target.value)
    //   console.log(name)
    const propertyName = name as ExpensePropertyName;
    //   newIncome[index][propertyName] = e.target.value;
    newIncome[index][propertyName] = e.target.value;
    // console.log(newIncome)
    setIncome(newIncome);
  };

  const handleExpenseChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    name: string
  ) => {
    const newExpenses = [...expenses];
    const propertyName = name as ExpensePropertyName;
    newExpenses[index][propertyName] = e.target.value;
    setExpenses(newExpenses);
  };

  const handleSubmit = async () => {
    try {
      const user = .auth.getUser();
      if (!user) throw new Error("User not logged in");

      //   const { data: incomesData, error: incomesError } = await 
      //     .from("incomes")
      //     .insert([{ user_id: (await user).data.user?.id, amount: income }]);

      //   if (incomesError) throw incomesError;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: "alex@test.com",
        password: "123123",
      });

      console.log(data);

      const session = .auth.getSession();
      const id = (await session).data.session?.user.id;

      console.log(user);
      console.log(session);

      if (id === null) {
        return;
      }

      const { data: expensesData, error: expensesError } = await 
        .from("expenses")
        .insert(
          expenses.map((expense) => ({
            user_id: id,
            name: expense.name,
            amount: expense.amount,
          }))
        );

      if (expensesError) throw expensesError;

      //   console.log(incomesData, expensesData);
    } catch (error) {
      //   console.log(error.message);
      //   setError(error.message);
    }
  };

  const handleSaveData = async () => {
    try {
      const response = .auth.getUser();

      let id = (await response).data.user?.id;
      console.log("id: ", id)

      if (id === undefined) {
        console.log("sign in")
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "alex@valid.com",
          password: "123123",
        });

        id = (await data).user?.id
      }

      
      console.log("id: ", id)

    //   console.log(response);
      // console.log(session)

      const incomeData = income.map((inc) => ({ ...inc, user_id: id }));
      const expenseData = expenses.map((exp) => ({ ...exp, user_id: id }));
      
    //   const data = [
    //     { user_id: 1, field1: 20, field2: 30 },
    //     { user_id: 2, field1: 10, field3: 50 },
    //     { user_id: 3, field2: 40, field4: 60 },
    //     // and so on
    //   ];

    console.log(incomeData)

// const { data: updatedData, error } = await 
// .from('income')
// .upsert(data, { onConflict: 'user_id'});
      
      const { data, error } = await 
        .from('income')
        .upsert(incomeData, { onConflict: 'name'});

    //   for (const item of incomeData) {
    //     if (item.name === "") { continue }

    //     const { data, error } = await 
    //       .from("income")
    //       .upsert(
    //         {
    //           user_id: id,
    //           name: item.name,
    //           amount: item.amount,
    //         },
    //         { onConflict: "name" }
    //       );

        // if (error) {
        //   console.log("Error upserting item:", item);
        //   console.error(error);
        // } else {
        //   console.log("Upserted item:", data);
        // }
    //   }

      //   const { error: incomeError } = await 
      //   .from("income")
      //   .upsert(
      //     {
      //       user_id: id,
      //       name: incomeData[0].name,
      //       amount: incomeData[0].amount,
      //     },
      //     { onConflict: "name" }
      //   );

      // const { error: incomeError } = await 
      //   .from("income")
      //   .upsert(incomeData);
      // const { error: expenseError } = await 
      //   .from("expenses")
      //   .insert(expenseData);
      if (incomeError || expenseError) throw new Error("Error saving data");
      console.log("Data saved successfully");
    } catch (error) {
      // console.error(error.message);
    }
  };

  const list_expenses = [
    { id: '01', name: 'Renta / Mortgate', amount: '', category: 'Renta/Mortgage' },
    { id: '02', name: 'Automercado', amount: '', category: 'Comidas' },
    { id: '03', name: 'Deudas estudiantiles', amount: '', category: 'Pago de Deudas' },
    { id: '04', name: 'Lease del Carro', amount: '', category: 'Pago de Deudas' },
    { id: '05', name: 'Cine, Fiestas, etc', amount: '', category: 'Entretenimiento' },
    { id: '06', name: 'Pagos de tarjeta de credito', amount: '', category: 'Pago de Deudas' },
    { id: '07', name: 'Restaurantes', amount: '', category: 'Entretenimiento' },
    { id: '08', name: 'Seguro Médico', amount: '', category: 'Salud y Deporte' },
    { id: '09', name: 'Teléfono', amount: '', category: 'Utilidades' },
    { id: '10', name: 'Electricidad', amount: '', category: 'Utilidades' },
    { id: '11', name: 'Gimnasio', amount: '', category: 'Salud y Deportes' },
    { id: '12', name: '401K o IRA', amount: '', category: 'Otros' },
    { id: '13', name: 'Subscripciones (Netflix, Amazon...)', amount: '', category: 'Entretenimiento' },
    { id: '14', name: 'Internet', amount: '', category: 'Utilidades' },
    { id: '15', name: 'Impuestos', amount: '', category: 'Impuestos' },
    { id: '16', name: 'Extra', amount: '', category: 'Otros' },
    { id: '17', name: 'Extra', amount: '', category: 'Otros' },
    { id: '18', name: 'Extra', amount: '', category: 'Otros' },
  ]
  

  return (
    <div className={styles.dashboard}>
      <div className={styles.banner}>
        <h1>Budget Calculator</h1>
      </div>
      <div className={styles.box}>
        <h2>Step 1: Define your income and expenses</h2>
        <div className={styles.form}>
          <div className={styles.form__income}>
            <h3>Income</h3>
            {income.map((income, index) => (
              <div key={index} className={styles.form__incomeItem}>
                {/* <label htmlFor={`income_${index}`}>Label</label> */}
                <input
                  type="text"
                  id={`income_${index}`}
                  name={`income_${index}`}
                  value={income.name}
                  onChange={(e) => handleIncomeChange(e, index, `name`)}
                  //   onChange={(e) => handleIncomeChange(e, index)}
                />
                <label htmlFor={`amount_${index}`}> Amount </label>
                <input
                  type="number"
                  id={`amount_${index}`}
                  name={`amount_${index}`}
                  value={income.amount}
                  onChange={(e) => handleIncomeChange(e, index, `amount`)}
                />
              </div>
            ))}
            <button onClick={handleAddIncome}>Add Income</button>
          </div>
          <div className={styles.form__expenses}>
            <h3>Expenses</h3>
            {expenses.map((expense, index) => (
              <div key={index} className={styles.form__expenseItem}>
                {/* <label htmlFor={`expense_${index}`}>Label</label> */}
                <input
                  type="text"
                  disabled={expense.name !== ""}
                  id={`expense_${index}`}
                  name={`expense_${index}`}
                  value={expense.name}
                  onChange={(e) => handleExpenseChange(e, index, `name`)}
                />
                <label htmlFor={`amount_${index}`}> Monto: </label>
                <input
                  type="number"
                  id={`amount_${index}`}
                  name={`amount_${index}`}
                  value={expense.amount}
                  onChange={(e) => handleExpenseChange(e, index, `amount`)}
                />
              </div>
            ))}
            <button onClick={handleAddExpense}>Add Expense</button>
          </div>
        </div>
        <button onClick={handleSaveData}>Continue</button>
      </div>
    </div>
  );
};

export default Dashboard;
