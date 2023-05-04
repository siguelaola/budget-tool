import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./goals.module.css";
import { v4 as uuid } from "uuid";
import { supabase } from "../../utils";
import { CustomProps } from "../interfaces/interfaces";

interface Goal {
  id: string;
  objetivo: string;
  monto: number;
}

const Goals = ({ session }: CustomProps) => {
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
        const { data, error } = await supabase
          .from("goals")
          .select("goals");

        if (data === null) {
          return;
        }

        if (data[0].goals.length > 0) {
          setGoals(data[0]["goals"] as Goal[]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

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

  const handleDeleteGoal = async (id: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    const oldGoals = goals;

    setGoals(updatedGoals);

    const { data, error } = await supabase
      .from("goals")
      .upsert({
        goals: updatedGoals,
        user_id: session.user.id,
      })
      .select();

    if (data === null) {
      setGoals(oldGoals);
    }
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
    const filtered = goals.filter((goal) => goal.monto > 0);

    try {
      const { data, error } = await supabase
        .from("goals")
        .upsert({
          user_id: session.user.id,
          goals: filtered,
        })
        .single();
      if (error) {
        throw error;
      }

      router.push("invest");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white md:bg-background text-primary">
      <div className="sm:hidden bg-primary w-full">
        <h2 className="text-center font-bold text-4xl m-8 text-white">
          Define tus objetivos
        </h2>
      </div>
      <div className="max-w-screen-lg w-full mx-4 bg-white rounded-lg md:shadow-lg p-8 space-y-4 flex-grow md:grow-0">
        <h2 className="text-left text-3xl font-bold sm:text-4xl hidden sm:block">
          Define tus objetivos
        </h2>

        <p className="mt-4 text-primary">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut qui hic
          atque tenetur quis eius quos ea neque sunt, accusantium soluta minus
          veniam tempora deserunt? Molestiae eius quidem quam repellat.
        </p>
        <div className="overflow-y-auto text-primary">
          <table className="min-w-full divide-y-2 divide-gray-200 text-base border-separate border-spacing-2">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap pr-2 py-2 font-medium">
                  Objetivo
                </th>
                <th className="whitespace-nowrap pr-2 py-2 font-medium">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody>
              {goals.map((goal) => (
                <tr key={goal.id}>
                  <td className="whitespace-nowrap pr-2 py-2 font-medium">
                    <input
                      type="text"
                      value={goal.objetivo}
                      className="w-full rounded border-gray-200 text-center [-moz-appearance:_textfield] text-base [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
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
                      className="w-full rounded border-gray-200 text- [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>
                  <td>
                    <button
                      className="w-full inline-block rounded bg-brand px-4 py-2 text-base font-medium text-white text-center"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <button
              className="w-full inline-block rounded bg-brand px-4 py-2 text-base font-medium text-white"
              onClick={handleAddGoal}
            >
              Agregar objetivo
            </button>
          </div>
        </div>
        <button
          className="w-full rounded-md border border-primary bg-primary px-12 py-3 text-sm font-medium text-white mt-4 hidden sm:block"
          onClick={handleContinue}
        >
          Continuar
        </button>
      </div>
      <span className="flex flex-grow md:hidden"></span>
      <button
        className="w-full h-16 border border-primary bg-primary px-12 py-3 text-sm font-medium text-white md:hidden"
        onClick={handleContinue}
      >
        Continuar
      </button>
    </div>
  );
};

export default Goals;
