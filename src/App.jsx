import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [jsonString, setJsonString] = useState('{"key": {"myKey":"value"}, "other":"mykey1", "items":{"id":1,"name":"asscend","typeof":"Linx"},"anotherItems":{"id":1,"items":[{"id":0,"name":"hola","category":"Wave"}]}}');
  const [tableData, setTableData] = useState([]);

  const [prefixItems, setPrefixItems] = useState('.');

  useEffect(() => {
    transformJsonToTable();
  }, [jsonString]);

  const transformJsonToTable = () => {
    try {
      const json = JSON.parse(jsonString);
      const tableRows = [];

      const flattenObject = (obj, prefix = '') => {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const newKey = prefix ? `${prefix}${prefixItems}${key}` : key;

            if (typeof value === 'object' && value !== null) {
              if (Array.isArray(value)) {
                value.forEach((item, index) => {
                  if (typeof item === 'object' && item !== null) {
                    flattenObject(item, `${newKey}`);
                  } else {
                    console.log(item);
                    tableRows.push({ key: `${newKey}`, value: item });
                  }
                });
              }
              else {
                flattenObject(value, newKey);
              }
            } else {
              tableRows.push({ key: newKey, value: value });
            }
          }
        }
      };

      flattenObject(json);
      setTableData(tableRows);

    } catch (error) {
      // console.error("Error parsing JSON:", error);
      setTableData([]);
    }
  };

  useEffect(() => {
    transformJsonToTable();
  }, [prefixItems])

  return (
    <div className="App">
      <h1>Transform your JSON into a table</h1>
      <div className="card">
        <div>
          <h2>Json to Convert</h2>
          <textarea
            onChange={(e) => setJsonString(e.target.value)}
            value={jsonString}
            rows="10"
            cols="50"
          />
        </div>
        <div>
          <h2>Select the prefix</h2>
          <select onChange={(e) => setPrefixItems(e.target.value)} value={prefixItems}>
            <option key={"."} value=".">.</option>
            <option key={"--"} value="--">--</option>
            <option key={"->"} value="->">{'->'}</option>
            <option key={"::"} value="::">::</option>
            <option key={"~"} value="~">~</option>
            <option key={"=>"} value="=>">{'=>'}</option>
            <option key={"**"} value="**">**</option>
          </select>
        </div>
      </div>
      <div className="card">
        <table border={1} cellPadding={5} cellSpacing={0}>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.key}</td>
                <td>{row.value ? row.value.toString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
