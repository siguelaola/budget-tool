import { useRouter } from "next/router";
import { useEffect } from "react";
import { NextPage } from "next";
import { CustomProps } from "../interfaces/interfaces";
import { useUserData } from "../components/UserDataProvider";

const Summary: NextPage<CustomProps> = ({ session }) => {
  const router = useRouter();
  const { userData, setUserData } = useUserData();
  const incomes = userData.totalIncome
  const expenses = userData.expenses
  const savings = userData.savings
  const investments = userData.investments

  useEffect(() => {
    // fetchData();
  }, []);

  const handleContinue = () => {
    router.push("incomes");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white md:bg-background text-primary">
      <div className="sm:hidden bg-primary w-full">
        <h2 className="text-center font-bold text-4xl m-8 text-white">
          Resumen de tu situación
        </h2>
      </div>
      <div className="max-w-screen-lg w-full mx-4 bg-white rounded-lg shadow-lg p-8 overflow-y-scroll">
        <h2 className="text-left text-3xl font-bold sm:text-4xl hidden sm:block">
        Resumen de tu situación
        </h2>
        <p className="text-xl my-8 text-primary ">
          Este documento te da todas las herramientas que necesitas para
          comenzar tu camino de las inversiones. Aquí tienes un resumen de toda
          la información que nos has aportado. Ahora ya solo te queda ponerlo en
          práctica y empezar a invertir!.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-4">
          <Card title="Ingresos" amount={incomes} />

          <Card title="Egresos" amount={expenses} />

          <Card title="Ahorros" amount={savings} />
          <Card title="Invertir" amount={investments} />
        </div>
        <div className="md:flex-row md:align-center md:justify-center space-x-4 hidden md:flex">
          <button
            className="w-full mt-16 rounded-md border border-primary bg-primary px-12 py-3 text-sm font-medium text-white"
            onClick={handleContinue}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="header-download-app block mt-4 lg:inline-block lg:mt-0 text-ola-deep-purple hover:text-ola-light-purple"
              href="/en/download/ios/"
            >
              Descargar Ola Invierte!
            </a>
          </button>
          <button
            className="w-full mt-16 rounded-md border border-primary bg-white px-12 py-3 text-sm font-medium text-bg-primary"
            onClick={handleContinue}
          >
            Volver a empezar
          </button>
        </div>
      </div>
        <div className="w-full mt-4 flex flex-col align-center justify-center md:hidden space-y-2">
          <button
            className="border border-primary bg-primary py-4 text-sm font-medium text-white"
            onClick={handleContinue}
          >
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="header-download-app blocklg:inline-block lg:mt-0 text-ola-deep-purple hover:text-ola-light-purple"
              href="/en/download/ios/"
            >
              Descargar Ola Invierte!
            </a>
          </button>
          <button
            className="w-full border py-4 bg-white text-sm font-medium text-bg-primary"
            onClick={handleContinue}
          >
            Volver a empezar
          </button>
        </div>
    </div>
  );
};

export default Summary;

function Card(props: { title: string; amount: any }) {
  return (
    <article className="bg-white rounded-lg shadow-[0_0_35px_3px_rgba(0,0,0,0.1)] p-4">
      <div className="flex items-center justify-center bg-secondarybg w-12 h-12 rounded-full">
        <svg
          className="w-6 h-6 text-brand"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-primary mt-8 mb-2">
        ${props.amount}
      </h2>
      <p className="text-primary">{props.title}</p>
    </article>
  );
}
