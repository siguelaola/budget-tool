import React, { useState, useEffect } from "react";
import styles from "./expenses.module.css";
import { supabaseClient } from "../../utils";
import { Doughnut } from "react-chartjs-2";
import { useRouter } from "next/router";
import "chart.js/auto";

type Expense = {
  id: string;
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

const Expenses = () => {
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([
    {
        id: "123",
      name: "Renta / Mortgage",
      amount: 0,
      category: "Renta/Mortgage",
    },
    {
        id: "124",
      name: "Automercado",
      amount: 0,
      category: "Comidas",
    },
    {
        id: "125",
      name: "Deudas estudiantiles",
      amount: 0,
      category: "Pago de Deudas",
    },
    {
        id: "126",
      name: "Lease del Carro",
      amount: 0,
      category: "Pago de Deudas",
    },
    {
        id: "127",
      name: "Cine, Fiestas, etc.",
      amount: 0,
      category: "Entretenimiento",
    },
    {
        id: "128",
      name: "Pagos de tarjeta de credito",
      amount: 0,
      category: "Pago de Deudas",
    },
    {
        id: "129",
      name: "Restaurantes",
      amount: 0,
      category: "Entretenimiento",
    },
    {
      id: "130",
      name: "Seguro Medico",
      amount: 0,
      category: "Salud y Deporte",
    },
    {
      id: "131",
      name: "Telefono",
      amount: 0,
      category: "Utilidades",
    },
    {
      id: "100",
      name: "Electricidad",
      amount: 0,
      category: "Utilidades",
    },
    {
      id: "110",
      name: "Gimnasio",
      amount: 0,
      category: "Salud y Deportes",
    },
    {
      id: "120",
      name: "401K or IRA",
      amount: 0,
      category: "Otros",
    },
    {
      id: "130",
      name: "Subscripciones (Netflix, Amazon...)",
      amount: 0,
      category: "Entretenimiento",
    },
    {
      id: "140",
      name: "Internet",
      amount: 0,
      category: "Utilidades",
    },

    {
      id: "150",
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
      const { data, error } = await supabaseClient
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
      const { data, error } = await supabaseClient.from("expenses").select("*");

      //   if (data === null) {
      //     return;
      //   }

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
    plugins: {
      legend: {
        display: true,
        position: "right",
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

  const handleAddExpense = () => {
    const { name, amount, category } = expenseInput;
    if (name && amount && category) {
      setExpenses((prevState) => [
        ...prevState,
        {
          id: Date.now().toString(),
          name,
          amount: parseFloat(amount),
          category,
        },
      ]);
      setExpenseInput({ name: "", amount: "", category: "" });
    }
  };

  const goNext = async () => {
    const response = supabaseClient.auth.getUser();
    let id = (await response).data.user?.id;

    if (id === undefined) {
      router.push("dashboard");
    }

    const expensesData = expenses.map((expense) => ({
        name: expense.name, 
        amount: expense.amount, 
        category: expense.category,
        user_id: id,
      }));

    const { data, error } = await supabaseClient
      .from("expenses")
      .upsert(expensesData, { onConflict: "user_id, name" });

    router.push({
      pathname: "emergencyFund",
      query: { expenses: expensesTotal, income: router.query.income},
    }, "emergencyFund");
  };

  const handleExpenseUpdate = (data: Expense) => {
    setExpenses((prevExpenses) => {
      const updatedExpenses = prevExpenses.map((expense) => {
        if (expense.id === data.id) {
          return { ...expense, amount: data.amount };
        } else {
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
    <div className={styles.expensesContainer}>
      <div className={styles.expensesView}>
        <div className={styles.container}>
          <h2 className={styles.header}>Introduce tus egresos mensuales</h2>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Egresos mensuales</th>
                  <th>Monto</th>
                  <th>Categoría</th>
                  <th>Porcentaje de gasto</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.name}</td>
                    <td>
                      <input
                        type="text"
                        name="amount"
                        value={expense.amount}
                        onChange={(
                          e: React.ChangeEvent<
                            HTMLInputElement | HTMLSelectElement
                          >
                        ) => {
                          // if (e.target.value.substring)
                          const newValue = parseFloat(e.target.value);
                          expense.amount = !Number.isNaN(newValue)
                            ? newValue
                            : 0;
                          handleExpenseUpdate(expense);
                        }}
                        placeholder="Monto"
                      />
                    </td>
                    <td>{expense.category}</td>
                    <td>
                      {expensesTotal == 0
                        ? "0%"
                        : ((expense.amount / expensesTotal) * 100).toFixed(2) +
                          "%"}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={expenseInput.name}
                      onChange={handleInputChange}
                      placeholder="Egreso"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="amount"
                      value={expenseInput.amount}
                      onChange={handleInputChange}
                      placeholder="Monto"
                    />
                  </td>
                  <td>
                    <select
                      name="category"
                      value={expenseInput.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => {
                        return (
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        );
                      })}
                    </select>
                  </td>
                  <td>
                    <button onClick={handleAddExpense}>Agregar</button>
                  </td>
                </tr>
                <tr>
                  <td className={styles.total}>Egresos totales:</td>
                  <td className={styles.total}>
                    {getTotalExpensesAmount(expenses)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button onClick={goNext}>Continue</button>
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.chartTitle}>Distribución de Gastos</div>
          {expensesTotal > 0 ? (
            <div className="expenses-chart">
              <Doughnut data={chartData} options={options} />
            </div>
          ) : (
            <div className="expenses-message">
              <p>Fill the expenses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getTotalExpensesAmount = (expenses: Expense[]) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export default Expenses;
