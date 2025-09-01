// pages/index.js
export default function Home() {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h1>Welcome to School Directory</h1>
        <p>
          <a href="/addSchool">Add School</a> |{" "}
          <a href="/showSchools">Show Schools</a>
        </p>
      </div>
    );
  }
  