import React, { useState, useEffect, useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { useRouter } from "next/router";
import "chart.js/auto";
import { NextPage } from "next";
import { CustomProps } from "./interfaces";
import { supabase } from "../../utils";
import { useUserData } from "./UserDataProvider";

type Expense = {
  id?: string;
  name: string;
  amount: number;
  category: string;
};

type ExpenseInput = {
  name: string;
  amount: string;
  category: string;
};

type Category = {
  id: string;
  name: string;
};

const Expenses: NextPage<CustomProps> = ({ session }) => {
  const router = useRouter();
  const { userData, setUserData } = useUserData();

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      name: "Renta / Mortgage",
      amount: 0,
      category: "Renta/Mortgage",
    },
    {
      name: "Automercado",
      amount: 0,
      category: "Comidas",
    },
    {
      name: "Deudas estudiantiles",
      amount: 0,
      category: "Pago de Deudas",
    },
    {
      name: "Lease del Carro",
      amount: 0,
      category: "Pago de Deudas",
    },
    {
      name: "Cine, Fiestas, etc.",
      amount: 0,
      category: "Entretenimiento",
    },
    {
      name: "Pagos de tarjeta de credito",
      amount: 0,
      category: "Pago de Deudas",
    },
    {
      name: "Restaurantes",
      amount: 0,
      category: "Entretenimiento",
    },
    {
      name: "Seguro Medico",
      amount: 0,
      category: "Salud y Deporte",
    },
    {
      name: "Telefono",
      amount: 0,
      category: "Utilidades",
    },
    {
      name: "Electricidad",
      amount: 0,
      category: "Utilidades",
    },
    {
      name: "Gimnasio",
      amount: 0,
      category: "Salud y Deportes",
    },
    {
      name: "401K or IRA",
      amount: 0,
      category: "Otros",
    },
    {
      name: "Subscripciones (Netflix, Amazon...)",
      amount: 0,
      category: "Entretenimiento",
    },
    {
      name: "Internet",
      amount: 0,
      category: "Utilidades",
    },
    {
      name: "Impuestos",
      amount: 0,
      category: "Impuestos",
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([]);

  const categoryExpenses = categories.map((category) => {
    const expensesForCategory = expenses.filter(
      (expense) => expense.category === category.name
    );
    const totalAmountForCategory = expensesForCategory.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );
    return { category, amount: totalAmountForCategory };
  });

  const defaultData = {
    datasets: [
      {
        data: [1],
        backgroundColor: ["#695bff"],
        borderColor: ["#695bff"],
        borderWidth: 1,
      },
    ],
    labels: ["No Data Available"],
  };

  const chartData = {
    labels: categoryExpenses.map(({ category }) => category.name),
    datasets: [
      {
        data: categoryExpenses.map(({ amount }) => amount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#d43b3b",
          "#d44697",
          "#9b59b6",
          "#34495e",
          "#16a085",
          "#27ae60",
          "#f1c40f",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#d43b3b",
          "#d44697",
          "#9b59b6",
          "#34495e",
          "#16a085",
          "#27ae60",
          "#f1c40f",
        ],
      },
    ],
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (data === null) {
        return;
      }

      setCategories(data as Category[]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase.from("expenses").select("*");

      if (data === null) {
        return;
      }

      if (error) console.log("Error fetching incomes:", error);
      else if (data.length > 0) setExpenses(data as Expense[]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      fetchCategories();
      fetchExpenses();
    }

    fetchData();
  }, []);

  const [expenseInput, setExpenseInput] = useState<ExpenseInput>({
    name: "",
    amount: "",
    category: "",
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          filter(item: any, data: any) {
            return data.datasets[0].data[item.index] > 0;
          },
        },
      },
    },
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setExpenseInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddExpense = async () => {
    const { name, amount, category } = expenseInput;
    if (name && amount && category) {
      const { data, error } = await supabase
        .from("expenses")
        .insert({ ...expenseInput, user_id: session?.user.id })
        .select();

      if (data === null) {
        return;
      }

      setExpenses((prevState) => [
        ...prevState,
        {
          name,
          amount: parseFloat(amount),
          category,
          id: data[0].id,
        },
      ]);
      setExpenseInput({ name: "", amount: "", category: "" });
    }
  };

  const handleContinue = async () => {
    const expensesData = expenses.map((expense) => ({
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      user_id: session?.user.id,
    }));

    const { data, error } = await supabase
      .from("expenses")
      .upsert(expensesData, { onConflict: "user_id, name" });

    setUserData({ ...userData, expenses: expensesTotal });

    router.push("emergencyFund");
  };

  const handleExpenseUpdate = (data: Expense) => {
    // console.log(data)
    setExpenses((prevExpenses) => {
      const updatedExpenses = prevExpenses.map((expense) => {
        // console.log(expense.id, " ", data.id)
        if (expense.name === data.name) {
            // console.log(expense)
          return { ...expense, amount: data.amount };
        } else {
            console.log("not update")
          return expense;
        }
      });
      return updatedExpenses;
    });
  };

  const expensesTotal = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary">
      <div className="sm:hidden bg-primary w-full">
        <h2 className="text-center font-bold text-4xl m-8 text-white">
          Define tus egresos mensuales
        </h2>
      </div>
      <div className="max-w-screen-lg w-full mx-4 bg-white rounded-lg shadow-lg p-8 overflow-y-scroll">
        <h2 className="text-left text-3xl font-bold sm:text-4xl hidden sm:block">
          Define tus egresos mensuales
        </h2>
        <div className="flex flex-col justify-center items-center space-y-4 text-primary">
          <div className="text-leading">
            <p className="mt-4">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut qui
              hic atque tenetur quis eius quos ea neque sunt, accusantium soluta
              minus veniam tempora deserunt? Molestiae eius quidem quam
              repellat.
            </p>
          </div>
          <div className="flex flex-col xl:flex-row justify-center items-center p-1 md:p-8">
            <div className="md:w-3/4 mx-auto">
              <div className="mx-auto">
                <div className="table-container overflow-x-scroll text-sm">
                  <table className="w-screen md:w-full table-fixed text-left mt-4">
                    <thead className="bg-brand text-white">
                      <tr>
                        <th className="border px-4 py-2 font-bold">
                          Egresos mensuales
                        </th>
                        <th className="border px-4 py-2 font-bold">Monto</th>
                        <th className="border px-4 py-2 font-bold">
                          Categoría
                        </th>
                        <th className="border px-4 py-2 font-bold">
                          Porcentaje de gasto
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-xs md:text-base">
                      {expenses.map((expense, index) => (
                        <tr key={index}>
                          <td className="border px-1 md:px-4 py-2">{expense.name}</td>
                          <td className="border px-1 md:px-4 py-2">
                            <input
                              type="text"
                              name="amount"
                              value={expense.amount}
                              onChange={(e) => {
                                const newValue = parseFloat(e.target.value);
                                console.log("new value: ", newValue)
                                expense.amount = !Number.isNaN(newValue)
                                  ? newValue
                                  : 0;
                                handleExpenseUpdate(expense);
                              }}
                              placeholder="Monto"
                              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md border-gray-300 px-2 py-1"
                            />
                          </td>
                          <td className="border px-1 md:px-4 py-2">
                            {expense.category}
                          </td>
                          <td className="border px-1 md:px-4 py-2">
                            {expensesTotal === 0
                              ? "0%"
                              : (
                                  (expense.amount / expensesTotal) *
                                  100
                                ).toFixed(2) + "%"}
                          </td>
                        </tr>
                      ))}
                      <tr>
                      <td className="border px-1 md:px-4 py-2 text-center">
                          <input
                            type="text"
                            name="name"
                            value={expenseInput.name}
                            onChange={handleInputChange}
                            placeholder="Egreso"
                            className="w-full focus:outline-none text-xs md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md border-gray-300 px-2 py-1"
                          />
                        </td>
                        <td className="border px-1 md:px-4 py-2 text-center">
                          <input
                            type="text"
                            name="amount"
                            value={expenseInput.amount}
                            onChange={handleInputChange}
                            placeholder="Monto"
                            className="w-20 focus:outline-none focus:ring-2 text-xs md:text-base focus:ring-blue-500 focus:border-transparent rounded-md border-gray-300 px-2 py-1"
                          />
                        </td>
                        <td className="border px-1 md:px-4 py-2">
                          <select
                            name="category"
                            value={expenseInput.category}
                            onChange={handleInputChange}
                            className="w-full text-xs pr-10 focus:outline-none text-xs md:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-md border-gray-300 px-2 py-1"
                          >
                            <option value="">Select</option>
                            {categories.map((category) => (
                              <option key={category.name} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border md:px-4 py-2 text-center">
                          <button
                            onClick={handleAddExpense}
                            className="bg-brand text-white font-bold py-2 px-4 rounded"
                          >
                            Agregar
                          </button>
                        </td>
                      </tr>
                      <tr className="bg-brand text-white">
                        <td
                          className="text-center border px-4 py-2 font-bold text-base"
                          colSpan={2}
                        >
                          Egresos totales
                        </td>
                        <td
                          className="text-center border px-4 py-2 font-bold text-base"
                          colSpan={2}
                        >
                          {getTotalExpensesAmount(expenses)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="w-full xl:w-2/5 p-4 mx-auto sticky top-0">
              <div className="bg-white rounded-md mt-16 shadow-[0_0_15px_15px_rgba(0,0,0,0.1)] lg:shadow-xl p-16 h-full">
                <div className="text-center text-xl font-bold mb-4">
                  Distribución de Gastos
                </div>
                <div>
                  <Doughnut
                    data={expensesTotal > 0 ? chartData : defaultData}
                    options={options}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            className="w-full rounded-md border border-primary bg-primary px-12 py-3 text-sm font-medium text-white mt-4 hidden sm:block"
            onClick={handleContinue}
          >
            Continuar
          </button>
        </div>
      </div>
        <button
          className="w-full h-16 border border-primary bg-primary px-12 py-3 text-sm font-medium text-white md:hidden"
          onClick={handleContinue}
        >
          Continuar
        </button>
    </div>
  );
};

const getTotalExpensesAmount = (expenses: Expense[]) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export default Expenses;
