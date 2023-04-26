import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabaseClient } from "../../utils";
import styles from "./incomes.module.css";

type Income = {
  // id: string;
  name: string;
  amount: number;
};

export default function Incomes() {
  const router = useRouter();
  const [incomes, setIncomes] = useState<Income[]>([]);

  const fetchIncomes = async () => {
    const { data, error } = await supabaseClient.from("income").select("*");

    if (error) console.log("Error fetching incomes:", error);
    else if (data.length > 0) setIncomes(data as Income[]);
    else
      setIncomes([
        { name: "Salario", amount: 0 },
        { name: "Ingreso Adicional 1", amount: 0 },
        { name: "Ingreso Adicional 2", amount: 0 },
      ]);
  };

  const upsertIncomes = async () => {

    const id = (await supabaseClient.auth.getUser()).data.user?.id

    if (id === undefined) { 
        router.replace('dashboard')
        return
     }

    const incomesData = incomes.map((income) => ({ ...income, user_id: id}))

    const { error } = await supabaseClient.from("income").upsert(incomesData);
    if (error) console.log("Error upserting incomes:", error);
    else {
        router.push({
            pathname: 'expenses',
            query: { income: totalIncome },
        }, 'expenses')
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  type PropertyName = "name" | "amount";


  const handleChange = (index: number, property: PropertyName, value: any) => {
    const newIncomes = [...incomes];
    newIncomes[index][property] = value;
    setIncomes(newIncomes);
  };

  const handleUpsertClick = () => {
    upsertIncomes();
  };

  // Calculate total income
  const totalIncome = incomes.reduce(
    (total, income) => total + Number(income.amount),
    0
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Define tu flujo de caja</h1>
      <table className={styles.incomesTable}>
        <thead>
          <tr>
            <th>Ingresos mensuales</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income, index) => (
            <tr key={index}>
              <td>
                <input
                type="text"
                value={income.name}
                onChange={(event) => handleChange(index, "name", event.target.value)}/>
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={income.amount}
                  onChange={(event) => handleChange(index, "amount", parseFloat(event.target.value))}
                  />
                $
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <p>Total ingresos</p>
            </td>
            <td>${totalIncome.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <button className={styles.upsertButton} onClick={handleUpsertClick}>
        Siguiente
      </button>
    </div>
  );
}
