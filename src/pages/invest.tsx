import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../utils";
import { AppContext } from "./AppProvider";
import { NextPage } from "next";
import { CustomProps } from "./interfaces";
// import { useFinancialData } from "./FinancialDataProvider";

import { useUserData } from "./UserDataProvider";

const Invest: NextPage<CustomProps> = ({ session }) => {
  const router = useRouter();
//   const { appState, updateInvestments } = useContext(AppContext);

//   const { financialData, setFinancialData } = useFinancialData();

//   const handleUpdateFinancialData = (newData) => {
//     setFinancialData({ ...financialData, ...newData });
//   };

    const { userData, setUserData } = useUserData();

//   const handleAddIncome = (amount: number) => {
//     const newIncome = userData.totalIncome + amount;
//     setUserData({ ...userData, totalIncome: newIncome });
//   };



  const disponible = userData.totalIncome - userData.expenses;
  const [mensual, setMensual] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, []);

  const handleMontoDisponibleChange = (value: number) => {
    setMensual(value);
  };

  async function fetchData() {
    const { data, error } = await supabase
      .from("investments")
      .select("monthly");

    if (error) console.error("Error fetch investments: ", error);
    else if (data.length > 0 && data[0]["monthly"] !== undefined)
      Number(setMensual(data[0]["monthly"]));
    else {
      setMensual(disponible);
    }
  }

  const handleContinue = async () => {
    const { data, error } = await supabase.from("investments").upsert({
      user_id: session.user.id,
      monthly: mensual,
    });

    if (error) {
      console.error(error);
    } else {
        setUserData({ ...userData, investments: mensual })
    //   updateInvestments(mensual);
      router.push("summary");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary">
      <div className="sm:hidden bg-primary w-full">
        <h2 className="text-center font-bold text-4xl m-8 text-white">
          Monto a invertir
        </h2>
      </div>
      <div className="max-w-screen-lg w-full mx-4 bg-white rounded-lg shadow-lg p-8 overflow-y-scroll">
        <div className="mx-auto max-w-screen-xl py-4 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold sm:text-4xl hidden md:block">
              Monto a invertir
            </h2>
            <p className="text-base md:mt-4">
              Define el monto que quieres invertir mensualmente, el anual se va
              a calcular solo. Puedes ver donde puedes reducir gastos para
              invertir un monto más alto.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-8">
            <div className="relative sm:h-80 lg:h-full space-y-8 py-8">
              <article className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-[0_0_15px_15px_rgba(0,0,0,0.1)] lg:shadow-xl">
                <span className="rounded-full bg-secondarybg p-3 text-brand">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>

                <div className="h-1/2">
                  <p className=" text-2xl font-medium">{disponible}</p>
                  <p className="text-sm">Ingresos - egresos</p>
                </div>
              </article>
              <article className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-[0_0_15px_15px_rgba(0,0,0,0.1)] lg:shadow-xl">
                <span className="rounded-full bg-secondarybg p-3 text-brand">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </span>

                {disponible - mensual < 0 ? (
                  <div className="h-1/2">
                    <p className=" text-2xl font-medium">
                      -${Math.abs(disponible - mensual)}
                    </p>

                    <p className="text-sm text-gray-500">Insuficiente</p>
                  </div>
                ) : (
                  <div className="h-1/2">
                    <p className=" text-2xl font-medium">
                      ${disponible - mensual}
                    </p>

                    <p className="text-sm text-gray-500">Sobrante</p>
                  </div>
                )}
              </article>
            </div>

            <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-[0_0_15px_15px_rgba(0,0,0,0.1)] md:shadow-xl">
              <p className="text-xl font-bold">Mensual</p>
              <label
                htmlFor="monthly"
                className="relative block overflow-hidden rounded-md border border-gray-200 px-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <input
                  type="number"
                  id="monthly"
                  placeholder=""
                  value={mensual}
                  onChange={(e) =>
                    handleMontoDisponibleChange(Number(e.target.value))
                  }
                  className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                />
              </label>

              <h1 className="text-xl font-bold">Anual</h1>
              <label
                htmlFor="yearly"
                className="relative block overflow-hidden rounded-md border border-gray-200 px-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <input
                  type="text"
                  id="yearly"
                  readOnly={true}
                  value={mensual * 12}
                  className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                />
              </label>
            </article>
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

export default Invest;
