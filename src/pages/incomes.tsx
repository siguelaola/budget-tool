import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { CustomProps } from "./interfaces";
import { supabase } from "../../utils";
import { useUserData } from "./UserDataProvider";

type Income = {
  id?: string;
  name: string;
  amount: number;
};

const Incomes: NextPage<CustomProps> = ({ session }) => {
  const router = useRouter();
  const [incomes, setIncomes] = useState<Income[]>([{ name: "", amount: 0 }]);

  const { userData, setUserData } = useUserData();

  const [input, setInput] = useState<Income>({
    name: "",
    amount: 0,
  });

  const fetchIncomes = async () => {
    const { data, error } = await supabase.from("income").select("*");
    if (error) console.log("Error fetching incomes:", error);
    else if (data.length > 0) setIncomes(data as Income[]);
    else setIncomes([{ name: "Salario", amount: 0 }]);
  };

  const handleContinue = async () => {
    const incomesData = incomes.map(({ name, amount, id }) => ({
      name,
      amount,
      ...(id && { id }),
      user_id: session.user.id,
    }));

    const { data, error } = await supabase.from("income").upsert(incomesData, {
      onConflict: "id",
    });

    setUserData({ ...userData, totalIncome: totalIncome });

    if (error) console.log("Error upserting incomes:", error);
    else {
      router.push("expenses");
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  type PropertyName = "name" | "amount" | keyof Income;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddIncome = async () => {
    const { name, amount } = input;
    if (name && amount) {
      const { data, error } = await supabase
        .from("income")
        .insert({ ...input, user_id: session.user.id })
        .select();

      if (data === null) {
        return;
      }

      setIncomes((prevState) => [
        ...prevState,
        {
          id: data[0].id,
          name: name,
          amount: amount,
        },
      ]);
      setInput({ name: "", amount: 0 });
    }
  };

  const handleChange = (
    index: number,
    property: PropertyName,
    value: string | number
  ) => {
    const newIncomes = [...incomes];
    newIncomes[index] = {
      ...newIncomes[index],
      [property]: value,
    };
    setIncomes(newIncomes);
  };

  // Calculate total income
  const totalIncome = incomes.reduce(
    (total, income) => total + Number(income.amount),
    0
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary">
      <div className="sm:hidden bg-primary w-full">
        <h2 className="text-center font-bold text-4xl m-8 text-white">
          Define tus ingresos
        </h2>
      </div>
      <div className="max-w-screen-lg w-full mx-4 bg-white rounded-lg shadow-lg p-8 overflow-y-scroll">
        <h2 className="text-left text-3xl font-bold sm:text-4xl hidden sm:block">
          Define tus ingresos
        </h2>

        <p className="mt-4 text-primary">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut qui hic
          atque tenetur quis eius quos ea neque sunt, accusantium soluta minus
          veniam tempora deserunt? Molestiae eius quidem quam repellat.
        </p>

        <div className="flex flex-col items-start justify-center">
          {" "}
          {/* overflow-x-auto */}
          <table className="my-4 divide-y-2 divide-gray-200 text-l items-start w-full">
            <thead className="text-left">
              <tr>
                <th className="whitespace-nowrap px-2 py-2 font-medium text-primary">
                  Ingresos Mensuales
                </th>
                <th className="whitespace-nowrap px-2 py-2 font-medium text-primary">
                  Monto
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {incomes.map((income, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-primary">
                    <input
                      type="text"
                      id={`Name_${index}`}
                      value={income.name}
                      onChange={(event) =>
                        handleChange(index, "name", event.target.value)
                      }
                      className="w-full rounded border-gray-200 [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-primary">
                    <input
                      type="number"
                      id={`Monto_${index}`}
                      value={income.amount}
                      onChange={(event) =>
                        handleChange(
                          index,
                          "amount",
                          parseFloat(event.target.value)
                        )
                      }
                      className="w-full rounded border-gray-200 [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>
                  {/* <td className="whitespace-nowrap px-4 py-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleRemoveIncome(index)}
                    >
                      Eliminar
                    </button>
                  </td> */}
                </tr>
              ))}
              <tr>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-primary">
                  <input
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={handleInputChange}
                    placeholder="Ingreso"
                    className="w-full rounded border-gray-200 [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-primary">
                  <input
                    type="text"
                    name="amount"
                    value={input.amount}
                    onChange={handleInputChange}
                    placeholder="Monto"
                    className="w-full rounded border-gray-200 [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-2 font-medium text-primary hidden md:table-cell">
                  <button
                    onClick={handleAddIncome}
                    className="w-full bg-brand hover:bg-primary text-white font-bold py-2 px-4 rounded"
                  >
                    Agregar
                  </button>
                </td>
              </tr>
              <tr className="md:hidden items-center">
                <td
                  className="mx-auto whitespace-nowrap px-4 py-2 font-medium text-primary"
                  colSpan={4}
                >
                  <button
                    onClick={handleAddIncome}
                    className="w-full bg-brand items-center justify-center align-center text-white font-bold py-2 px-4 rounded inline-block"
                  >
                    Agregar
                  </button>
                </td>
              </tr>

              <tr>
                <td className="whitespace-nowrap font-bold px-4 py-2 text-primary">
                  <p>Total ingresos</p>
                </td>
                <td className="whitespace-nowrap font-bold px-4 py-2 text-primary">
                  ${totalIncome.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
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

export default Incomes;
