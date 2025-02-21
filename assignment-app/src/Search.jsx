import React, { useState, useEffect } from "react";

function Search() {
  const [query, setQuery] = useState("");  // The keyword to search for
  const [filterType, setFilterType] = useState("Device Model");  // The selected filter type
  const [results, setResults] = useState([]);  // The search results
  const [loading, setLoading] = useState(false);  // Loading state
  const [noResults, setNoResults] = useState(false);  // No results state

  // Function to format numbers, rounding to one decimal place, or as a whole number if appropriate
  const formatNumber = (num, decimalPlaces) => {
    const parsedNum = Number(num);
    if (decimalPlaces === 0 && Number.isInteger(parsedNum)) {
      return parsedNum.toLocaleString('en-US'); // whole number formatting
    } else {
      return parsedNum.toFixed(decimalPlaces); // rounding to specified decimal places
    }
  };

  // Function to calculate the average of a specific key
  const calculateAverage = (data, key) => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
    return Math.round(sum / data.length);  // rounding to whole number
  };

  // Function to calculate the median of a specific key
  const calculateMedian = (data, key, decimalPlaces) => {
    if (data.length === 0) return 0;  // Return 0 if no data
    const sorted = data
      .map((item) => Number(item[key]))
      .filter((value) => !isNaN(value))
      .sort((a, b) => a - b);
    
    if (sorted.length === 0) return 0;  // Return 0 if no valid data for median

    const middle = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle];

    return median === 0 ? 0 : median.toFixed(decimalPlaces);  // rounding to the nearest tenth
  };

  // Function to handle the search action
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNoResults(false);

    try {
      let url = `/api/data/search?filterType=${encodeURIComponent(filterType)}&keyword=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();

      // Filter data locally based on the filterType and query
      const filteredResults = data.filter((item) =>
        item[filterType] && item[filterType].toLowerCase().includes(query.toLowerCase())
      );

      if (filteredResults.length === 0) {
        setNoResults(true);
      } else {
        setResults(filteredResults);
        // Save filtered results to localStorage
        localStorage.setItem('filteredResults', JSON.stringify(filteredResults));
      }
    } catch (error) {
      console.error("Search error:", error);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };

  // Load the filtered results from localStorage when the component mounts
  useEffect(() => {
    const savedResults = localStorage.getItem('filteredResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }

    // Clear results and set noResults state when the page is reloaded
    const handleBeforeUnload = () => {
      setResults([]);
      setNoResults(true);  // Show 'No Records To Display'
      localStorage.removeItem("filteredResults");  // Remove search results from localStorage
    };

    // Listen for the page unload event
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up event listener when component is unmounted
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="container mt-5" style={{ textAlign: "left" }}>
      <form onSubmit={handleSearch} className="mb-3">
        <div className="form-group">
          <label htmlFor="filterType">Select data point to filter search by:</label>
          <div className="mt-2"></div>
          <div style={{ width: "19.17%" }}>
            <select
              className="form-select"
              aria-label="Filter options"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="Device Model">Model</option>
              <option value="Gender">Gender</option>
              <option value="Operating System">Operating System</option>
              <option value="User Behavior Class">Behavior Class</option>
            </select>
          </div>
        </div>

        <div className="mt-4"></div>

        <div style={{ width: "35%" }}>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Search by Keyword"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mt-3"></div>

        <input
          className="form-control"
          type="submit"
          value="Search"
          aria-label="submit button"
          style={{
            padding: "0.375rem 0.75rem",
            border: "1px solid #ced4da",
            borderRadius: "0.375rem",
            fontSize: "1rem",
            cursor: "pointer",
            width: "35%" 
          }}
        />
      </form>

      <div className="mt-3">
        {loading ? <p>Loading...</p> : noResults ? <p>No Records To Display</p> : <p>Displaying {results.length} Records</p>}
      </div>

      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">App Usage Time (min/day)</h5>
              <p className="card-text">
                Average: {formatNumber(calculateAverage(results, "App Usage Time (min/day)"), 0)} Minutes
              </p>
              <p className="card-text">
                Median: {noResults ? 0 : calculateMedian(results, "App Usage Time (min/day)", 1)} Minutes
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Screen On Time (hours/day)</h5>
              <p className="card-text">
                Average: {formatNumber(calculateAverage(results, "Screen On Time (hours/day)"), 0)} Hours
              </p>
              <p className="card-text">
                Median: {noResults ? 0 : calculateMedian(results, "Screen On Time (hours/day)", 1)} Hours
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Number of Apps Installed</h5>
              <p className="card-text">
                Average: {formatNumber(calculateAverage(results, "Number of Apps Installed"), 0)} Apps
              </p>
              <p className="card-text">
                Median: {noResults ? 0 : calculateMedian(results, "Number of Apps Installed", 0)} Apps
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Age</h5>
              <p className="card-text">
                Average: {formatNumber(calculateAverage(results, "Age"), 0)} Years Old
              </p>
              <p className="card-text">
                Median: {noResults ? 0 : calculateMedian(results, "Age", 0)} Years Old
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Device Model</th>
              <th>Operating System</th>
              <th>App Usage Time (min/day)</th>
              <th>Screen On Time (hours/day)</th>
              <th>Battery Drain (mAh/day)</th>
              <th>Number of Apps Installed</th>
              <th>Data Usage (MB/day)</th>
              <th>Age</th>
              <th>Gender</th>
              <th>User Behavior Class</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result["User ID"]}</td>
                <td>{result["Device Model"]}</td>
                <td>{result["Operating System"]}</td>
                <td>{formatNumber(result["App Usage Time (min/day)"], 0)}</td>
                <td>{formatNumber(result["Screen On Time (hours/day)"], 0)}</td>
                <td>{formatNumber(result["Battery Drain (mAh/day)"], 0)}</td>
                <td>{formatNumber(result["Number of Apps Installed"], 0)}</td>
                <td>{formatNumber(result["Data Usage (MB/day)"], 0)}</td>
                <td>{formatNumber(result["Age"], 0)}</td>
                <td>{result["Gender"]}</td>
                <td>{result["User Behavior Class"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Search;
