import React, { useState, useEffect } from 'react';
import './App.css'; // Asegúrate de que Tailwind esté configurado correctamente aquí

function App() {
  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [privateKey, setPrivateKey] = useState('');
  const [amount, setAmount] = useState('');
  const [apiCall, setApiCall] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [warningAccepted, setWarningAccepted] = useState(false); // Estado para la advertencia

  // Hacemos la llamada a la API de validadores
  useEffect(() => {
    fetch('/api/validators')
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos de la API:", data);
        setValidators(data.systemData.validators);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handleDelegate = (validator) => {
    const weiAmount = amount;

    const apiUrl = `/api/delegate?pk=${encodeURIComponent(privateKey)}&amount=${weiAmount}&validator=${encodeURIComponent(validator.validator)}`;

    setApiCall(apiUrl); // Muestra la URL generada en la UI

    // Realiza la llamada con GET
    fetch(apiUrl, {
      method: 'GET',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        setApiResponse(data); 
      })
      .catch((error) => {
        setApiResponse({ error: error.message });
      });
  };

  // Si el estado de warningAccepted es false, muestra la advertencia
  if (!warningAccepted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
        <h1 className="text-4xl font-bold text-red-600">¡WARNING!</h1>
        <p className="text-lg text-center mt-4 text-gray-300">
          YOU MUST USE A BURNER WALLET, THIS IS A TESTNET
        </p>
        <button
          onClick={() => setWarningAccepted(true)}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          OK
        </button>
      </div>
    );
  }

  // Si está cargando los datos, muestra un indicador de carga
  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  // Si hay un error, muestra el mensaje de error
  if (error) {
    return <div className="text-white">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Validators List</h1>

      {/* Cajas de texto para Private Key y Amount */}
      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="private-key">Private Key</label>
        <input
          type="text"
          id="private-key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          className="w-full p-2 border border-gray-700 bg-black text-white mb-4"
        />

        <label className="block mb-1 font-medium" htmlFor="amount">Amount (wei)</label> {/* Cambiado a Amount (wei) */}
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-700 bg-black text-white"
        />
      </div>

      <div className="overflow-x-auto relative">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-black">
            <tr>
              <th scope="col" className="px-6 py-3">Validator</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Description</th>
              <th scope="col" className="px-6 py-3">Recent Blocks</th>
              <th scope="col" className="px-6 py-3">Stake</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {validators.map((validator) => (
              <tr key={validator.validator} className="bg-black border-b border-gray-700">
                <td className="px-6 py-4">{validator.validator}</td>
                <td className="px-6 py-4">{validator.name}</td>
                <td className="px-6 py-4">{validator.description}</td>
                <td className="px-6 py-4">{validator.nRecentBlocks}</td>
                <td className="px-6 py-4">{validator.stake.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`font-bold ${validator.isJailed ? 'text-red-500' : 'text-green-500'}`}>
                    {validator.isJailed ? 'Jailed' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelegate(validator)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Delegate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mostramos la llamada a la API debajo de la tabla */}
      {apiCall && (
        <div className="mt-4 p-4 w-full border border-gray-700 bg-black rounded">
          <h2 className="font-bold">API Call:</h2>
          <p className="text-gray-400">{apiCall}</p>
        </div>
      )}

      {/* Mostramos la respuesta de la API debajo de la llamada a la API */}
      {apiResponse && (
        <div className="mt-4 p-4 w-full border border-gray-700 bg-black rounded">
          <h2 className="font-bold">API Response:</h2>
          <pre className="text-gray-400">{apiResponse}</pre>
        </div>
      )}
    </div>
  );
}

export default App;


