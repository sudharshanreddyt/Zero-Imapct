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

      const getRandomAge = () => {
        // Generate a random age between 18 and 80
        return Math.floor(Math.random() * (80 - 18 + 1)) + 18;
      };
      
      const getRandomGender = () => {
        // Randomly select a gender from the list
        const genders = ["Male", "Female", "Other"];
        return genders[Math.floor(Math.random() * genders.length)];
      };

      const details = {
        age: getRandomAge(),
        gender: getRandomGender()
      };

      if (details) {
        setPatientDetails(details);
        console.log(patientId);
        
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
      const response = await fetch('http://127.0.0.1:8000/get_recommendations/', {
        method: 'POST', // Specify the request method as POST
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({ patient_id: patientId }), // Include the patient_id in the body
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meal data');
      }

      const data = await response.json();
      console.log(data);
      
      setMealData(data);

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
          <p><strong>Patient Id:</strong> {patientId}</p>
          <p><strong>Age:</strong> {patientDetails.age}</p>
          <p><strong>Gender:</strong> {patientDetails.gender}</p>
        </div>
      )}

      <div className="meal-plan-container">
        <button onClick={handleFetchMealData} className="fetch-meal-button">
          Fetch Meal Plan
        </button>
      </div>

      {mealData && (
        <div className="meal-data">
          <h3>Meal Plan Details</h3>
          <div className="meal-cards-container">
            {/* Breakfast Card */}
            {mealData.meal_plans.Breakfast && (
              <div className="meal-card">
                <h3>Breakfast</h3>
                <ul>
                  {mealData.meal_plans.Breakfast.foods.map((food, index) => (
                    <li key={index}>
                      <strong>{food.food}</strong> ({food.measure}) - {food.calories} kcal
                    </li>
                  ))}
                </ul>
                <div className="meal-totals">
                  <p><strong>Total Calories:</strong> {mealData.meal_plans.Breakfast.totals.calories}</p>
                  <p><strong>Protein:</strong> {mealData.meal_plans.Breakfast.totals.protein}g</p>
                  <p><strong>Carbs:</strong> {mealData.meal_plans.Breakfast.totals.carbs}g</p>
                  <p><strong>Fat:</strong> {mealData.meal_plans.Breakfast.totals.fat}g</p>
                </div>
              </div>
            )}

            {/* Lunch Card */}
            {mealData.meal_plans.Lunch && (
              <div className="meal-card">
                <h3>Lunch</h3>
                <ul>
                  {mealData.meal_plans.Lunch.foods.map((food, index) => (
                    <li key={index}>
                      <strong>{food.food}</strong> ({food.measure}) - {food.calories} kcal
                    </li>
                  ))}
                </ul>
                <div className="meal-totals">
                  <p><strong>Total Calories:</strong> {mealData.meal_plans.Lunch.totals.calories}</p>
                  <p><strong>Protein:</strong> {mealData.meal_plans.Lunch.totals.protein}g</p>
                  <p><strong>Carbs:</strong> {mealData.meal_plans.Lunch.totals.carbs}g</p>
                  <p><strong>Fat:</strong> {mealData.meal_plans.Lunch.totals.fat}g</p>
                </div>
              </div>
            )}

            {/* Dinner Card */}
            {mealData.meal_plans.Dinner && (
              <div className="meal-card">
                <h3>Dinner</h3>
                <ul>
                  {mealData.meal_plans.Dinner.foods.map((food, index) => (
                    <li key={index}>
                      <strong>{food.food}</strong> ({food.measure}) - {food.calories} kcal
                    </li>
                  ))}
                </ul>
                <div className="meal-totals">
                  <p><strong>Total Calories:</strong> {mealData.meal_plans.Dinner.totals.calories}</p>
                  <p><strong>Protein:</strong> {mealData.meal_plans.Dinner.totals.protein}g</p>
                  <p><strong>Carbs:</strong> {mealData.meal_plans.Dinner.totals.carbs}g</p>
                  <p><strong>Fat:</strong> {mealData.meal_plans.Dinner.totals.fat}g</p>
                </div>
              </div>
            )}
          </div>
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