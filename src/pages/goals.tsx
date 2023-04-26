import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./goals.module.css";
import { v4 as uuid } from "uuid";
import { supabaseClient } from "../../utils";

interface Goal {
  id: string;
  objetivo: string;
  monto: number;
}

const Goals = () => {
  const router = useRouter();
  const disponible = Number(router.query.disponible);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: uuid(),
      objetivo: "",
      monto: 0,
    },
  ]);

  useEffect(() => {
    async function fetchData() {
        try {
            const { data, error } = await supabaseClient.from('goals').select("goals")
            
            if (data === null) {
                return;
            }

            setGoals(data[0]["goals"] as Goal[])
        } catch (error) {
            console.error(error)
        }
    }

    fetchData()
  }, [])

  const handleObjetivoChange = (id: string, objetivo: string) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, objetivo } : goal
    );
    setGoals(updatedGoals);
  };

  const handleMontoChange = (id: string, monto: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, monto } : goal
    );
    setGoals(updatedGoals);
  };

  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    setGoals(updatedGoals);
  };

  const handleAddGoal = () => {
    const newGoal: Goal = {
      id: uuid(),
      objetivo: "",
      monto: 0,
    };
    setGoals([...goals, newGoal]);
  };

  const handleContinue = async () => {
    try {
      const user = supabaseClient.auth.getUser();
      const id = (await user).data.user?.id
      if (!user || id === undefined) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabaseClient
        .from("goals")
        .upsert({
          user_id: id,
          goals: goals
        })
        .single();
      if (error) {
        throw error;
      }

      router.push({
        pathname: "invest",
        query: { disponible: disponible },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Objetivos</h1>
      <div className={styles.section}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Objetivo</th>
              <th>Monto</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id}>
                <td>
                  <input
                    type="text"
                    value={goal.objetivo}
                    onChange={(e) =>
                      handleObjetivoChange(goal.id, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={goal.monto}
                    onChange={(e) =>
                      handleMontoChange(goal.id, Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    X{/* <FontAwesomeIcon icon={faTrash} /> */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.addButtonContainer}>
          <button className={styles.addButton} onClick={handleAddGoal}>
            {/* <FontAwesomeIcon icon={faPlus} />  */}
            Agregar objetivo
          </button>
        </div>
      </div>
      {/* <div className={styles.section}>
        <h2 className={styles.title}>Disponibilidad</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tiempo</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mensual</td>
              <td>
                {disponible}
              </td>
            </tr>
            <tr>
              <td>Anual</td>
              <td>${disponible * 12}</td>
            </tr>
          </tbody>
        </table>
      </div> */}
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Goals;
