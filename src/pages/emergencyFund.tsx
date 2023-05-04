import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUserData } from "./UserDataProvider";

const EmergencyFund = () => {
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const router = useRouter();

  const { userData, setUserData } = useUserData();
//   const { monthlyExpenses, setMonthlyExpenses } = useState<number>(0);
  const monthlyExpenses = userData.expenses;
  const monthsCovered = [3, 4, 5, 6];

  const calculateSavingsNeeded = (months: number): number => {
    return monthlyExpenses * months;
  };

  const calculateMissingSavings = (months: number): number => {
    return currentSavings - calculateSavingsNeeded(months);
  };

  useEffect(() => {
    setCurrentSavings(userData.savings);
    // setMonthlyExpenses(userData.expenses);
  }, [userData]);

  const handleContinue = () => {
    setUserData({ ...userData, savings: currentSavings})
    router.push("goals");
  };

  const differenceDiv = (difference: number, required: number) => {
    const dif = difference / required - 1;
    return (
      <div
        className={`inline-flex gap-2 self-end rounded p-1 text-${
          dif >= 0 ? "green-600 bg-green-100" : "red-600 bg-red-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={`${
              dif > 0
                ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            }`}
          />
        </svg>
        <span className="text-xs font-medium">{`${dif.toFixed(2)}%`}</span>
      </div>
    );
  };

  // JSX
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary">
      <div className="sm:hidden bg-primary w-full">
        <h2 className="text-center font-bold text-4xl m-8 text-white">
          Fondo de Emergencia
        </h2>
      </div>
      <div className="max-w-screen-lg w-full mx-4 bg-white rounded-lg shadow-lg p-8 overflow-y-scroll">
        <h2 className="text-left text-3xl font-bold sm:text-4xl hidden sm:block">
        Fondo de Emergencia
        </h2>

        <p className="mt-4">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut qui hic
          atque tenetur quis eius quos ea neque sunt, accusantium soluta minus
          veniam tempora deserunt? Molestiae eius quidem quam repellat.
        </p>
        <label
          htmlFor="current-saving"
          className="block text-3xl font-medium mt-10"
        >
          Ahorros Actuales
        </label>

        <input
          type="number"
          id="current-saving"
          placeholder="$0"
          value={currentSavings}
          onChange={(e) => setCurrentSavings(Number(e.target.value))}
          className="mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm mb-4"
        />

        <div className="flex flex-col items-baseline">
          <h2 className="text-3xl font-medium mb-4 text-center">
            Meses cubiertos
          </h2>
          {/* grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 self-center">
            {monthsCovered.map((months, index) => {
              const missing = calculateMissingSavings(months);
              return (
                <div key={months}>
                  <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-[0_0_35px_3px_rgba(0,0,0,0.1)] md:w-48 w-36 ">
                    {differenceDiv(
                      currentSavings,
                      calculateSavingsNeeded(months)
                    )}

                    <div>
                      <strong className="block text-sm font-medium">
                        {months} meses
                      </strong>
                      <p>
                        <span className="text-2xl font-medium">
                          {" "}
                          ${calculateSavingsNeeded(months)}{" "}
                        </span>
                      </p>
                      <p>
                        {missing >= 0 ? (
                          <span className="text-sm font-medium">
                            Logrado:
                            <br />
                            +${missing}
                          </span>
                        ) : (
                          <span className="text-sm font-medium">
                            Necesario:
                            <br />
                            -${Math.abs(missing)}
                          </span>
                        )}
                      </p>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
        <button
          className="w-full rounded-md border border-primary bg-primary px-12 py-3 text-sm font-medium text-white mt-4 hidden sm:block"
          onClick={handleContinue}
        >
          Continuar
        </button>
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

export default EmergencyFund;
