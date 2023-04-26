import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./emergencyFund.module.css";

const EmergencyFund = () => {
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const router = useRouter();

  const { income, expenses } = router.query;
  const monthlyIncome = typeof income === "string" ? Number(income) : 0;
  const monthlyExpenses = typeof expenses === "string" ? Number(expenses) : 0;
  const monthsCovered = [3, 4, 5, 6];

  const calculateSavingsNeeded = (months: number): number => {
    return monthlyExpenses * months;
  };

  const calculateMissingSavings = (months: number): number => {
    return calculateSavingsNeeded(months) - currentSavings;
  };

  const handleContinue = () => {
    router.push({
        pathname: "goals",
        query: { disponible: Number(income) - Number(expenses) }
    }, 'goals')
  }

  // JSX
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fondo de Emergencia</h1>
      <div className={styles.sectionLeft}>
        <div className={styles.section2}>
          {/* <h2 className={styles.subtitle}>Agrega tus ahorros actuales:</h2> */}
          <label htmlFor="current-savings" className={styles.label}>
            Ahorros Actuales &emsp;
          </label>
          <input
            type="number"
            id="current-savings"
            name="current-savings"
            className={styles.input}
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Number(e.target.value))}
          />
        </div>
        <div className={styles.sectionRight}>
          <h2 className={styles.title}>Meses cubiertos</h2>
          <div className={styles.gridContainer}>
            {monthsCovered.map((months, index) => {
              const missing = calculateMissingSavings(months);
              return (
                <div key={months} className={styles.gridItem}>
                  <div className={styles.column}>
                    <h3 className={styles.subheading}>{`${months} meses`}</h3>
                    <div className={styles.secondaryText}>
                      {`Ahorros necesarios: $${calculateSavingsNeeded(months)}`}
                    </div>
                  </div>
                  <div
                    className={`${styles.column} ${
                      missing <= 0 ? styles.negative : styles.cubierto
                    } `}
                  >
                    <div className={styles.subheading}>
                      {missing > 0 ? `-$${missing}` : "Cubierto"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default EmergencyFund;
