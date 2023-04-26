import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./invest.module.css";
import { supabaseClient } from "../../utils";

const Invest = () => {
  const router = useRouter();
  const [disponible, setDisponible] = useState<number>(0);
  const [mensual, setMensual] = useState<number>(0);

  useEffect(() => {
    fetchData();

    // const disponible = Number(router.query.disponible);
    // if (Number.isNaN(disponible)) {
    //   return;
    // }

    // setDisponible(disponible);
    // setMensual(disponible);
  }, []);

  const handleMontoDisponibleChange = (value: number) => {
    setMensual(value);
  };

  async function fetchData() {
    // const id = (await supabaseClient.auth.getSession()).data.session?.user.id;

    // if (id !== undefined) {
    // router.replace('dashboard')
    // return
    // }

    const { data, error } = await supabaseClient
      .from("investments")
      .select("monthly")

    if (error) console.error("Error fetch investments: ", error);
    else if (data.length > 0 && data[0]["monthly"] !== undefined) Number(setMensual(data[0]["monthly"]));
    else {
        console.log('aa')
      const disponible = Number(router.query.disponible);
      if (Number.isNaN(disponible)) {
        return;
      }

      setDisponible(disponible);
      setMensual(disponible);
    }
  }

  const handleContinue = async () => {
    const response = supabaseClient.auth.getUser();
    let id = (await response).data.user?.id;

    if (id === undefined) {
      router.push("dashboard");
    }

    const { data, error } = await supabaseClient.from("investments").upsert({
      user_id: id,
      monthly: mensual,
    });

    if (error) {
      console.error(error);
    } else {
      router.push({
        pathname: "invest",
        //   query: { expenses: expensesTotal },
      }, 'invest');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Montos a invertir</h1>
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
              <input
                type="number"
                value={mensual}
                onChange={(e) =>
                  handleMontoDisponibleChange(Number(e.target.value))
                }
              />
            </td>
          </tr>
          <tr>
            <td>Anual</td>
            <td>{mensual * 12}</td>
          </tr>
        </tbody>
      </table>
      <div className={styles.box}>
        <div className={styles.boxHeader}>Ingreso - Egreso</div>
        <div className={styles.boxContent}>{disponible}</div>
      </div>
      {/* <div className={styles.boxText}>
        Monto disponible para invertir. Calculado en el primer paso.
      </div> */}
      <button className={styles.button} onClick={handleContinue}>
        Continuar
      </button>
    </div>
  );
};

export default Invest;
