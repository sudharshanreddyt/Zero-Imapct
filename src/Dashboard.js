import { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const handleLogout = async () => {
    // logout from the system
    window.location.href = "/login";
  };

  const [patientId, setPatientId] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState("");
  const [mealPlan, setMealPlan] = useState(1); // Default meal plan
  const [mealData, setMealData] = useState(null); // Meal data state
  const [farmers, setFarmers] = useState(null); // Farmers data state
  const [topMarkets, setTopMarkets] = useState([]);

  const handleSearch = async () => {
    try {
      // Simulate fetching patient details from the database
      // const response = await fetch(`/api/patients/${patientId}`);
      // const data = await response.json();
      // if (response.ok) {
      //     setPatientDetails(data);
      //     setError("");
      // }
      if (!patientId) {
        return;
      }

      const details = {
        name: "Harry Potter",
        age: 24,
        gender: "Male",
        healthInfo: {
          bp: 143,
        },
      };

      if (details) {
        setPatientDetails(details);
        setError("");
      } else {
        setError("Patient not found");
        setPatientDetails(null);
      }
    } catch (error) {
      setError("An error occurred while fetching patient details");
      setPatientDetails(null);
    }
  };

  const handleGeolocationSuccess = async (position) => {
    const { latitude, longitude } = position.coords;
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    try {
      // Simulate fetching farmers data from the API
      const response = await fetch('http://localhost:5000/top-farmers-and-markets'); // Replace with your API endpoint
      console.log({response});
      
      const data = await response.json();

      if (response.ok) {
        setFarmers(data.topFarmers);
        setTopMarkets(data.topMarkets);
      } else {
        setError("Failed to fetch farmers data");
      }
    } catch (error) {
      setError("An error occurred while fetching farmers data");
    }
  };

  const handleGeolocationError = (error) => {
    console.error("Error fetching geolocation:", error.message);
    setError("Unable to fetch your location. Please try again.");
  };

  const fetchGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleFetchMealData = async () => {
    try {
      // Simulate fetching meal data based on the selected plan
      const dummyMealData = {
        1: {
          breakfast: "Oatmeal with fruits",
          lunch: "Grilled chicken salad",
          dinner: "Quinoa with vegetables",
        },
        2: {
          breakfast: "Scrambled eggs with toast",
          lunch: "Vegetable stir-fry",
          dinner: "Salmon with steamed broccoli",
        },
        3: {
          breakfast: "Smoothie with spinach and banana",
          lunch: "Lentil soup with whole grain bread",
          dinner: "Grilled tofu with quinoa",
        },
      };

      const data = dummyMealData[mealPlan];
      if (data) {
        setMealData(data);
      } else {
        setError("Meal plan not found");
        setMealData(null);
      }
    } catch (error) {
      setError("An error occurred while fetching meal data");
      setMealData(null);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="logout-button-container">
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <h2>Welcome to the Dashboard</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="patient-id-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {patientDetails && (
        <div className="patient-details">
          <h3>Patient Details</h3>
          <p><strong>Name:</strong> {patientDetails.name}</p>
          <p><strong>Age:</strong> {patientDetails.age}</p>
          <p><strong>Gender:</strong> {patientDetails.gender}</p>
          <p><strong>Blood Pressure:</strong> {patientDetails.healthInfo.bp}</p>
        </div>
      )}

      <div className="meal-plan-container">
        <select
          value={mealPlan}
          onChange={(e) => setMealPlan(Number(e.target.value))}
          className="meal-plan-dropdown"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
        <button onClick={handleFetchMealData} className="fetch-meal-button">
          Fetch Meal Plan
        </button>
      </div>

      {mealData && (
        <div className="meal-data">
          <h3>Meal Plan Details</h3>
          <p><strong>Breakfast:</strong> {mealData.breakfast}</p>
          <p><strong>Lunch:</strong> {mealData.lunch}</p>
          <p><strong>Dinner:</strong> {mealData.dinner}</p>
        </div>
      )}

      <button onClick={fetchGeolocation} className="fetch-farmers-button">
        Find Farmers Nearby
      </button>

      <br />
      {farmers && (
        <div className="farmers-data">
          <h3>Farmers Nearby</h3>
          <div className="farmers-grid">
            {farmers.map((farmer, index) => (
              <div key={index} className="farmer-card">
              <h4>{farmer.MarketName}</h4>
                <p><strong>Milk:</strong> ${farmer.MilkPrice}</p>
                <p><strong>Eggs:</strong> ${farmer.EggsPrice}</p>
                <p><strong>Bread:</strong> ${farmer.BreadPrice}</p>
                <p><strong>Bananas:</strong> ${farmer.BananasPrice}</p>
                <p><strong>Tomatoes:</strong> ${farmer.TomatoesPrice}</p>
                <p><strong>Honey:</strong> ${farmer.HoneyPrice}</p>
                <p><strong>Jam:</strong> ${farmer.JamPrice}</p>
                <p><strong>Cheese:</strong> ${farmer.CheesePrice}</p>
                <p><strong>Meat:</strong> ${farmer.MeatPrice}</p>
                <p><strong>Lettuce:</strong> ${farmer.LettucePrice}</p>
                <p><strong>Apples:</strong> ${farmer.ApplesPrice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {topMarkets.length > 0 && (
        <div className="top-markets">
          <h3>Top Markets</h3>
          <ul className="markets-list">
            {topMarkets.map((market, index) => (
              <li key={index} className="market-item">
                {market}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default Dashboard;