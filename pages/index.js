import Link from "next/link";
export default function Home() {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h1>Welcome to School Directory</h1>
        <p>
          <Link href="/addSchool">Add School</Link>
          <Link href="/showSchools">Show Schools</Link>
        </p>
      </div>
    );
  }
  
